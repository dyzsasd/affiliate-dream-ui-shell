
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/auth";
import { Toaster } from "@/components/ui/toaster";
import AppLayout from "@/components/layout/AppLayout";
import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import { AffiliateOnboard } from "@/pages/onboard/AffiliateOnboard";
import Dashboard from "@/pages/Dashboard";
import CampaignList from "@/pages/campaigns/CampaignList";
import CampaignDetail from "@/pages/campaigns/CampaignDetail";
import CampaignForm from "@/pages/campaigns/CampaignForm";
import AdvertiserRoutes from "@/pages/advertisers";
import ProfilePage from "@/pages/profile";
import TrackingLinkGenerator from "@/pages/tracking/TrackingLinkGenerator";
import PerformanceReport from "@/pages/reporting/PerformanceReport";
import ConversionReport from "@/pages/reporting/ConversionReport";
import AdvertiserAnalytics from "@/pages/analytics/AdvertiserAnalytics";
import AllPartnersPage from "@/pages/analytics/AllPartnersPage";
import NewPartnersPage from "@/pages/analytics/NewPartnersPage";
import LostPartnersPage from "@/pages/analytics/LostPartnersPage";
import InvitationManagement from "@/pages/invitations";
import OrganizationList from "@/pages/organizations";
import OrganizationEdit from "@/pages/organizations/OrganizationEdit";
import UserList from "@/pages/users";
import CreateAffiliateAccount from "@/pages/affiliate/CreateAffiliateAccount";
import MarketplacePage from "@/pages/marketplace";
import NotFound from "@/pages/NotFound";
import InfluencerSearch from "@/pages/influencer-search";
import InfluencerDetailPage from "@/pages/influencer-search/InfluencerDetailPage";
import BillingDashboard from "@/pages/billing";
import FavoritePublisherLists from "@/pages/favorite-publishers";
import FavoritePublisherListDetail from "@/pages/favorite-publishers/FavoritePublisherListDetail";
import CreateFavoritePublisherList from "@/pages/favorite-publishers/CreateFavoritePublisherList";
import ConversationsList from "@/pages/conversations";
// Import the component directly with a different syntax to ensure it loads
import ConversationDetail from "./pages/conversations/ConversationDetail";
import "./App.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Auth routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/onboard" element={<AffiliateOnboard />} />
              
              {/* Protected routes */}
              <Route element={<AppLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                
                {/* Campaign routes */}
                <Route path="/campaigns" element={<CampaignList />} />
                <Route path="/campaigns/new" element={<CampaignForm />} />
                <Route path="/campaigns/:id" element={<CampaignDetail />} />
                <Route path="/campaigns/:id/edit" element={<CampaignForm />} />
                
                {/* Advertiser routes - use the AdvertiserRoutes component */}
                <Route path="/advertisers/*" element={<AdvertiserRoutes />} />
                
                {/* Marketplace routes */}
                <Route path="/advertiser/marketplace" element={<MarketplacePage />} />
                
                {/* Influencer routes */}
                <Route path="/influencer" element={<InfluencerSearch />} />
                <Route path="/influencer/:id" element={<InfluencerDetailPage />} />
                
                {/* Analytics routes */}
                <Route path="/analytics/advertiser" element={<AdvertiserAnalytics />} />
                <Route path="/analytics/advertiser/:advertiserId" element={<AdvertiserAnalytics />} />
                <Route path="/analytics/advertiser/:advertiserId/all_partners" element={<AllPartnersPage />} />
            <Route path="/analytics/advertiser/:advertiserId/new_partners" element={<NewPartnersPage />} />
            <Route path="/analytics/advertiser/:advertiserId/lost_partners" element={<LostPartnersPage />} />
                
                {/* Tracking routes */}
                <Route path="/tracking-links" element={<TrackingLinkGenerator />} />
                
                {/* Reporting routes */}
                <Route path="/reporting" element={<PerformanceReport />} />
                <Route path="/reporting/conversions" element={<ConversionReport />} />
                
                {/* Organization routes */}
                <Route path="/organizations" element={<OrganizationList />} />
                <Route path="/organizations/:id/edit" element={<OrganizationEdit />} />
                
                {/* User routes */}
                <Route path="/users" element={<UserList />} />
                
                {/* Affiliate routes */}
                <Route path="/affiliate/create" element={<CreateAffiliateAccount />} />
                
                {/* Billing routes */}
                <Route path="/billing" element={<BillingDashboard />} />
                
                {/* Favorite Publisher Lists routes */}
                <Route path="/favorite_publisher" element={<FavoritePublisherLists />} />
                <Route path="/favorite_publisher/create" element={<CreateFavoritePublisherList />} />
                <Route path="/favorite_publishers/:listId" element={<FavoritePublisherListDetail />} />
                
                {/* Conversations routes */}
          <Route path="/conversations" element={<ConversationsList />} />
          <Route path="/conversations/:conversationId" element={<ConversationDetail />} />
                
                {/* Other routes */}
                <Route path="/invitations" element={<InvitationManagement />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
