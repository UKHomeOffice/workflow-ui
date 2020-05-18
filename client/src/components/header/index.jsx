import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from 'react-navi';
import styled from 'styled-components';
import config from 'react-global-configuration';

const Header = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  return (
    <header className="govuk-header" role="banner" data-module="govuk-header">
      <div className="govuk-header__container govuk-width-container">
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-one-half">
            <HeaderContent className="govuk-header__content">
              <a
                href="/"
                id="home"
                onClick={async (e) => {
                  e.preventDefault();
                  await navigation.navigate('/');
                }}
                className="govuk-header__link govuk-header__link--service-name"
              >
                {t('header.service-name')}
              </a>
            </HeaderContent>
          </div>
          <div className="govuk-grid-column-one-half">
            <NavLink
              id="support"
              className="govuk-header__link"
              href={config.get('supportUrl')}
              target="_blank"
            >
              {t('header.support')}
            </NavLink>
            <NavLink
              className="govuk-header__link"
              href="/logout"
              id="logout"
              onClick={async (e) => {
                e.preventDefault();
                await navigation.navigate('/logout');
              }}
            >
              {t('header.sign-out')}
            </NavLink>
          </div>
        </div>
      </div>
    </header>
  );
};

const NavLink = styled.a`
    margin-left: 20px;
    font-weight: bold;
    padding-top: 5px;
    text-align: right;
    padding-bottom: 10px;
`;

const HeaderContent = styled.div`
   width: 100%;
`;


export default Header;
