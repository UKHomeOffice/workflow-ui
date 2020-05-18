import React from 'react';
import PropTypes from 'prop-types';
import { NotFoundBoundary, useCurrentRoute } from 'react-navi';
import { ErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { useKeycloak } from '@react-keycloak/web';
import Header from '../header';
import Footer from '../footer';
import Logger from '../../utils/logger';
import PageNotFound from '../PageNotFound';

const ErrorFallback = ({ resetErrorBoundary }) => {
  const { t } = useTranslation();
  return (
    <div
      className="govuk-width-container govuk-error-summary"
      aria-labelledby="error-summary-title"
      role="alert"
      tabIndex="-1"
      data-module="govuk-error-summary"
    >
      <h2 className="govuk-error-summary__title" id="error-summary-title">
        {t('render.error.title')}
      </h2>
      <div className="govuk-error-summary__body">
        <button type="button" className="govuk-button govuk-button--warning" data-module="govuk-button" onClick={resetErrorBoundary}>
          {t('render.error.retry')}
        </button>
      </div>
    </div>

  );
};

ErrorFallback.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string.isRequired,
  }).isRequired,
  resetErrorBoundary: PropTypes.func.isRequired,
};


const Layout = ({ children }) => {
  const [keycloak] = useKeycloak();
  const route = useCurrentRoute();
  return (

    <>
      <NotFoundBoundary render={PageNotFound}>
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onError={(error, componentStack) => {
            Logger.error({
              token: keycloak.token,
              message: error.message,
              path: route.url.pathname,
              componentStack,
            });
          }}
        >
          <Header />
          <div className="govuk-width-container">
            <main className="govuk-main-wrapper">
              {children}
            </main>
          </div>
          <Footer />
        </ErrorBoundary>
      </NotFoundBoundary>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
