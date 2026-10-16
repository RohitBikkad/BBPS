import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { DashboardStats } from '../types';
import api from '../api/client';
import {
  Users, CheckCircle2, XCircle, Clock, Calendar,
  Sparkles, ArrowRight, ShieldAlert, ChevronRight, UserCheck
} from 'lucide-react';

interface SupervisorDashboardProps {
  setActiveTab: (tab: string) => void;
}

export const SupervisorDashboard: React.FC<SupervisorDashboardProps> = ({ setActiveTab }) => {
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
    <div className="space-y-6 pb-24">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-800/60 text-blue-200 border border-blue-500/30 mb-2">
          <Users className="w-3.5 h-3.5" />
          <span>Department Supervisor Portal</span>
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Welcome, {user?.fullName}
        </h1>
        <p className="text-xs sm:text-sm text-blue-200 mt-1">
          {todayStr} • Department: <strong>{user?.department}</strong>
        </p>

        {stats && stats.pendingLeaveRequests > 0 && (
          <div className="mt-4 inline-flex items-center space-x-2 bg-amber-400 text-amber-950 font-bold px-3.5 py-1.5 rounded-xl text-xs">
            <Clock className="w-4 h-4 animate-spin" />
            <span>{stats.pendingLeaveRequests} pending team leave request(s) awaiting your recommendation</span>
          </div>
        )}
      </div>

      {/* Pre-Primary Care & Classroom Desk Access */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-md border border-purple-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-2xl shrink-0">
            🧸
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base sm:text-lg font-bold text-white">Pre-Primary Classroom Care Desk</h2>
              <span className="text-[10px] bg-purple-500/30 text-purple-200 px-2 py-0.5 rounded-full font-semibold border border-purple-400/30">
                Toddler Care
              </span>
            </div>
            <p className="text-xs text-purple-200 mt-0.5">
              Review toddler routines, meal logs, mood tracking, classroom photos, and developmental milestones.
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('preprimary-desk')}
          className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-bold text-xs shadow-md transition-all shrink-0 cursor-pointer"
        >
          <span>Open Classroom Desk</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Team Metrics (Section 4 & 19) */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Assigned Team Attendance</h2>
            <p className="text-xs text-slate-500">Live monitoring of your department teachers</p>
          </div>
          <button
            onClick={() => setActiveTab('supervisor-team')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
          >
            <span>View Full Team</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-400 block">Assigned Staff</span>
            <div className="text-2xl font-extrabold text-slate-800 mt-1">{stats?.totalStaff ?? 0}</div>
            <span className="text-[10px] text-slate-400 font-medium">in department</span>
          </div>

          <div className="bg-emerald-50/60 rounded-2xl p-4 border border-emerald-200 shadow-xs">
            <span className="text-[11px] font-semibold text-emerald-700 block">Present Today</span>
            <div className="text-2xl font-extrabold text-emerald-800 mt-1">{stats?.presentToday ?? 0}</div>
            <span className="text-[10px] text-emerald-600 font-medium">official</span>
          </div>

          <div className="bg-rose-50/60 rounded-2xl p-4 border border-rose-200 shadow-xs">
            <span className="text-[11px] font-semibold text-rose-700 block">Absent Today</span>
            <div className="text-2xl font-extrabold text-rose-800 mt-1">{stats?.absentToday ?? 0}</div>
            <span className="text-[10px] text-rose-600 font-medium">reported</span>
          </div>

          <div className="bg-purple-50/60 rounded-2xl p-4 border border-purple-200 shadow-xs">
            <span className="text-[11px] font-semibold text-purple-700 block">Staff on Leave</span>
            <div className="text-2xl font-extrabold text-purple-800 mt-1">{stats?.onLeaveToday ?? 0}</div>
            <span className="text-[10px] text-purple-600 font-medium">approved</span>
          </div>

          <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-300 shadow-xs">
            <span className="text-[11px] font-semibold text-amber-800 block">Pending Attendance</span>
            <div className="text-2xl font-extrabold text-amber-800 mt-1">{stats?.pendingAttendanceApprovals ?? 0}</div>
            <span className="text-[10px] text-amber-600 font-medium">awaiting Principal</span>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500 block">Pending Leaves</span>
            <div className="text-2xl font-extrabold text-slate-700 mt-1">{stats?.pendingLeaveRequests ?? 0}</div>
            <span className="text-[10px] text-slate-400 font-medium">requests</span>
          </div>

        </div>
      </div>

      {/* Supervisor Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <div
          onClick={() => setActiveTab('supervisor-team')}
          className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:border-blue-400 cursor-pointer transition-all group"
        >
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Team Attendance Directory</h3>
              <p className="text-xs text-slate-500">Monitor daily attendance & check-ins of assigned teachers</p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs font-bold text-blue-600">
            <span>View team roster</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div
          onClick={() => setActiveTab('leaves')}
          className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:border-amber-400 cursor-pointer transition-all group"
        >
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Review Leave Applications</h3>
              <p className="text-xs text-slate-500">Recommend or reject staff leave before Principal final approval</p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs font-bold text-amber-600">
            <span>Review team requests</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

      </div>

      <div className="p-4 bg-slate-100/70 rounded-2xl text-xs text-slate-600 flex items-center space-x-2 border border-slate-200/60">
        <ShieldAlert className="w-4 h-4 text-slate-500 shrink-0" />
        <span><strong>Supervisor Notice:</strong> As configured, you supervise staff and submit recommendations. Final attendance and leave approvals are authorized by the School Principal.</span>
      </div>

    </div>
  );
};
