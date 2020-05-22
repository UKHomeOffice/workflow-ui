import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';

export const SubmissionContext = createContext({
  submissionContext: {},
});

export const SubmissionContextProvider = ({ children }) => {
  const [submissionContext, setSubmissionContext] = useState(null);

  const updateSubmissionContext = (values) => {
    setSubmissionContext(values);
  };

  return (
    <SubmissionContext.Provider value={{ submissionContext, updateSubmissionContext }}>
      {children}
    </SubmissionContext.Provider>
  );
};

SubmissionContextProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};
