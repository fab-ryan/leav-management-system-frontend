import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
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
import DefaultLayout from './components/layout/Default';
import { HolidayManager } from "@/components/admin/HolidayManager";
import { Profile } from "@/pages/Profile";
import { useEffect } from 'react';
import SettingManager from '@/components/admin/SettingManager';
import Employee from '@/pages/Employee';
import LeaveManagement from '@/pages/LeaveManagement';
import LeaveBalanceManagement from '@/pages/LeaveBalanceManagement';
import CompassionateLeave from './pages/CompassionateLeave';
import CompassionateLeaveManagement from './components/admin/CompassionateLeaveManagement';



const App = () => {

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  return (
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
              <ProtectedRoute allowedRoles={['staff', 'employee']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leave-application"
            element={
              <ProtectedRoute allowedRoles={['staff', 'employee', 'manager', 'admin', 'hr']}>
                <LeaveApplication />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leave-history"
            element={
              <ProtectedRoute allowedRoles={['staff', 'employee', 'manager', 'admin', 'hr']}>
                <LeaveHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path='/reports'
            element={
              <ProtectedRoute allowedRoles={['staff', 'manager', 'admin']}>
                <DefaultLayout>
                  <Reports />
                </DefaultLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <ProtectedRoute allowedRoles={['staff', 'employee', 'manager', 'admin', 'hr']}>
                <Calendar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hr"
            element={
              <ProtectedRoute allowedRoles={['manager', 'admin', 'hr']}>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin', 'admin', 'hr']}>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/holidays"
            element={
              <ProtectedRoute allowedRoles={['admin', 'manager', 'hr']}>
                <DefaultLayout>

                  <HolidayManager />
                </DefaultLayout>
              </ProtectedRoute>
            }
          />
          <Route path="/profile" element={
            <ProtectedRoute allowedRoles={['admin', 'employee', 'manager', 'hr']}>
              <DefaultLayout>

                <Profile />
              </DefaultLayout>
            </ProtectedRoute>
          } />
          <Route
            path="/settings"
            element={
              <ProtectedRoute allowedRoles={['admin', 'hr', 'manager']}>
                <DefaultLayout>
                  <SettingManager />
                </DefaultLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee-management"
            element={
              <ProtectedRoute allowedRoles={['admin', 'hr', 'manager']}>
                <Employee />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leave-management"
            element={
              <ProtectedRoute allowedRoles={['admin', 'hr', 'manager']}>
                <LeaveManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leave-balances"
            element={
              <ProtectedRoute allowedRoles={['admin', 'hr', 'manager']}>
                <LeaveBalanceManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/compassionate-leave"
            element={
              <ProtectedRoute allowedRoles={['staff', 'employee',]}>
                <CompassionateLeave />
              </ProtectedRoute>
            }
          />
          <Route
            path="/compassionate-leave-management"
            element={
              <ProtectedRoute allowedRoles={['admin', 'hr', 'manager']}>
                <DefaultLayout>

                  <CompassionateLeaveManagement />
                </DefaultLayout>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  )
}

export default App;
