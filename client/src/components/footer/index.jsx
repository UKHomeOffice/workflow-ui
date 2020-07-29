import React from 'react';
import { useTranslation } from 'react-i18next';
import config from 'react-global-configuration';
import { useNavigation } from 'react-navi';

const Footer = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  return (
    <footer className="govuk-footer " role="contentinfo">
      <div className="govuk-width-container ">
        <div className="govuk-footer__meta">
          <div className="govuk-footer__meta-item govuk-footer__meta-item--grow">
            <h2 className="govuk-visually-hidden">{t('footer.support-links')}</h2>
            <ul className="govuk-footer__inline-list">
              <li className="govuk-footer__inline-list-item">
                <a
                  id="privacy"
                  className="govuk-footer__link"
                  href="/privacy-and-cookie-policy"
                  onClick={async (e) => {
                    e.preventDefault();
                    await navigation.navigate('/privacy-and-cookie-policy');
                  }}
                >
                  {t('footer.privacy')}

                </a>
              </li>
              <li className="govuk-footer__inline-list-item">
                <a
                  id="accessibility"
                  className="govuk-footer__link"
                  href="/accessibility-statement"
                  onClick={async (e) => {
                    e.preventDefault();
                    await navigation.navigate('/accessibility-statement');
                  }}
                >
                  {t('footer.accessibility')}
                </a>
              </li>
              <li className="govuk-footer__inline-list-item">
                <a className="govuk-footer__link" href={`${config.get('serviceDeskUrl')}`} target="_blank" rel="noopener noreferrer">{t('footer.help')}</a>
              </li>
            </ul>
          </div>
          <hr className="govuk-footer__section-break" />
          <div className="govuk-footer__meta-item">
            <a className="govuk-footer__link govuk-footer__copyright-logo" href="https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/">
              {t('footer.copyright')}
            </a>
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
