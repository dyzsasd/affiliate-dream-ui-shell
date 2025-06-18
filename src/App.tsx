import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/auth";
import { Toaster } from "@/components/ui/toaster";
import AppLayout from "@/components/layout/AppLayout";
import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import Dashboard from "@/pages/Dashboard";
import CampaignList from "@/pages/campaigns/CampaignList";
import CampaignDetail from "@/pages/campaigns/CampaignDetail";
import AdvertiserList from "@/pages/advertisers";
import AdvertiserDetail from "@/pages/advertisers/AdvertiserDetail";
import AdvertiserForm from "@/pages/advertisers/AdvertiserForm";
import ProfilePage from "@/pages/profile";
import TrackingLinkGenerator from "@/pages/tracking/TrackingLinkGenerator";
import PerformanceReport from "@/pages/reporting/PerformanceReport";
import ConversionReport from "@/pages/reporting/ConversionReport";
import AdvertiserAnalytics from "@/pages/analytics/AdvertiserAnalytics";
import InvitationManagement from "@/pages/invitations";
import OrganizationList from "@/pages/organizations";
import OrganizationEdit from "@/pages/organizations/OrganizationEdit";
import UserList from "@/pages/users";
import CreateAffiliateAccount from "@/pages/affiliate/CreateAffiliateAccount";
import MarketplacePage from "@/pages/marketplace";
import NotFound from "@/pages/NotFound";
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
              <Route path="/login" element={<AuthLayout><LoginForm /></AuthLayout>} />
              <Route path="/signup" element={<AuthLayout><SignupForm /></AuthLayout>} />
              
              {/* Protected routes */}
              <Route element={<AppLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                
                {/* Campaign routes */}
                <Route path="/campaigns" element={<CampaignList />} />
                <Route path="/campaigns/:id" element={<CampaignDetail />} />
                
                {/* Advertiser routes */}
                <Route path="/advertisers" element={<AdvertiserList />} />
                <Route path="/advertisers/new" element={<AdvertiserForm />} />
                <Route path="/advertisers/:id" element={<AdvertiserDetail />} />
                <Route path="/advertisers/:id/edit" element={<AdvertiserForm />} />
                
                {/* Marketplace routes */}
                <Route path="/advertiser/marketplace" element={<MarketplacePage />} />
                
                {/* Analytics routes */}
                <Route path="/analytics/advertiser" element={<AdvertiserAnalytics />} />
                
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
