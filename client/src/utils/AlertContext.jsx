import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';

export const AlertContext = createContext({
  alertContext: {},
});

export const AlertContextProvider = ({ children }) => {
  const [alertContext, setAlertContext] = useState(null);

  return (
    <AlertContext.Provider value={{ alertContext, setAlertContext }}>
      {children}
    </AlertContext.Provider>
  );
};

AlertContextProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};
