import React, { useState, useEffect } from 'react';
import { AttendanceRecord } from '../types';
import api from '../api/client';
import {
  Users, CheckCircle2, XCircle, Clock, Calendar,
  Sparkles, RefreshCw, Filter
} from 'lucide-react';

export const SupervisorTeamPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [teamRecords, setTeamRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const res = await api.get<AttendanceRecord[]>(`/attendance/supervisor/team?date=${selectedDate}`);
      setTeamRecords(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, [selectedDate]);

  const presentCount = teamRecords.filter(r => r.finalStatus === 'PRESENT').length;
  const absentCount = teamRecords.filter(r => r.finalStatus === 'ABSENT').length;
  const onLeaveCount = teamRecords.filter(r => r.finalStatus === 'ON_LEAVE' || r.onLeave).length;
  const pendingCount = teamRecords.filter(r => r.approvalStatus === 'PENDING' && r.markedStatus != null).length;
  const notMarkedCount = teamRecords.filter(r => r.finalStatus === 'NOT_MARKED').length;

  return (
    <div className="space-y-6 pb-24">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Department Roster</span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">Assigned Team Attendance</h1>
            <p className="text-xs text-slate-500 mt-1">Review your department staff attendance for the day</p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 bg-slate-50 px-3 py-2 rounded-2xl border border-slate-200">
              <Calendar className="w-4 h-4 text-slate-500" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="text-xs font-semibold text-slate-700 bg-transparent focus:outline-hidden"
              />
            </div>
            <button
              onClick={fetchTeam}
              className="p-2.5 rounded-2xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Counter Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-5 pt-4 border-t border-slate-100 text-xs">
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
            <span className="text-[10px] text-slate-400 block font-medium">Assigned</span>
            <span className="text-base font-extrabold text-slate-800">{teamRecords.length}</span>
          </div>
          <div className="bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-200 text-center">
            <span className="text-[10px] text-emerald-700 block font-medium">Present</span>
            <span className="text-base font-extrabold text-emerald-800">{presentCount}</span>
          </div>
          <div className="bg-rose-50/60 p-2.5 rounded-xl border border-rose-200 text-center">
            <span className="text-[10px] text-rose-700 block font-medium">Absent</span>
            <span className="text-base font-extrabold text-rose-800">{absentCount}</span>
          </div>
          <div className="bg-purple-50/60 p-2.5 rounded-xl border border-purple-200 text-center">
            <span className="text-[10px] text-purple-700 block font-medium">On Leave</span>
            <span className="text-base font-extrabold text-purple-800">{onLeaveCount}</span>
          </div>
          <div className="bg-amber-50/60 p-2.5 rounded-xl border border-amber-200 text-center">
            <span className="text-[10px] text-amber-700 block font-medium">Pending Approval</span>
            <span className="text-base font-extrabold text-amber-800">{pendingCount}</span>
          </div>
        </div>
      </div>

      {/* Team Roster Cards */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-12 bg-white rounded-3xl text-center text-xs text-slate-400 border border-slate-200">
            Loading team roster...
          </div>
        ) : teamRecords.length === 0 ? (
          <div className="p-12 bg-white rounded-3xl text-center text-xs text-slate-400 border border-slate-200">
            No staff assigned to your supervisor account yet.
          </div>
        ) : (
          teamRecords.map((r) => {
            const isApproved = r.approvalStatus === 'APPROVED';
            const isOnLeave = r.finalStatus === 'ON_LEAVE' || r.onLeave;
            const notMarked = r.finalStatus === 'NOT_MARKED';

            return (
              <div
                key={r.employeeId}
                className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                    {r.employeeId.slice(-3)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 text-sm">{r.staffName}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-semibold">
                        {r.employeeId}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {r.department} • {r.designation}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      {r.markedStatus ? (
                        <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-md font-semibold text-[11px] ${
                          r.markedStatus === 'PRESENT' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        }`}>
                          <span>Marked: {r.markedStatus}</span>
                          {r.markedAt && (
                            <span className="text-slate-400 font-normal">
                              @ {new Date(r.markedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          )}
                        </span>
                      ) : isOnLeave ? (
                        <span className="px-2 py-0.5 rounded-md font-semibold text-[11px] bg-purple-50 text-purple-700">
                          Approved Leave
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md font-medium text-[11px] bg-slate-100 text-slate-500">
                          Not Marked Yet
                        </span>
                      )}

                      {/* Official Status */}
                      {isApproved && (
                        <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] border ${
                          r.finalStatus === 'PRESENT'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : r.finalStatus === 'ABSENT'
                            ? 'bg-rose-100 text-rose-800 border-rose-300'
                            : 'bg-purple-100 text-purple-800 border-purple-300'
                        }`}>
                          Official: {r.finalStatus}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status indicator badge */}
                <div className="self-end sm:self-center">
                  <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold ${
                    isOnLeave ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                    r.finalStatus === 'PRESENT' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    r.finalStatus === 'ABSENT' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                    'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    {isOnLeave ? <Sparkles className="w-3.5 h-3.5" /> :
                     r.finalStatus === 'PRESENT' ? <CheckCircle2 className="w-3.5 h-3.5" /> :
                     r.finalStatus === 'ABSENT' ? <XCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                    <span>{isOnLeave ? 'On Leave' : r.finalStatus === 'PRESENT' ? 'Present' : r.finalStatus === 'ABSENT' ? 'Absent' : 'Not Checked In'}</span>
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
