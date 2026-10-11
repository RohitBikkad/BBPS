import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { AttendanceRecord } from '../types';
import api from '../api/client';
import { AttendanceCard } from '../components/AttendanceCard';
import {
  Calendar, CheckCircle2, XCircle, Clock, ShieldCheck,
  Filter, Sparkles, RefreshCw
} from 'lucide-react';

export const StaffAttendancePage: React.FC = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<AttendanceRecord[]>([]);
  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      // 1. Today status
      const todayRes = await api.get<AttendanceRecord>('/attendance/my-status');
      setTodayRecord(todayRes.data);

      // 2. History
      let url = '/attendance/my-history';
      if (startDate && endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
      }
      const histRes = await api.get<AttendanceRecord[]>(url);
      setHistory(histRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [startDate, endDate]);

  return (
    <div className="space-y-6 pb-24">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Attendance System</span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">My Attendance</h1>
        </div>
        <button
          onClick={fetchAttendance}
          className="p-2.5 rounded-2xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 shadow-xs"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Today's Card */}
      <AttendanceCard
        todayRecord={todayRecord}
        onRefresh={fetchAttendance}
      />

      {/* History Section */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Attendance History</h2>
            <p className="text-xs text-slate-500">Official records verified and persisted by Principal</p>
          </div>

          {/* Date range filters */}
          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700"
              placeholder="From"
            />
            <span className="text-slate-400 text-xs">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700"
              placeholder="To"
            />
            {(startDate || endDate) && (
              <button
                onClick={() => { setStartDate(''); setEndDate(''); }}
                className="text-[11px] text-rose-600 hover:underline font-semibold"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* History Cards / List */}
        <div className="space-y-3">
          {loading ? (
            <div className="p-10 text-center text-xs text-slate-400">Loading history...</div>
          ) : history.length === 0 ? (
            <div className="p-10 text-center text-xs text-slate-400">No attendance records found.</div>
          ) : (
            history.map((record) => {
              const isApproved = record.approvalStatus === 'APPROVED';
              const isPending = record.approvalStatus === 'PENDING';
              const isOnLeave = record.finalStatus === 'ON_LEAVE' || record.onLeave;

              return (
                <div
                  key={record.id}
                  className="bg-slate-50/70 hover:bg-slate-50 rounded-2xl p-4 border border-slate-200/60 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 font-bold ${
                      isOnLeave ? 'bg-purple-600' :
                      record.finalStatus === 'PRESENT' ? 'bg-emerald-600' :
                      record.finalStatus === 'ABSENT' ? 'bg-rose-600' : 'bg-amber-500'
                    }`}>
                      {isOnLeave ? <Sparkles className="w-4 h-4" /> :
                       record.finalStatus === 'PRESENT' ? <CheckCircle2 className="w-4 h-4" /> :
                       record.finalStatus === 'ABSENT' ? <XCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900 text-sm">
                          {new Date(record.attendanceDate).toLocaleDateString('en-IN', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                        
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          isOnLeave ? 'bg-purple-100 text-purple-800' :
                          record.finalStatus === 'PRESENT' ? 'bg-emerald-100 text-emerald-800' :
                          record.finalStatus === 'ABSENT' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {isApproved ? `Official: ${record.finalStatus}` : `Pending Approval`}
                        </span>
                      </div>

                      <div className="text-slate-500 text-[11px] mt-1 space-x-2">
                        {record.markedStatus && (
                          <span>Marked by you: <strong>{record.markedStatus}</strong></span>
                        )}
                        {record.markedAt && (
                          <span>@ {new Date(record.markedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        )}
                      </div>

                      {record.principalRemarks && (
                        <div className="text-slate-600 text-[11px] mt-1 italic">
                          "{record.principalRemarks}"
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Approval Details */}
                  {isApproved && (
                    <div className="sm:text-right text-[11px] text-slate-500 bg-white sm:bg-transparent p-2.5 sm:p-0 rounded-xl border border-slate-100 sm:border-0">
                      <div className="font-semibold text-slate-800 flex items-center sm:justify-end space-x-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Approved by: {record.approvedBy || 'Principal'}</span>
                      </div>
                      {record.approvedAt && (
                        <div className="text-slate-400 text-[10px] mt-0.5">
                          {new Date(record.approvedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      )}
                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>

      </div>

    </div>
  );
};
