import { useTranslation } from 'react-i18next';
import React, { useContext } from 'react';
import { SubmissionContext } from '../utils/SubmissionContext';

const SubmissionConfirmation = () => {
  const { t } = useTranslation();
  const { submissionContext, updateSubmissionContext } = useContext(SubmissionContext);

  if (!submissionContext) {
    return null;
  }
  const { message, reference } = submissionContext;

  return message && reference ? (
    <>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-full">
          <div className="govuk-panel govuk-panel--confirmation">
            <h2 className="govuk-panel__title">
              {message}
            </h2>
            <div className="govuk-panel__body">
              <strong>
                {t('pages.form.submission.your-reference',
                  { reference })}
              </strong>
            </div>
            <div className="govuk-!-margin-top-5">
              <button
                type="button"
                id="closeConfirmation"
                className="govuk-button govuk-button--secondary"
                onClick={() => updateSubmissionContext(null)}
              >
                {t('pages.form.submission.close')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  ) : null;
};

export default SubmissionConfirmation;
