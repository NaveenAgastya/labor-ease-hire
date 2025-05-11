
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import LaborerProfileSetup from "./pages/LaborerProfileSetup";
import ClientProfileSetup from "./pages/ClientProfileSetup";
import LaborerDashboard from "./pages/dashboard/LaborerDashboard";
import ClientDashboard from "./pages/dashboard/ClientDashboard";
import JobDetails from "./pages/JobDetails";
import JobPayment from "./pages/JobPayment";
import UserLaborSelection from "./pages/UserLaborSelection";
import UserSignup from "./pages/UserSignup";

const queryClient = new QueryClient();

// Route protection component
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredUserType?: 'laborer' | 'client' | null;
}

const ProtectedRoute = ({ children, requiredUserType }: ProtectedRouteProps) => {
  const { currentUser, userType, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  if (requiredUserType && userType !== requiredUserType) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<UserLaborSelection />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/signup" element={<UserSignup />} />
      
      <Route path="/laborer-profile-setup" element={
        <ProtectedRoute requiredUserType="laborer">
          <LaborerProfileSetup />
        </ProtectedRoute>
      } />
      
      <Route path="/client-profile-setup" element={
        <ProtectedRoute requiredUserType="client">
          <ClientProfileSetup />
        </ProtectedRoute>
      } />
      
      <Route path="/laborer-dashboard" element={
        <ProtectedRoute requiredUserType="laborer">
          <LaborerDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/client-dashboard" element={
        <ProtectedRoute requiredUserType="client">
          <ClientDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/jobs/:id" element={<JobDetails />} />
      <Route path="/payment/:id" element={
        <ProtectedRoute requiredUserType="client">
          <JobPayment />
        </ProtectedRoute>
      } />
      
      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppRoutes />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
