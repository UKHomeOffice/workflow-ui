
import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const ApplicationSpinner = ({ translationKey, args }) => {
  const { t } = useTranslation();
  return (
    <>
      <div className="govuk-width-container">
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-full">
            <SpinnerContainer>
              <Spinner />
              <SpinnerText>{args ? t(translationKey, args) : t(translationKey)}</SpinnerText>
            </SpinnerContainer>
          </div>
        </div>
      </div>
    </>
  );
};


const SpinnerContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
const Spinner = styled.div`

  border: 12px solid #DEE0E2;
  border-radius: 50%;
  border-top-color: #005EA5;
  width: 80px;
  height: 80px;
  -webkit-animation: spin 2s linear infinite;
  animation: spin 2s linear infinite;
  @-webkit-keyframes spin {
  0% { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

const SpinnerText = styled.div`
  line-height: 2;
  text-align: center;
`;

ApplicationSpinner.defaultProps = {
  translationKey: 'loading',
  args: null,
};
ApplicationSpinner.propTypes = {
  translationKey: PropTypes.string,
  args: PropTypes.shape({ root: PropTypes.object }),
};

export default ApplicationSpinner;
