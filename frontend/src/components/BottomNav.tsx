import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Home, CheckSquare, Calendar, FileText, Users, Clock } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const { role } = useAuth();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.04)] pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-16 px-2 max-w-lg mx-auto">
        
        {/* Dashboard */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all ${
            activeTab === 'dashboard' ? 'text-emerald-600 font-semibold scale-105' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Home</span>
        </button>

        {/* Primary Attendance Flow by Role */}
        {role === 'ROLE_PRINCIPAL' && (
          <button
            onClick={() => setActiveTab('daily-approval')}
            className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all ${
              activeTab === 'daily-approval' ? 'text-emerald-600 font-semibold scale-105' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <CheckSquare className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Approvals</span>
          </button>
        )}

        {role === 'ROLE_SUPERVISOR' && (
          <button
            onClick={() => setActiveTab('supervisor-team')}
            className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all ${
              activeTab === 'supervisor-team' ? 'text-emerald-600 font-semibold scale-105' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Clock className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Team</span>
          </button>
        )}

        {role === 'ROLE_STAFF' && (
          <button
            onClick={() => setActiveTab('my-attendance')}
            className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all ${
              activeTab === 'my-attendance' ? 'text-emerald-600 font-semibold scale-105' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Clock className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Attendance</span>
          </button>
        )}

        {/* Leaves */}
        <button
          onClick={() => setActiveTab('leaves')}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all ${
            activeTab === 'leaves' ? 'text-emerald-600 font-semibold scale-105' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Calendar className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Leaves</span>
        </button>

        {/* Staff / Reports by Role */}
        {role === 'ROLE_PRINCIPAL' ? (
          <button
            onClick={() => setActiveTab('staff-management')}
            className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all ${
              activeTab === 'staff-management' ? 'text-emerald-600 font-semibold scale-105' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Users className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Staff</span>
          </button>
        ) : (
          <button
            onClick={() => setActiveTab('reports')}
            className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all ${
              activeTab === 'reports' ? 'text-emerald-600 font-semibold scale-105' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <FileText className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Reports</span>
          </button>
        )}

      </div>
    </div>
  );
};
