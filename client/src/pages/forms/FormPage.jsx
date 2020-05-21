import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Formio, Form } from 'react-formio';
import gds from '@digitalpatterns/formio-gds-template';
import axios from 'axios';
import { useKeycloak } from '@react-keycloak/web';
import { useNavigation } from 'react-navi';

import { useAxios, useIsMounted } from '../../utils/hooks';
import ApplicationSpinner from '../../components/ApplicationSpinner';
import { augmentRequest } from '../../utils/formioSupport';


Formio.use(gds);

const FormPage = ({ formId }) => {
  const [keycloak] = useKeycloak();
  /* istanbul ignore next */
  Formio.plugins = [
    augmentRequest(keycloak, formId),
  ];

  const isMounted = useIsMounted();
  const navigation = useNavigation();

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
          const formKey = await axiosInstance.get(`/camunda/engine-rest/process-definition/${formId}/startForm`, {
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
  }, [axiosInstance, formId, setForm, isMounted]);

  if (form.isLoading) {
    return <ApplicationSpinner />;
  }
  return (
    !form.data ? <div>Oops!</div> : (
      <Form
        form={form.data}
        options={{
          breadcrumbSettings: {
            clickable: false,
          },
          noAlerts: true,
          hooks: {
            beforeCancel: async () => {
              await navigation.navigate('/forms');
            },
            buttonSettings: {
              showCancel: true,
            },
            beforeSubmit: (submission, next) => {
              const formio = form.data;
              const {
                versionId, id, title, name,
              } = formio;
              // eslint-disable-next-line no-param-reassign
              submission.data.form = {
                formVersionId: versionId,
                formId: id,
                title,
                name,
                submissionDate: new Date(),
                submittedBy: keycloak.tokenParsed.email,
              };
              next();
            },
          },
        }}
      />
    )
  );
};


FormPage.propTypes = {
  formId: PropTypes.string.isRequired,
};
export default FormPage;
