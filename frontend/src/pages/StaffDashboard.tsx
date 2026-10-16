import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { DashboardStats } from '../types';
import api from '../api/client';
import { AttendanceCard } from '../components/AttendanceCard';
import { LeaveBalanceCard } from '../components/LeaveBalanceCard';
import {
  Calendar, Clock, CheckCircle2, XCircle, ArrowUpRight,
  Sparkles, History, UserCheck, ShieldCheck, Utensils,
  Award, Camera, UserPlus, ArrowRight, Smile
} from 'lucide-react';

interface StaffDashboardProps {
  setActiveTab: (tab: string) => void;
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({ setActiveTab }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [studentCount, setStudentCount] = useState<number>(3);
  const [pendingLeaveCount, setPendingLeaveCount] = useState<number>(0);

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

    // Fetch preprimary classroom preview
    api.get('/preprimary/teacher/students')
      .then(res => {
        if (Array.isArray(res.data)) {
          setStudentCount(res.data.length);
        }
      })
      .catch(e => console.warn('Could not load student preview', e));

    api.get('/preprimary/teacher/leaves')
      .then(res => {
        if (Array.isArray(res.data)) {
          const pending = res.data.filter((l: any) => l.status === 'PENDING').length;
          setPendingLeaveCount(pending);
        }
      })
      .catch(e => console.warn('Could not load leave preview', e));
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

      {/* Pre-Primary Classroom Care Desk Hero Widget */}
      <div className="bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-xl shadow-purple-950/25 relative overflow-hidden border border-purple-500/25">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-200 border border-purple-400/30 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Teacher Desk • Bluebell Blossom</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
                🧸 Pre-Primary Classroom Care Desk
              </h2>
              <p className="text-xs sm:text-sm text-purple-200/90 mt-1 max-w-xl">
                Fill today's meals, mood & naps, award NEP developmental badges, review leaves & share photos with parents.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('preprimary-desk')}
              className="inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-extrabold text-sm shadow-lg shadow-purple-500/30 transition-all hover:scale-102 shrink-0 cursor-pointer"
            >
              <span>Open Classroom Desk</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Stat Indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-center">
              <span className="text-[11px] text-purple-200 font-medium block">Active Toddlers</span>
              <span className="text-lg font-black text-white mt-0.5 block">{studentCount} Students</span>
              <span className="text-[10px] text-purple-300">Nursery & Playgroup</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-center">
              <span className="text-[11px] text-purple-200 font-medium block">Today's Care Sheet</span>
              <span className="text-lg font-black text-emerald-300 mt-0.5 block">Live Entry</span>
              <span className="text-[10px] text-emerald-200">Meals, Nap & Mood</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-center">
              <span className="text-[11px] text-purple-200 font-medium block">Parent Leaves</span>
              <span className={`text-lg font-black mt-0.5 block ${pendingLeaveCount > 0 ? 'text-amber-300' : 'text-purple-200'}`}>
                {pendingLeaveCount > 0 ? `${pendingLeaveCount} Pending` : 'All Reviewed'}
              </span>
              <span className="text-[10px] text-purple-300">Absence requests</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-center">
              <span className="text-[11px] text-purple-200 font-medium block">NEP Milestones</span>
              <span className="text-lg font-black text-amber-300 mt-0.5 block">5 Domains</span>
              <span className="text-[10px] text-amber-200">Growth Badges</span>
            </div>
          </div>

          {/* 1-Click Action Shortcut Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            <button
              onClick={() => setActiveTab('preprimary-desk:roster')}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all text-center group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                <Utensils className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white">Daily Routine</span>
              <span className="text-[10px] text-purple-200">Meals & Mood</span>
            </button>

            <button
              onClick={() => setActiveTab('preprimary-desk:milestones')}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all text-center group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                <Award className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white">Award Badges</span>
              <span className="text-[10px] text-purple-200">Growth Skills</span>
            </button>

            <button
              onClick={() => setActiveTab('preprimary-desk:leaves')}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all text-center group relative cursor-pointer"
            >
              {pendingLeaveCount > 0 && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
              )}
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white">Student Leaves</span>
              <span className="text-[10px] text-purple-200">Review Notes</span>
            </button>

            <button
              onClick={() => setActiveTab('preprimary-desk:broadcast')}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all text-center group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                <Camera className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white">Moments & Alerts</span>
              <span className="text-[10px] text-purple-200">Photos & Packing</span>
            </button>

            <button
              onClick={() => setActiveTab('preprimary-desk:students')}
              className="col-span-2 sm:col-span-1 flex flex-col items-center justify-center p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all text-center group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                <UserPlus className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white">Enroll Toddler</span>
              <span className="text-[10px] text-purple-200">Roster & Details</span>
            </button>
          </div>
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
