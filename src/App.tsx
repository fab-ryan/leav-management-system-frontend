import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import LeaveApplication from '@/pages/LeaveApplication';
import LeaveHistory from '@/pages/LeaveHistory';
import Calendar from '@/pages/Calendar';
import Admin from '@/pages/Admin';
import Manager from '@/pages/Manager';
import Reports from '@/pages/Reports';
import NotFound from '@/pages/NotFound';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      {/* <Sonner /> */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['staff', 'employee', 'manager', 'admin']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leave-application"
            element={
              <ProtectedRoute allowedRoles={['staff', 'employee', 'manager', 'admin']}>
                <LeaveApplication />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leave-history"
            element={
              <ProtectedRoute allowedRoles={['staff', 'employee', 'manager', 'admin']}>
                <LeaveHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path='/reports'
            element={
              <ProtectedRoute allowedRoles={['staff', 'manager', 'admin']}>
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <ProtectedRoute allowedRoles={['staff', 'employee', 'manager', 'admin']}>
                <Calendar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager"
            element={
              <ProtectedRoute allowedRoles={['manager', 'admin']}>
                <Manager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
