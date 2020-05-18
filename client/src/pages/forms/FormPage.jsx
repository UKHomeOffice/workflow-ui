import React from 'react';
import PropTypes from 'prop-types';

const FormPage = ({ formId }) => <div>{formId}</div>;


FormPage.propTypes = {
  formId: PropTypes.string.isRequired,
};
export default FormPage;
