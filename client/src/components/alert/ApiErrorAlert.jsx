import React from 'react';
import { useTranslation } from 'react-i18next';
import PropType from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import config from 'react-global-configuration';
import { ERROR_COLOUR } from 'govuk-colours';

const ApiErrorAlert = ({
  errors,
}) => {
  const { t } = useTranslation();

  if (errors.length === 0) {
    return null;
  }

  const buildMessage = (err) => {
    const { status, message } = err;
    let errorMessage;
    switch (status) {
      case 409:
        errorMessage = t('error.409');
        break;
      case 404:
        errorMessage = `${message}`;
        break;
      case 401:
      case 403:
        errorMessage = t('error.401/403');
        break;
      case 400:
        errorMessage = t('error.400');
        break;
      default:
        errorMessage = t('error.50x');
    }
    return <li key={uuidv4()}><h4 style={{ color: ERROR_COLOUR }} className="govuk-heading-s">{errorMessage}</h4></li>;
  };

  return (
    <div
      className="govuk-error-summary"
      aria-labelledby="error-summary-title"
      role="alert"
      tabIndex="-1"
      data-module="govuk-error-summary"
    >
      <h2 className="govuk-error-summary__title" id="error-summary-title">
        {t('error.title')}
      </h2>
      <div className="govuk-error-summary__body">
        <ul className="govuk-list govuk-error-summary__list">
          {errors.map(buildMessage)}
        </ul>
      </div>
      <h4 className="govuk-heading-s">
        {t('error.contact-support')}
        {' '}
        <a
          className="govuk-link"
          rel="noopener noreferrer"
          target="_blank"
          href={config.get('serviceDeskUrl')}
        >
          here
        </a>
      </h4>
      <details className="govuk-details">
        <summary className="govuk-details__summary">
          <span className="govuk-details__summary-text">
            {t('error.details')}
          </span>
        </summary>
        <div className="govuk-details__text">
          <div className="govuk-error-summary__body">
            <ul className="govuk-list govuk-list--bullet govuk-error-summary__list">
              {errors.map((error) => {
                const { path, status } = error;
                return (
                  <li key={uuidv4()}>
                    {t('error.error-info', { path, status })}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </details>

    </div>
  );
};

ApiErrorAlert.propTypes = {
  errors: PropType.arrayOf(PropType.shape({
    message: PropType.string.isRequired,
    path: PropType.string.isRequired,
    exception: PropType.object,
    status: PropType.number.isRequired,
  })).isRequired,
};

export default ApiErrorAlert;
