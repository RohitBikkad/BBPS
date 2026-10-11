import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { LoginPage } from './pages/LoginPage';
import { PrincipalDashboard } from './pages/PrincipalDashboard';
import { SupervisorDashboard } from './pages/SupervisorDashboard';
import { StaffDashboard } from './pages/StaffDashboard';
import { DailyApprovalPage } from './pages/DailyApprovalPage';
import { StaffAttendancePage } from './pages/StaffAttendancePage';
import { SupervisorTeamPage } from './pages/SupervisorTeamPage';
import { LeaveApplicationPage } from './pages/LeaveApplicationPage';
import { StaffManagementPage } from './pages/StaffManagementPage';
import { ReportsPage } from './pages/ReportsPage';
import { SchoolCalendarPage } from './pages/SchoolCalendarPage';
import { School } from 'lucide-react';

export const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading, role } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white animate-pulse">
            <School className="w-7 h-7" />
          </div>
          <span className="text-sm font-semibold text-emerald-200">Loading BBPS Portal...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Render view by active tab & role
  const renderContent = () => {
    switch (activeTab) {
      case 'daily-approval':
        return <DailyApprovalPage />;
      case 'my-attendance':
        return <StaffAttendancePage />;
      case 'supervisor-team':
        return <SupervisorTeamPage />;
      case 'leaves':
        return <LeaveApplicationPage />;
      case 'staff-management':
        return <StaffManagementPage />;
      case 'reports':
        return <ReportsPage />;
      case 'calendar':
        return <SchoolCalendarPage />;
      case 'dashboard':
      default:
        if (role === 'ROLE_PRINCIPAL') {
          return <PrincipalDashboard setActiveTab={setActiveTab} />;
        }
        if (role === 'ROLE_SUPERVISOR') {
          return <SupervisorDashboard setActiveTab={setActiveTab} />;
        }
        return <StaffDashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {renderContent()}
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};
