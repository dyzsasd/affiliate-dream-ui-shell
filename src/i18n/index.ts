
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
import enFavoritePublishers from './locales/en/favoritePublishers.json';
import enConversations from './locales/en/conversations.json';
import enTrackingLinks from './locales/en/trackingLinks.json';
import enAgencyDashboard from './locales/en/agencyDashboard.json';
import enAgencyAnalytics from './locales/en/agencyAnalytics.json';
import enAgencyCampaigns from './locales/en/agencyCampaigns.json';
import enAffiliates from './locales/en/affiliates.json';
import enInvitations from './locales/en/invitations.json';
import enAssociations from './locales/en/associations.json';

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
import frFavoritePublishers from './locales/fr/favoritePublishers.json';
import frConversations from './locales/fr/conversations.json';
import frTrackingLinks from './locales/fr/trackingLinks.json';
import frAgencyDashboard from './locales/fr/agencyDashboard.json';
import frAgencyAnalytics from './locales/fr/agencyAnalytics.json';
import frAgencyCampaigns from './locales/fr/agencyCampaigns.json';
import frAffiliates from './locales/fr/affiliates.json';
import frInvitations from './locales/fr/invitations.json';
import frAssociations from './locales/fr/associations.json';

import zhCNApp from './locales/zh-CN/app.json';
import zhCNCommon from './locales/zh-CN/common.json';
import zhCNAuth from './locales/zh-CN/auth.json';
import zhCNSidebar from './locales/zh-CN/sidebar.json';
import zhCNMarketplace from './locales/zh-CN/marketplace.json';
import zhCNAdvertisers from './locales/zh-CN/advertisers.json';
import zhCNCampaigns from './locales/zh-CN/campaigns.json';
import zhCNOrganizations from './locales/zh-CN/organizations.json';
import zhCNUsers from './locales/zh-CN/users.json';
import zhCNReports from './locales/zh-CN/reports.json';
import zhCNDashboard from './locales/zh-CN/dashboard.json';
import zhCNPlatformOwnerDashboard from './locales/zh-CN/platformOwnerDashboard.json';
import zhCNInfluencerSearch from './locales/zh-CN/influencerSearch.json';
import zhCNAnalytics from './locales/zh-CN/analytics.json';
import zhCNProfile from './locales/zh-CN/profile.json';
import zhCNFavoritePublishers from './locales/zh-CN/favoritePublishers.json';
import zhCNConversations from './locales/zh-CN/conversations.json';
import zhCNTrackingLinks from './locales/zh-CN/trackingLinks.json';
import zhCNAgencyDashboard from './locales/zh-CN/agencyDashboard.json';
import zhCNAgencyAnalytics from './locales/zh-CN/agencyAnalytics.json';
import zhCNAgencyCampaigns from './locales/zh-CN/agencyCampaigns.json';
import zhCNAffiliates from './locales/zh-CN/affiliates.json';
import zhCNInvitations from './locales/zh-CN/invitations.json';
import zhCNAssociations from './locales/zh-CN/associations.json';

