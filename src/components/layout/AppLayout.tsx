
import React, { useState } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import Sidebar from "./Sidebar";
import { Loader2 } from "lucide-react";

const AppLayout: React.FC = () => {
  console.log("AppLayout rendering - component start");
  const auth = useAuth();
  console.log("Authentication state:", auth);
  const location = useLocation();
  
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (auth.isLoading) {
    console.log("Loading spinner is showing - auth is still loading");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-affiliate-primary" />
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    console.log("User is not authenticated - redirecting to login");
    // Pass the current location to redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log("User is authenticated - rendering app layout");
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
