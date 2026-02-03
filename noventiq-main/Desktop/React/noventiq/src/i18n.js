// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import language JSON files
import enTranslation from './translation/en.json';
import hiTranslation from './translation/hi.json';
import bnTranslation from './translation/bn.json';

const resources = {
  en: { translation: enTranslation },
  hi: { translation: hiTranslation },
  bn: { translation: bnTranslation }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default language
    fallbackLng: 'en', // Fallback language if translation doesn't exist
    interpolation: {
      escapeValue: false // React already escapes values
    }
  });

export default i18n;
