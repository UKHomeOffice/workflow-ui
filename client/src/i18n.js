import i18n from 'i18next';
import Backend from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

const instance = i18n.createInstance();

instance
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: 'en-GB',
    fallbackLng: 'en',
    react: {
      wait: true,
    },
    debug: false,
    interpolation: {
      escapeValue: false,
    },
  });

export default instance;
