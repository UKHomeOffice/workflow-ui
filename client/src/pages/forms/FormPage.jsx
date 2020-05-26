import React, {
  useContext,
  useEffect, useRef, useState,
} from 'react';
import PropTypes from 'prop-types';
import { Formio, Form } from 'react-formio';
import gds from '@digitalpatterns/formio-gds-template';
import axios from 'axios';
import { useKeycloak } from '@react-keycloak/web';
import { useNavigation } from 'react-navi';

import moment from 'moment';
import _ from 'lodash';
import { useAxios, useIsMounted } from '../../utils/hooks';
import ApplicationSpinner from '../../components/ApplicationSpinner';
import { augmentRequest, interpolate } from '../../utils/formioSupport';
import Logger from '../../utils/logger';
import apiHooks from './hooks';
import { AlertContext } from '../../utils/AlertContext';

Formio.use(gds);

const FormPage = ({ formId }) => {
  const { submitForm } = apiHooks();
  const { alertContext, setAlertContext } = useContext(AlertContext);
  const formRef = useRef();

  const [keycloak] = useKeycloak();
  /* istanbul ignore next */
  Formio.plugins = [
    augmentRequest(keycloak, formId),
  ];

  const [time, setTime] = useState({
    start: null,
    end: null,
    submitted: false,
  });
  const isMounted = useIsMounted();
  const navigation = useNavigation();

  const [form, setForm] = useState({
    isLoading: true,
    data: null,
  });

  const [submissionData, setSubmissionData] = useState(null);

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

  const loggerRef = useRef(Logger);

  useEffect(() => {
    const logger = loggerRef.current;
    if ((form.data && form.data.name) && time.end) {
      logger.info({
        token: keycloak.token,
        path: `/form/${formId}`,
        message: {
          log: time.submitted ? 'Form has been submitted' : 'Form has been cancelled',
          name: form.data.name,
          submitted: time.submitted,
          ...time,
          completionTimeInSeconds: moment.duration(moment(time.end)
            .diff(moment(time.start))).asSeconds(),
        },
      });
    }
  }, [time, keycloak.token, form.data, formId]);

  if (form.isLoading) {
    return <ApplicationSpinner />;
  }
  if (form.data) {
    interpolate(form.data, {
      keycloakContext: {
        accessToken: keycloak.token,
        refreshToken: keycloak.refreshToken,
        sessionId: keycloak.tokenParsed.session_state,
        email: keycloak.tokenParsed.email,
        givenName: keycloak.tokenParsed.given_name,
        familyName: keycloak.tokenParsed.family_name,
        subject: keycloak.subject,
        url: keycloak.authServerUrl,
        realm: keycloak.realm,
      },
    });
  }

  const validate = (formInstance, data) => {
    if (!formInstance || !alertContext) {
      return;
    }
    let instance;

    // eslint-disable-next-line no-underscore-dangle
    if (formInstance._form.display === 'wizard') {
      instance = formInstance.currentPage;
    } else {
      instance = formInstance;
    }

    if (instance && instance.isValid(data.value, true)) {
      setAlertContext(null);
    } else {
      const errors = _.filter(alertContext.errors,
        (error) => data.changed && (error.component.key !== data.changed.component.key)
         && !data.changed.isValid);
      setAlertContext({
        type: 'form-error',
        errors,
        form: formRef.current,
      });
    }
  };

  return (
    !form.data ? null : (
      <Form
        form={form.data}
        ref={formRef}
        onFormLoad={() => {
          const start = new Date();
          setTime({
            ...time,
            start,
          });
        }}
        onSubmit={() => {
          setTime({
            ...time,
            end: new Date(),
            submitted: true,
          });
          submitForm(submissionData, form, formId);
        }}
        onChange={(data) => {
          setSubmissionData(data);
          validate(formRef.current.formio, data);
        }}
        onError={(errors) => {
          setAlertContext({
            type: 'form-error',
            errors,
            form: formRef.current,
          });
        }}
        options={{
          breadcrumbSettings: {
            clickable: false,
          },
          noAlerts: true,
          hooks: {
            beforeCancel: async () => {
              setTime({
                ...time,
                end: new Date(),
                submitted: false,
              });
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
