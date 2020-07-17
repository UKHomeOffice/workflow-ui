import React from 'react';
import PropTypes from 'prop-types';
import { useCurrentRoute, useNavigation } from 'react-navi';
import { ErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { useKeycloak } from '@react-keycloak/web';
import Header from '../header';
import Footer from '../footer';
import Logger from '../../utils/logger';
import AlertBanner from '../alert/AlertBanner';
import { AlertContextProvider } from '../../utils/AlertContext';

const ErrorFallback = ({ resetErrorBoundary }) => {
  const { t } = useTranslation();
  return (
    <div
      className="govuk-width-container govuk-error-summary govuk-!-margin-top-5"
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
  const navigation = useNavigation();
  const { t } = useTranslation();
  return (
    <>
      <Header />
      <div className="app-container">
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
          <main
            className="govuk-main-wrapper govuk-main-wrapper--auto-spacing govuk-!-padding-top-3"
            role="main"
            id="main-content"
          >
            <AlertContextProvider>
              <AlertBanner />
              {route.url.pathname !== '/' ? (
              // eslint-disable-next-line jsx-a11y/anchor-is-valid
                <a
                  href="#"
                  onClick={async (e) => {
                    e.preventDefault();
                    await navigation.goBack();
                  }}
                  className="govuk-back-link"
                >
                  {t('back')}
                </a>
              ) : null}
              {children}
            </AlertContextProvider>
          </main>
        </ErrorBoundary>

      </div>
      <Footer />

    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
