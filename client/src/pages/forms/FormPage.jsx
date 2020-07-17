import React, {
  useEffect, useState,
} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useNavigation } from 'react-navi';
// eslint-disable-next-line import/no-extraneous-dependencies
import FormioUtils from 'formiojs/utils';
import { useAxios, useIsMounted } from '../../utils/hooks';
import ApplicationSpinner from '../../components/ApplicationSpinner';
import apiHooks from './hooks';
import DisplayForm from '../../components/form/DisplayForm';

const FormPage = ({ formId }) => {
  const { submitForm } = apiHooks();
  const isMounted = useIsMounted();
  const navigation = useNavigation();
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    isLoading: true,
    data: null,
  });

  const axiosInstance = useAxios();

  useEffect(() => {
    const source = axios.CancelToken.source();

    const loadForm = async () => {
      if (axiosInstance) {
        try {
          const formKey = await axiosInstance.get(`/camunda/engine-rest/process-definition/key/${formId}/startForm`, {
            cancelToken: source.token,
          });
          if (formKey && formKey.data) {
            const { key } = formKey.data;
            const formResponse = await axiosInstance.get(`/form/name/${key}`);
            if (isMounted.current) {
              setForm({
                isLoading: false,
                data: formResponse.data,
              });
            }
          } else {
            setForm({
              isLoading: false,
              data: null,
            });
          }
        } catch (e) {
          if (isMounted.current) {
            setForm({
              isLoading: false,
              data: null,
            });
          }
        }
      }
    };

    loadForm().then(() => {});
    return () => {
      source.cancel('cancelling request');
    };
  }, [axiosInstance, formId, setForm, isMounted, setSubmitting]);

  if (form.isLoading) {
    return <ApplicationSpinner />;
  }

  if (!form.data) {
    return null;
  }
  const businessKeyComponent = FormioUtils.getComponent(form.data.components, 'businessKey');

  return (
    <DisplayForm
      submitting={submitting}
      handleOnCancel={async () => {
        await navigation.navigate('/forms');
      }}
      interpolateContext={
        {
          businessKey: businessKeyComponent ? businessKeyComponent.defaultValue : null,
        }
      }
      form={form.data}
      handleOnSubmit={(data) => {
        setSubmitting(true);
        submitForm(data, form.data, formId, () => {
          setSubmitting(false);
        });
      }}
    />
  );
};

FormPage.propTypes = {
  formId: PropTypes.string.isRequired,
};
export default FormPage;
