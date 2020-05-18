
import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';


const ApplicationSpinner = ({ translationKey, args }) => {
  const { t } = useTranslation();
  return (
    <>
      <div className="govuk-width-container">
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-full" />
        </div>
      </div>
      <div>
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-full">
            {args ? t(translationKey, args) : t(translationKey)}
          </div>
        </div>
      </div>
    </>
  );
};

ApplicationSpinner.defaultProps = {
  translationKey: 'loading',
  args: null,
};
ApplicationSpinner.propTypes = {
  translationKey: PropTypes.string,
  args: PropTypes.shape({ root: PropTypes.object }),
};

export default ApplicationSpinner;
