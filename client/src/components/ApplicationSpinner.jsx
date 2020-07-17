import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { BLACK } from 'govuk-colours';

const ApplicationSpinner = ({ translationKey, args, colour }) => {
  const { t } = useTranslation();
  return (
    <>
      <div className="govuk-width-container">
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-full">
            <SpinnerContainer>
              <Spinner />
              <SpinnerText colour={colour}>
                {args ? t(translationKey, args) : t(translationKey)}
              </SpinnerText>
            </SpinnerContainer>
          </div>
        </div>
      </div>
    </>
  );
};

const SpinnerContainer = styled.div`
position: fixed;
  top: 50%;
  left: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: translate(-50%, -50%);
`;
const Spinner = styled.div`
 text-align: center;
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
  color: ${(props) => (props.colour ? props.colour : BLACK)}
`;

ApplicationSpinner.defaultProps = {
  translationKey: 'loading',
  args: null,
  colour: BLACK,
};
ApplicationSpinner.propTypes = {
  translationKey: PropTypes.string,
  args: PropTypes.shape({ root: PropTypes.object }),
  colour: PropTypes.string,
};

export default ApplicationSpinner;
