import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { Formio, Form } from 'react-formio';
import moment from 'moment';
import _ from 'lodash';
import PropTypes from 'prop-types';
import gds from '@digitalpatterns/formio-gds-template';
import Loader from '@highpoint/react-loader-advanced';
import { BLACK, WHITE } from 'govuk-colours';
import { AlertContext } from '../../utils/AlertContext';
import { augmentRequest, interpolate } from '../../utils/formioSupport';
import Logger from '../../utils/logger';
import ApplicationSpinner from '../ApplicationSpinner';
import FileService from '../../utils/FileService';

Formio.use(gds);

const DisplayForm = ({
  form, handleOnCancel, handleOnSubmit, existingSubmission,
  interpolateContext,
  submitting,
}) => {
  const { alertContext, setAlertContext } = useContext(AlertContext);
  const [submissionData, setSubmissionData] = useState(null);
  const formRef = useRef();
  const host = `${window.location.protocol}//${window.location.hostname}${window.location.port
    ? `:${window.location.port}` : ''}`;

  const [keycloak] = useKeycloak();
  /* istanbul ignore next */
  Formio.baseUrl = host;
  Formio.projectUrl = host;
  Formio.plugins = [
    augmentRequest(keycloak, form.id),
  ];

  const fileService = new FileService(keycloak);

  const [time, setTime] = useState({
    start: null,
    end: null,
    submitted: false,
  });

  useEffect(() => {
    if ((form && form.name) && time.end) {
      Logger.info({
        token: keycloak.token,
        path: `/form/${form.id}`,
        message: {
          log: time.submitted ? 'Form has been submitted' : 'Form has been cancelled',
          name: form.name,
          submitted: time.submitted,
          ...time,
          completionTimeInSeconds: moment.duration(moment(time.end)
            .diff(moment(time.start))).asSeconds(),
        },
      });
    }
  }, [time, keycloak.token, form]);

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
        (error) => data.changed
              && (error.component.key !== data.changed.component.key));

      if (errors.length === 0) {
        setAlertContext(null);
      } else {
        setAlertContext({
          type: 'form-error',
          errors,
          form: formRef.current,
        });
      }
    }
  };

  interpolate(form, {
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
      roles: keycloak.tokenParsed.realm_access.roles,
      groups: keycloak.tokenParsed.groups,

    },
    ...interpolateContext,
  });
  return (
    <Loader
      show={submitting}
      message={<ApplicationSpinner translationKey="submitting" colour={BLACK} />}
      foregroundStyle={{ color: BLACK }}
      backgroundStyle={{ backgroundColor: WHITE }}
    >
      <Form
        form={form}
        ref={formRef}
        onFormLoad={() => {
          const start = new Date();
          setTime({
            ...time,
            start,
          });
        }}
        onNextPage={() => {
          window.scrollTo(0, 0);
        }}
        onPrevPage={() => {
          window.scrollTo(0, 0);
        }}
        submission={existingSubmission}
        onSubmit={() => {
          setTime({
            ...time,
            end: new Date(),
            submitted: true,
          });
          handleOnSubmit(submissionData);
        }}
        onChange={(data) => {
          setSubmissionData(data);
          if (formRef.current) {
            validate(formRef.current.formio, data);
          }
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
          fileService,
          hooks: {
            beforeCancel: async () => {
              setTime({
                ...time,
                end: new Date(),
                submitted: false,
              });
              handleOnCancel();
            },
            buttonSettings: {
              showCancel: true,
            },
            beforeSubmit: (submission, next) => {
              const {
                versionId, id, title, name,
              } = form;
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
    </Loader>
  );
};

DisplayForm.defaultProps = {
  existingSubmission: null,
  interpolateContext: null,
  submitting: false,
};

DisplayForm.propTypes = {
  form: PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    versionId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    components: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  handleOnCancel: PropTypes.func.isRequired,
  handleOnSubmit: PropTypes.func.isRequired,
  existingSubmission: PropTypes.shape({ root: PropTypes.object }),
  interpolateContext: PropTypes.shape({ root: PropTypes.object }),
  submitting: PropTypes.bool,
};

export default DisplayForm;
