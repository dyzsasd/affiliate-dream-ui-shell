
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/auth";
import NotFound from "./pages/NotFound";

// Layouts
import AppLayout from "@/components/layout/AppLayout";

// Auth Pages
import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";

// App Pages
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/profile";
import CampaignList from "@/pages/campaigns/CampaignList";
import CampaignDetail from "@/pages/campaigns/CampaignDetail";
import TrackingLinkGenerator from "@/pages/tracking/TrackingLinkGenerator";
import PerformanceReport from "@/pages/reporting/PerformanceReport";
import ConversionReport from "@/pages/reporting/ConversionReport";
import Index from "./pages/Index";
import AdvertisersRoutes from "./pages/advertisers";

// Create a query client with retry disabled to avoid infinite loading
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider mockMode={false}> {/* Set to false to use real Supabase auth */}
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Index Route with proper loading handling */}
            <Route path="/" element={<Index />} />
            
            {/* App Routes - Protected by AppLayout */}
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/campaigns" element={<CampaignList />} />
              <Route path="/campaigns/:campaignId" element={<CampaignDetail />} />
              <Route path="/tracking-links" element={<TrackingLinkGenerator />} />
              <Route path="/reporting" element={<PerformanceReport />} />
              <Route path="/reporting/conversions" element={<ConversionReport />} />
              <Route path="/advertisers/*" element={<AdvertisersRoutes />} />
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
