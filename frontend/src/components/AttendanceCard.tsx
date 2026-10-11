import React, { useState } from 'react';
import { AttendanceRecord, MarkedStatus } from '../types';
import api from '../api/client';
import { CheckCircle2, XCircle, Clock, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';

interface AttendanceCardProps {
  todayRecord?: AttendanceRecord;
  onRefresh: () => void;
}

export const AttendanceCard: React.FC<AttendanceCardProps> = ({ todayRecord, onRefresh }) => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleMark = async (status: MarkedStatus) => {
    setSubmitting(true);
    setFeedback(null);
    try {
      await api.post('/attendance/mark', { markedStatus: status });
      setFeedback({
        message: 'Attendance marked successfully. Waiting for Principal approval.',
        type: 'success',
      });
      onRefresh();
    } catch (err: any) {
      setFeedback({
        message: err.response?.data?.message || 'Failed to mark attendance. Please try again.',
        type: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const todayStr = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const isMarked = todayRecord && todayRecord.finalStatus !== 'NOT_MARKED';
  const isApproved = todayRecord && todayRecord.approvalStatus === 'APPROVED';
  const isPending = todayRecord && todayRecord.approvalStatus === 'PENDING' && todayRecord.markedStatus != null;
  const isOnLeave = todayRecord && (todayRecord.finalStatus === 'ON_LEAVE' || todayRecord.onLeave);

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80 overflow-hidden relative">
      {/* Top Banner decoration */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Daily Attendance</span>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">{todayStr}</h2>
        </div>
        
        {/* Status Badge */}
        {isOnLeave ? (
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>On Approved Leave</span>
          </span>
        ) : isApproved ? (
          <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold ${
            todayRecord?.finalStatus === 'PRESENT' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
          }`}>
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Official: {todayRecord?.finalStatus}</span>
          </span>
        ) : isPending ? (
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5 animate-spin" />
            <span>Pending Principal Approval</span>
          </span>
        ) : (
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            <span>Not Marked Yet</span>
          </span>
        )}
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div className={`p-3.5 rounded-2xl mb-4 text-xs font-medium flex items-start space-x-2.5 ${
          feedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* State 1: On Leave */}
      {isOnLeave ? (
        <div className="bg-purple-50/50 rounded-2xl p-4 border border-purple-100 text-center">
          <p className="text-sm font-semibold text-purple-900">You are on approved leave for today</p>
          <p className="text-xs text-purple-600 mt-1">Official Attendance Status: <span className="font-bold">ON_LEAVE</span>. Attendance marking is disabled.</p>
        </div>
      ) : isApproved ? (
        /* State 2: Approved by Principal */
        <div className="bg-gradient-to-br from-emerald-50/60 to-slate-50 rounded-2xl p-4 sm:p-5 border border-emerald-100">
          <div className="flex items-start space-x-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 ${
              todayRecord?.finalStatus === 'PRESENT' ? 'bg-emerald-600' : 'bg-rose-600'
            }`}>
              {todayRecord?.finalStatus === 'PRESENT' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-slate-800">Attendance Approved</h3>
              <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-slate-600">
                <div>
                  <span className="text-slate-400 block text-[10px]">Official Status</span>
                  <span className="font-semibold text-slate-900">{todayRecord?.finalStatus}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Approved By</span>
                  <span className="font-semibold text-slate-900">{todayRecord?.approvedBy || 'Principal'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Approved Time</span>
                  <span className="font-semibold text-slate-900">
                    {todayRecord?.approvedAt ? new Date(todayRecord.approvedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Verified'}
                  </span>
                </div>
                {todayRecord?.principalRemarks && (
                  <div>
                    <span className="text-slate-400 block text-[10px]">Principal Remarks</span>
                    <span className="font-semibold text-slate-900">{todayRecord.principalRemarks}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : isPending ? (
        /* State 3: Marked, Waiting Principal */
        <div className="bg-amber-50/60 rounded-2xl p-4 sm:p-5 border border-amber-200/80">
          <div className="flex items-start space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-white shrink-0 shadow-sm">
              <Clock className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-amber-900">Attendance marked successfully</h3>
              <p className="text-xs text-amber-700 mt-0.5">Waiting for Principal review and approval.</p>
              
              <div className="mt-3 pt-2.5 border-t border-amber-200/60 flex items-center justify-between text-xs">
                <span className="text-amber-800 font-medium">Marked as: <strong className="font-bold">{todayRecord?.markedStatus}</strong></span>
                <span className="text-amber-700 text-[11px]">
                  {todayRecord?.markedAt ? new Date(todayRecord.markedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* State 4: Not Marked Yet — Big Mobile-First Touch Buttons */
        <div>
          <p className="text-xs text-slate-500 mb-3">Mark your daily attendance below. It will be sent to the Principal for official verification.</p>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            
            <button
              onClick={() => handleMark('PRESENT')}
              disabled={submitting}
              className="group relative flex flex-col items-center justify-center py-4 sm:py-5 px-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold shadow-md shadow-emerald-500/20 active:scale-[0.98] transition-all disabled:opacity-60"
            >
              <CheckCircle2 className="w-7 h-7 mb-1.5 transition-transform group-hover:scale-110" />
              <span className="text-base tracking-wide">Present</span>
              <span className="text-[10px] text-emerald-100 font-normal">I am in school</span>
            </button>

            <button
              onClick={() => handleMark('ABSENT')}
              disabled={submitting}
              className="group relative flex flex-col items-center justify-center py-4 sm:py-5 px-3 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white font-bold shadow-md shadow-slate-700/20 active:scale-[0.98] transition-all disabled:opacity-60"
            >
              <XCircle className="w-7 h-7 mb-1.5 transition-transform group-hover:scale-110" />
              <span className="text-base tracking-wide">Absent</span>
              <span className="text-[10px] text-slate-300 font-normal">Not reporting today</span>
            </button>

          </div>
        </div>
      )}

    </div>
  );
};
