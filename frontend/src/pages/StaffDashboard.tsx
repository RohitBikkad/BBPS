import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { DashboardStats } from '../types';
import api from '../api/client';
import { AttendanceCard } from '../components/AttendanceCard';
import { LeaveBalanceCard } from '../components/LeaveBalanceCard';
import {
  Calendar, Clock, CheckCircle2, XCircle, ArrowUpRight,
  Sparkles, History, UserCheck, ShieldCheck
} from 'lucide-react';

interface StaffDashboardProps {
  setActiveTab: (tab: string) => void;
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({ setActiveTab }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchStats = async () => {
    try {
      const res = await api.get<DashboardStats>('/dashboard/stats');
      setStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-6 pb-24">
      
      {/* Staff Profile Header Card */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-green-800 rounded-3xl p-5 sm:p-6 text-white shadow-lg shadow-emerald-900/15 relative overflow-hidden">
        <div className="flex items-center space-x-3.5 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-extrabold text-white text-base border border-white/20">
            {user?.fullName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg sm:text-xl font-extrabold tracking-tight">{user?.fullName}</h1>
              <span className="text-[10px] bg-emerald-900/80 px-2 py-0.5 rounded-full font-semibold border border-emerald-400/30">
                {user?.employeeId}
              </span>
            </div>
            <p className="text-xs text-emerald-200 mt-0.5">
              {user?.department} Department • {user?.designation}
            </p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-emerald-600/50 flex items-center justify-between text-xs text-emerald-100">
          <span>Supervisor: <strong>{user?.supervisorName || user?.supervisorEmployeeId || 'Assigned Coordinator'}</strong></span>
          <span className="font-semibold bg-white/10 px-2.5 py-0.5 rounded-lg">Active Staff</span>
        </div>
      </div>

      {/* Primary Card 1: Today's Attendance Marking / Live Status */}
      <AttendanceCard
        todayRecord={stats?.todayAttendance}
        onRefresh={fetchStats}
      />

      {/* Primary Card 2: 8 Paid Leave Days Balance & Breakdown */}
      <LeaveBalanceCard
        total={stats?.myPaidLeaveTotal ?? 8}
        used={stats?.myPaidLeaveUsed ?? 0}
        remaining={stats?.myPaidLeaveRemaining ?? 8}
        onApplyLeave={() => setActiveTab('leaves')}
      />

      {/* Attendance & Leave Quick Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs text-center">
          <span className="text-[11px] font-semibold text-slate-400 block">Attendance Rate</span>
          <div className="text-xl font-extrabold text-emerald-600 mt-1">
            {stats?.myAttendancePercentage ?? 100}%
          </div>
          <span className="text-[10px] text-slate-400">Total recorded</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs text-center">
          <span className="text-[11px] font-semibold text-slate-400 block">Present Days</span>
          <div className="text-xl font-extrabold text-slate-800 mt-1">
            {stats?.myPresentDays ?? 0}
          </div>
          <span className="text-[10px] text-emerald-600 font-medium">Approved</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs text-center">
          <span className="text-[11px] font-semibold text-slate-400 block">Absent Days</span>
          <div className="text-xl font-extrabold text-rose-600 mt-1">
            {stats?.myAbsentDays ?? 0}
          </div>
          <span className="text-[10px] text-rose-500 font-medium">Recorded</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs text-center">
          <span className="text-[11px] font-semibold text-slate-400 block">Leave Days</span>
          <div className="text-xl font-extrabold text-purple-600 mt-1">
            {stats?.myLeaveDays ?? 0}
          </div>
          <span className="text-[10px] text-purple-500 font-medium">Approved leaves</span>
        </div>

      </div>

      {/* Large Mobile Quick Action Buttons (Section 20) */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-2.5">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Quick Shortcuts</h3>
        
        <button
          onClick={() => setActiveTab('leaves')}
          className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50 text-slate-800 hover:text-emerald-800 transition-colors border border-slate-200/60"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold">Apply for Leave</div>
              <div className="text-[11px] text-slate-400">Casual, Sick, or Medical leave request</div>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => setActiveTab('my-attendance')}
          className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50 text-slate-800 hover:text-emerald-800 transition-colors border border-slate-200/60"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold">Attendance History</div>
              <div className="text-[11px] text-slate-400">Monthly breakdown and approval status</div>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => setActiveTab('calendar')}
          className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50 text-slate-800 hover:text-emerald-800 transition-colors border border-slate-200/60"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold">School Calendar & Holidays</div>
              <div className="text-[11px] text-slate-400">Official holidays and non-working days</div>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-slate-400" />
        </button>
      </div>

    </div>
  );
};
