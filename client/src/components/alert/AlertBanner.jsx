import React, { useContext } from 'react';
import { AlertContext } from '../../utils/AlertContext';
import SubmissionSuccessAlert from './SubmissionSuccessAlert';
import ApiErrorAlert from './ApiErrorAlert';
import FormErrorsAlert from './FormErrorsAlert';

const AlertBanner = () => {
  const { alertContext, setAlertContext } = useContext(AlertContext);

  if (!alertContext) {
    return null;
  }
  const { type, status } = alertContext;

  if (type === 'form-submission' && status === 'successful') {
    return (
      <SubmissionSuccessAlert
        message={alertContext.message}
        reference={alertContext.reference}
        handleOnClose={() => {
          setAlertContext(null);
        }}
      />
    );
  }
  if (type === 'api-error') {
    return <ApiErrorAlert errors={alertContext.errors} />;
  }

  if (type === 'form-error') {
    const { errors, form } = alertContext;
    return <FormErrorsAlert errors={errors} form={form} />;
  }
  return null;
};

export default AlertBanner;
