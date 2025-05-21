
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import enTranslation from './locales/en/translation.json';
import frTranslation from './locales/fr/translation.json';
import zhCNTranslation from './locales/zh-CN/translation.json';
import zhTWTranslation from './locales/zh-TW/translation.json';

// Language resources
const resources = {
  en: {
    translation: enTranslation
  },
  fr: {
    translation: frTranslation
  },
  'zh-CN': {
    translation: zhCNTranslation
  },
  'zh-TW': {
    translation: zhTWTranslation
  }
};

i18n
  // detect user language
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next
  .use(initReactI18next)
  // init i18next
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // not needed for react as it escapes by default
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'rolinko_language',
      caches: ['localStorage']
    }
  });

export default i18n;
