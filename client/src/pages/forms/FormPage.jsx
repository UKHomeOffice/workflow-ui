import React from 'react';
import PropTypes from 'prop-types';
import { Formio } from 'react-formio';
import gds from '@digitalpatterns/formio-gds-template';

Formio.use(gds);

const FormPage = ({ formId }) => <div>{formId}</div>;


FormPage.propTypes = {
  formId: PropTypes.string.isRequired,
};
export default FormPage;
