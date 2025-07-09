// TypeScript definitions for translation keys
export interface TranslationKeys {
  // App
  appName: string;
  appDescription: string;

  // Common
  common: {
    error: string;
    loading: string;
    search: string;
    noResultsFound: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    add: string;
    create: string;
    update: string;
    actions: string;
    status: string;
    active: string;
    inactive: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    back: string;
    view: string;
    saveChanges: string;
    errorOccurred: string;
    tryAgain: string;
  };

  // Auth
  auth: {
    signIn: string;
    signOut: string;
    signUp: string;
    email: string;
    password: string;
    rememberMe: string;
    forgotPassword: string;
    signingIn: string;
    dontHaveAccount: string;
    emailAndPasswordRequired: string;
    firstName: string;
    lastName: string;
    confirmPassword: string;
    creatingAccount: string;
    createAccount: string;
    passwordsDoNotMatch: string;
    passwordTooShort: string;
    createAccountToGetStarted: string;
    alreadyHaveAccount: string;
  };

  // Sidebar
  sidebar: {
    dashboard: string;
    advertisers: string;
    campaigns: string;
    marketplace: string;
    influencerSearch: string;
    analytics: string;
    reports: string;
    invitations: string;
    myProfile: string;
    trackingLinks: string;
    conversions: string;
    organizations: string;
    users: string;
  };

  // Marketplace
  marketplace: {
    title: string;
    description: string;
    filters: string;
    searchPlaceholder: string;
    clearAll: string;
    search: string;
    category: string;
    country: string;
    minRating: string;
    sortBy: string;
    sortRelevance: string;
    sortRating: string;
    sortEPC: string;
    sortConversionRate: string;
    noResults: string;
    noResultsDescription: string;
    clearFilters: string;
    viewDetails: string;
    advancedFilters: string;
    selectCategory: string;
    selectCountry: string;
    minimumRating: string;
    selectRating: string;
    payoutModel: string;
    selectPayoutModel: string;
    monthlyTraffic: string;
  };

  // Advertisers
  advertisers: {
    title: string;
    description: string;
    createNew: string;
    createAdvertiser: string;
    editAdvertiser: string;
    createAdvertiserDescription: string;
    editAdvertiserDescription: string;
    noAdvertisers: string;
    createYourFirst: string;
    list: string;
    total: string;
    tableCaption: string;
    nameColumn: string;
    contactColumn: string;
    statusColumn: string;
    createdAtColumn: string;
    deleteSuccess: string;
    deleteError: string;
    deleteConfirmTitle: string;
    deleteConfirmMessage: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    statusLabel: string;
    selectStatus: string;
    statusActive: string;
    statusPending: string;
    statusInactive: string;
    statusRejected: string;
    billingDetailsLabel: string;
    addressLabel: string;
    addressPlaceholder: string;
    cityLabel: string;
    cityPlaceholder: string;
    stateLabel: string;
    statePlaceholder: string;
    countryLabel: string;
    countryPlaceholder: string;
    postalCodeLabel: string;
    postalCodePlaceholder: string;
    advertiserDetails: string;
  };

  // Additional interfaces for other modules...
  campaigns: any;
  organizations: any;
  users: any;
  reports: any;
  dashboard: any;
  platformOwnerDashboard: any;
  influencerSearch: any;
  analytics: any;
  profile: any;
}

declare module 'react-i18next' {
  interface CustomTypeOptions {
    resources: {
      translation: TranslationKeys;
    };
  }
}