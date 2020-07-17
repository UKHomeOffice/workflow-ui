import React from 'react';
import { useTranslation } from 'react-i18next';
import config from 'react-global-configuration';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="govuk-footer " role="contentinfo">
      <div className="govuk-width-container ">
        <div className="govuk-footer__meta">
          <div className="govuk-footer__meta-item govuk-footer__meta-item--grow">
            <h2 className="govuk-visually-hidden">Support links</h2>
            <ul className="govuk-footer__inline-list">
              <li className="govuk-footer__inline-list-item">
                <a className="govuk-footer__link" href={`${config.get('serviceDeskUrl')}`} target="_blank" rel="noopener noreferrer">Help</a>
              </li>
            </ul>
          </div>
          <hr className="govuk-footer__section-break" />
          <div className="govuk-footer__meta-item">
            <a className="govuk-footer__link govuk-footer__copyright-logo" href="https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/">© Crown copyright</a>
          </div>
          <div className="govuk-footer__meta-item">
            {t('footer.powered-by')}
          </div>
        </div>
      </div>
    </footer>

  );
};

export default Footer;
