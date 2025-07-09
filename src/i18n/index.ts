
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import modular translations
import enApp from './locales/en/app.json';
import enCommon from './locales/en/common.json';
import enAuth from './locales/en/auth.json';
import enSidebar from './locales/en/sidebar.json';
import enMarketplace from './locales/en/marketplace.json';
import enAdvertisers from './locales/en/advertisers.json';
import enCampaigns from './locales/en/campaigns.json';
import enOrganizations from './locales/en/organizations.json';
import enUsers from './locales/en/users.json';
import enReports from './locales/en/reports.json';
import enDashboard from './locales/en/dashboard.json';
import enPlatformOwnerDashboard from './locales/en/platformOwnerDashboard.json';
import enInfluencerSearch from './locales/en/influencerSearch.json';
import enAnalytics from './locales/en/analytics.json';
import enProfile from './locales/en/profile.json';

import frApp from './locales/fr/app.json';
import frCommon from './locales/fr/common.json';
import frAuth from './locales/fr/auth.json';
import frSidebar from './locales/fr/sidebar.json';
import frMarketplace from './locales/fr/marketplace.json';
import frAdvertisers from './locales/fr/advertisers.json';
import frCampaigns from './locales/fr/campaigns.json';
import frOrganizations from './locales/fr/organizations.json';
import frUsers from './locales/fr/users.json';
import frReports from './locales/fr/reports.json';
import frDashboard from './locales/fr/dashboard.json';
import frPlatformOwnerDashboard from './locales/fr/platformOwnerDashboard.json';
import frInfluencerSearch from './locales/fr/influencerSearch.json';
import frAnalytics from './locales/fr/analytics.json';
import frProfile from './locales/fr/profile.json';

import zhCNApp from './locales/zh-CN/app.json';
import zhCNCommon from './locales/zh-CN/common.json';

import zhTWApp from './locales/zh-TW/app.json';
import zhTWCommon from './locales/zh-TW/common.json';

// Combine all translations into legacy format for compatibility
const enTranslation = {
  ...enApp,
  common: enCommon,
  auth: enAuth,
  sidebar: enSidebar,
  marketplace: enMarketplace,
  advertisers: enAdvertisers,
  campaigns: enCampaigns,
  organizations: enOrganizations,
  users: enUsers,
  reports: enReports,
  dashboard: enDashboard,
  platformOwnerDashboard: enPlatformOwnerDashboard,
  influencerSearch: enInfluencerSearch,
  analytics: enAnalytics,
  profile: enProfile
};

const frTranslation = {
  ...frApp,
  common: frCommon,
  auth: frAuth,
  sidebar: frSidebar,
  marketplace: frMarketplace,
  advertisers: frAdvertisers,
  campaigns: frCampaigns,
  organizations: frOrganizations,
  users: frUsers,
  reports: frReports,
  dashboard: frDashboard,
  platformOwnerDashboard: frPlatformOwnerDashboard,
  influencerSearch: frInfluencerSearch,
  analytics: frAnalytics,
  profile: frProfile
};

// Use existing translations for Chinese until fully migrated
import zhCNTranslationFull from './locales/zh-CN/translation.json';
import zhTWTranslationFull from './locales/zh-TW/translation.json';

const zhCNTranslation = { ...zhCNApp, ...zhCNCommon, ...zhCNTranslationFull };
const zhTWTranslation = { ...zhTWApp, ...zhTWCommon, ...zhTWTranslationFull };

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
