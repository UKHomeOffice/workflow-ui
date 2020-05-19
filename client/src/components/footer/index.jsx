import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="govuk-footer " role="contentinfo">
      <div className="govuk-width-container ">
        <div className="govuk-footer__meta-custom">
          {t('footer.powered-by')}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
