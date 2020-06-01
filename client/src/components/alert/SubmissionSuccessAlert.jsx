import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const SubmissionSuccessAlert = ({ message, reference, handleOnClose }) => {
  const { t } = useTranslation();
  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-full">
        <div className="govuk-panel govuk-panel--confirmation">
          <h2 className="govuk-panel__title">
            {message}
          </h2>
          {reference ? (
            <div className="govuk-panel__body">
              <strong>
                {t('pages.form.submission.your-reference',
                  { reference })}
              </strong>
            </div>
          ) : null }
          <div className="govuk-!-margin-top-5">
            <button
              type="button"
              id="closeConfirmation"
              className="govuk-button govuk-button--secondary"
              onClick={handleOnClose}
            >
              {t('pages.form.submission.close')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

SubmissionSuccessAlert.defaultProps = {
  handleOnClose: () => {},
};

SubmissionSuccessAlert.propTypes = {
  message: PropTypes.string.isRequired,
  reference: PropTypes.string.isRequired,
  handleOnClose: PropTypes.func,
};

export default SubmissionSuccessAlert;
