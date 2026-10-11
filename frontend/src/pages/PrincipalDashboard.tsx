import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { DashboardStats } from '../types';
import api from '../api/client';
import {
  Users, CheckCircle2, XCircle, Clock, Calendar, AlertCircle,
  FileText, ShieldCheck, ChevronRight, UserPlus, Sparkles, Building2
} from 'lucide-react';

interface PrincipalDashboardProps {
  setActiveTab: (tab: string) => void;
}

export const PrincipalDashboard: React.FC<PrincipalDashboardProps> = ({ setActiveTab }) => {
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

  const todayStr = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="space-y-6 pb-20">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-green-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-emerald-900/20 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-900/60 text-emerald-200 border border-emerald-500/30 mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Principal & Administrator Portal</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {user?.fullName}
          </h1>
          <p className="mt-1 text-emerald-100 text-xs sm:text-sm">
            {todayStr} • Bluebell Blossom Pre-primary School Overview
          </p>

          {stats && stats.pendingAttendanceApprovals > 0 && (
            <div className="mt-4 inline-flex items-center space-x-2 bg-amber-500/90 text-amber-950 font-bold px-4 py-2 rounded-2xl text-xs shadow-md">
              <Clock className="w-4 h-4 animate-spin text-amber-950" />
              <span>{stats.pendingAttendanceApprovals} staff attendance submissions require your approval today!</span>
            </div>
          )}
        </div>

        <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 w-64 h-64 bg-emerald-600/30 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Today's Attendance Summary (Section 18 requirement) */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Today's Attendance Summary</h2>
            <p className="text-xs text-slate-500">Live verification status from staff check-ins</p>
          </div>
          <button
            onClick={() => setActiveTab('daily-approval')}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center space-x-1"
          >
            <span>Review Approvals</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-400 block">Total Staff</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-extrabold text-slate-900">{stats?.totalStaff ?? 0}</span>
              <span className="text-[11px] text-slate-400 font-medium">registered</span>
            </div>
          </div>

          <div className="bg-emerald-50/60 rounded-2xl p-4 border border-emerald-200/80 shadow-xs">
            <span className="text-[11px] font-semibold text-emerald-700 block">Present</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-extrabold text-emerald-700">{stats?.presentToday ?? 0}</span>
              <span className="text-[11px] text-emerald-600 font-medium">approved</span>
            </div>
          </div>

          <div className="bg-rose-50/60 rounded-2xl p-4 border border-rose-200/80 shadow-xs">
            <span className="text-[11px] font-semibold text-rose-700 block">Absent</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-extrabold text-rose-700">{stats?.absentToday ?? 0}</span>
              <span className="text-[11px] text-rose-600 font-medium">confirmed</span>
            </div>
          </div>

          <div className="bg-purple-50/60 rounded-2xl p-4 border border-purple-200/80 shadow-xs">
            <span className="text-[11px] font-semibold text-purple-700 block">On Leave</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-extrabold text-purple-700">{stats?.onLeaveToday ?? 0}</span>
              <span className="text-[11px] text-purple-600 font-medium">official</span>
            </div>
          </div>

          <div className="bg-amber-50/80 rounded-2xl p-4 border border-amber-300 shadow-xs">
            <span className="text-[11px] font-semibold text-amber-800 block">Pending Approval</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-extrabold text-amber-700">{stats?.pendingAttendanceApprovals ?? 0}</span>
              <span className="text-[11px] text-amber-600 font-medium">waiting</span>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500 block">Not Marked</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-extrabold text-slate-600">{stats?.notMarkedToday ?? 0}</span>
              <span className="text-[11px] text-slate-400 font-medium">pending</span>
            </div>
          </div>

        </div>
      </div>

      {/* Leave Summary & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Leave Summary Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-sm">Leave Applications</h3>
            <button
              onClick={() => setActiveTab('leaves')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Manage
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/60 border border-amber-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-xs">
                  {stats?.pendingLeaveRequests ?? 0}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Pending Review</div>
                  <div className="text-[10px] text-slate-400">Needs Principal sign-off</div>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('leaves')}
                className="px-2.5 py-1 text-[11px] font-bold bg-white text-amber-800 border border-amber-200 rounded-lg"
              >
                Review
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
              <span className="text-slate-600">Approved Leaves (Annual)</span>
              <span className="font-extrabold text-emerald-600">{stats?.approvedLeaves ?? 0}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
              <span className="text-slate-600">Rejected Leaves</span>
              <span className="font-extrabold text-rose-600">{stats?.rejectedLeaves ?? 0}</span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-emerald-50/50 rounded-2xl border border-emerald-100 text-[11px] text-emerald-800">
            <strong>School Rule:</strong> Each staff receives 8 Paid Leave Days. Unpaid leave does not deduct the paid balance.
          </div>
        </div>

        {/* Quick Actions (Large Touch Buttons for Mobile/Tablet) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm lg:col-span-2">
          <h3 className="font-bold text-slate-900 text-sm mb-4">Principal Quick Actions</h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            
            <button
              onClick={() => setActiveTab('daily-approval')}
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 transition-all text-center group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-2 shadow-sm group-hover:scale-105 transition-transform">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold">Approve Attendance</span>
              <span className="text-[10px] text-emerald-600">Daily verification</span>
            </button>

            <button
              onClick={() => setActiveTab('leaves')}
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 transition-all text-center group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center mb-2 shadow-sm group-hover:scale-105 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold">Leave Requests</span>
              <span className="text-[10px] text-amber-700">Multi-step approvals</span>
            </button>

            <button
              onClick={() => setActiveTab('staff-management')}
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 transition-all text-center group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-2 shadow-sm group-hover:scale-105 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold">Manage Staff</span>
              <span className="text-[10px] text-blue-700">Add / Edit / Deactivate</span>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-900 transition-all text-center group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-2 shadow-sm group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold">Official Reports</span>
              <span className="text-[10px] text-indigo-700">Excel & CSV Exports</span>
            </button>

            <button
              onClick={() => setActiveTab('calendar')}
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 transition-all text-center group"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-700 text-white flex items-center justify-center mb-2 shadow-sm group-hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold">School Calendar</span>
              <span className="text-[10px] text-slate-500">Working days & holidays</span>
            </button>

            <button
              onClick={() => setActiveTab('daily-approval')}
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-900 transition-all text-center group"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center mb-2 shadow-sm group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold">Audit History</span>
              <span className="text-[10px] text-rose-700">Corrections log</span>
            </button>

          </div>
        </div>

      </div>

    </div>
  );
};