import zhTWApp from './locales/zh-TW/app.json';
import zhTWCommon from './locales/zh-TW/common.json';
import zhTWAuth from './locales/zh-TW/auth.json';
import zhTWSidebar from './locales/zh-TW/sidebar.json';
import zhTWMarketplace from './locales/zh-TW/marketplace.json';
import zhTWAdvertisers from './locales/zh-TW/advertisers.json';
import zhTWCampaigns from './locales/zh-TW/campaigns.json';
import zhTWOrganizations from './locales/zh-TW/organizations.json';
import zhTWUsers from './locales/zh-TW/users.json';
import zhTWReports from './locales/zh-TW/reports.json';
import zhTWDashboard from './locales/zh-TW/dashboard.json';
import zhTWPlatformOwnerDashboard from './locales/zh-TW/platformOwnerDashboard.json';
import zhTWInfluencerSearch from './locales/zh-TW/influencerSearch.json';
import zhTWAnalytics from './locales/zh-TW/analytics.json';
import zhTWProfile from './locales/zh-TW/profile.json';
import zhTWFavoritePublishers from './locales/zh-TW/favoritePublishers.json';
import zhTWConversations from './locales/zh-TW/conversations.json';
import zhTWTrackingLinks from './locales/zh-TW/trackingLinks.json';
import zhTWAgencyDashboard from './locales/zh-TW/agencyDashboard.json';
import zhTWAgencyAnalytics from './locales/zh-TW/agencyAnalytics.json';
import zhTWAgencyCampaigns from './locales/zh-TW/agencyCampaigns.json';
import zhTWAffiliates from './locales/zh-TW/affiliates.json';
import zhTWInvitations from './locales/zh-TW/invitations.json';
import zhTWAssociations from './locales/zh-TW/associations.json';

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
  profile: enProfile,
  favoritePublishers: enFavoritePublishers,
  conversations: enConversations,
  trackingLinks: enTrackingLinks,
  agencyDashboard: enAgencyDashboard,
  agencyAnalytics: enAgencyAnalytics,
  agencyCampaigns: enAgencyCampaigns,
  affiliates: enAffiliates,
  invitations: enInvitations,
  associations: enAssociations
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
  profile: frProfile,
  favoritePublishers: frFavoritePublishers,
  conversations: frConversations,
  trackingLinks: frTrackingLinks,
  agencyDashboard: frAgencyDashboard,
  agencyAnalytics: frAgencyAnalytics,
  agencyCampaigns: frAgencyCampaigns,
  affiliates: frAffiliates,
  invitations: frInvitations,
  associations: frAssociations
};

const zhCNTranslation = {
  ...zhCNApp,
  common: zhCNCommon,
  auth: zhCNAuth,
  sidebar: zhCNSidebar,
  marketplace: zhCNMarketplace,
  advertisers: zhCNAdvertisers,
  campaigns: zhCNCampaigns,
  organizations: zhCNOrganizations,
  users: zhCNUsers,
  reports: zhCNReports,
  dashboard: zhCNDashboard,
  platformOwnerDashboard: zhCNPlatformOwnerDashboard,
  influencerSearch: zhCNInfluencerSearch,
  analytics: zhCNAnalytics,
  profile: zhCNProfile,
  favoritePublishers: zhCNFavoritePublishers,
  conversations: zhCNConversations,
  trackingLinks: zhCNTrackingLinks,
  agencyDashboard: zhCNAgencyDashboard,
  agencyAnalytics: zhCNAgencyAnalytics,
  agencyCampaigns: zhCNAgencyCampaigns,
  affiliates: zhCNAffiliates,
  invitations: zhCNInvitations,
  associations: zhCNAssociations
};

const zhTWTranslation = {
  ...zhTWApp,
  common: zhTWCommon,
  auth: zhTWAuth,
  sidebar: zhTWSidebar,
  marketplace: zhTWMarketplace,
  advertisers: zhTWAdvertisers,
  campaigns: zhTWCampaigns,
  organizations: zhTWOrganizations,
  users: zhTWUsers,
  reports: zhTWReports,
  dashboard: zhTWDashboard,
  platformOwnerDashboard: zhTWPlatformOwnerDashboard,
  influencerSearch: zhTWInfluencerSearch,
  analytics: zhTWAnalytics,
  profile: zhTWProfile,
  favoritePublishers: zhTWFavoritePublishers,
  conversations: zhTWConversations,
  trackingLinks: zhTWTrackingLinks,
  agencyDashboard: zhTWAgencyDashboard,
  agencyAnalytics: zhTWAgencyAnalytics,
  agencyCampaigns: zhTWAgencyCampaigns,
  affiliates: zhTWAffiliates,
  invitations: zhTWInvitations,
  associations: zhTWAssociations
};

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
