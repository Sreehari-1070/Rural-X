
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { OfflineBanner } from "@/components/shared/OfflineBanner";

// Pages
import Landing from "./pages/Landing";
import FarmerAuth from "./pages/farmer/Auth";
import FarmerDashboard from "./pages/farmer/Dashboard";
import DiseaseDetection from "./pages/farmer/Disease";
import DisasterManagement from "./pages/farmer/Disaster";
import FertilizerTool from "./pages/farmer/Fertilizer";
import IrrigationTool from "./pages/farmer/Irrigation";
import Community from "./pages/farmer/Community";
import GrowthCalendar from "./pages/farmer/GrowthCalendar";
import SoilMemory from "./pages/farmer/SoilMemory";
import Profile from "./pages/farmer/Profile";
import AdminAuth from "./pages/admin/Auth";
import AdminDashboard from "./pages/admin/Dashboard";
import FarmerManagement from "./pages/admin/FarmerManagement";
import FarmerComplaints from "./pages/farmer/Complaints";
import AdminComplaints from "./pages/admin/Complaints";
import DiseaseAlerts from "./pages/admin/DiseaseAlerts";
import Communities from "./pages/admin/Communities";
import Analytics from "./pages/admin/Analytics";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <OfflineBanner />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Landing */}
              <Route path="/" element={<Landing />} />

              {/* Farmer Routes */}
              <Route path="/farmer/auth" element={<FarmerAuth />} />
              <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
              <Route path="/farmer/disease" element={<DiseaseDetection />} />
              <Route path="/farmer/disaster" element={<DisasterManagement />} />
              <Route path="/farmer/fertilizer" element={<FertilizerTool />} />
              <Route path="/farmer/irrigation" element={<IrrigationTool />} />
              <Route path="/farmer/growth" element={<GrowthCalendar />} />
              <Route path="/farmer/soil" element={<SoilMemory />} />
              <Route path="/farmer/weather" element={<FarmerDashboard />} />
              <Route path="/farmer/community" element={<Community />} />
              <Route path="/farmer/complaints" element={<FarmerComplaints />} />
              <Route path="/farmer/profile" element={<Profile />} />

              {/* Admin Routes */}
              <Route path="/admin/auth" element={<AdminAuth />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/farmers" element={<FarmerManagement />} />
              <Route path="/admin/complaints" element={<AdminComplaints />} />
              <Route path="/admin/disease-alerts" element={<DiseaseAlerts />} />
              <Route path="/admin/communities" element={<Communities />} />
              <Route path="/admin/broadcast" element={<Communities />} />
              <Route path="/admin/analytics" element={<Analytics />} />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
