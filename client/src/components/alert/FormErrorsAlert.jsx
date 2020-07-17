import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import parse from 'html-react-parser';
import { v4 as uuidv4 } from 'uuid';
import { Form } from 'react-formio';

const FormErrorsAlert = ({ form, errors }) => {
  const { t } = useTranslation();
  if (errors.length === 0 || !form) {
    return <div />;
  }
  const updatedErrors = errors.map((error) => ({
    message: error.message,
    instance: form.formio.getComponent(error.component.key),
  }));

  return (
    <div
      className="govuk-error-summary"
      aria-labelledby="error-summary-title"
      role="alert"
      tabIndex="-1"
      data-module="govuk-error-summary"
    >
      <h2 className="govuk-error-summary__title" id="error-summary-title">
        {t('pages.form.error.form.title')}
      </h2>
      <div className="govuk-error-summary__body">
        <ul className="govuk-list govuk-error-summary__list">
          {updatedErrors.map(({ message, instance }) => (
            <li key={uuidv4()}>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  instance.focus();
                }}
              >
                <div id="message">{parse(message)}</div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

FormErrorsAlert.propTypes = {
  form: PropTypes.instanceOf(Form).isRequired,
  errors: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default FormErrorsAlert;
