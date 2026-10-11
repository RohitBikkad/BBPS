import React, { useState, useEffect } from 'react';
import { AttendanceRecord, FinalAttendanceStatus } from '../types';
import api from '../api/client';
import { AttendanceCorrectionModal } from '../components/AttendanceCorrectionModal';
import { AuditTrailModal } from '../components/AuditTrailModal';
import {
  CheckCircle2, XCircle, Clock, ShieldCheck, Calendar, Filter,
  History, Sparkles, AlertCircle, Edit3, CheckCheck, RefreshCw
} from 'lucide-react';

export const DailyApprovalPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [bulkLoading, setBulkLoading] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Modals
  const [selectedCorrectionRecord, setSelectedCorrectionRecord] = useState<AttendanceRecord | null>(null);
  const [showCorrectionModal, setShowCorrectionModal] = useState<boolean>(false);
  const [showAuditModal, setShowAuditModal] = useState<boolean>(false);
  const [showBulkConfirm, setShowBulkConfirm] = useState<boolean>(false);

  // Filter
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const fetchRecords = async () => {
    setLoading(true);
    setFeedback(null);
    try {
      const res = await api.get<AttendanceRecord[]>(`/attendance/approval/daily?date=${selectedDate}`);
      setRecords(res.data);
    } catch (err) {
      console.error(err);
      setFeedback({ message: 'Failed to load attendance list for date ' + selectedDate, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [selectedDate]);

  // Single Approve
  const handleApprove = async (record: AttendanceRecord, status: FinalAttendanceStatus, remarks?: string) => {
    if (!record.id) {
      setFeedback({ message: 'Staff has not marked attendance yet for this date', type: 'error' });
      return;
    }
    setActionLoading(record.id);
    try {
      await api.post('/attendance/approval/single', {
        attendanceId: record.id,
        finalStatus: status,
        principalRemarks: remarks || `Approved as ${status}`,
      });
      setFeedback({ message: `Attendance for ${record.staffName} approved as ${status}`, type: 'success' });
      fetchRecords();
    } catch (err: any) {
      setFeedback({ message: err.response?.data?.message || 'Failed to approve attendance', type: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  // Bulk Approve
  const handleBulkApprove = async () => {
    setBulkLoading(true);
    setShowBulkConfirm(false);
    try {
      const res = await api.post<{ count: number }>('/attendance/approval/bulk', {
        attendanceDate: selectedDate,
        principalRemarks: 'Bulk Approved by Principal',
      });
      setFeedback({
        message: `Successfully approved all ${res.data.count} pending attendance submissions!`,
        type: 'success',
      });
      fetchRecords();
    } catch (err: any) {
      setFeedback({ message: err.response?.data?.message || 'Bulk approval failed', type: 'error' });
    } finally {
      setBulkLoading(false);
    }
  };

  const pendingCount = records.filter(r => r.approvalStatus === 'PENDING' && r.markedStatus != null).length;
  const presentCount = records.filter(r => r.finalStatus === 'PRESENT').length;
  const absentCount = records.filter(r => r.finalStatus === 'ABSENT').length;
  const onLeaveCount = records.filter(r => r.finalStatus === 'ON_LEAVE' || r.onLeave).length;

  const filteredRecords = records.filter(r => {
    if (filterStatus === 'PENDING') return r.approvalStatus === 'PENDING' && r.markedStatus != null;
    if (filterStatus === 'PRESENT') return r.finalStatus === 'PRESENT';
    if (filterStatus === 'ABSENT') return r.finalStatus === 'ABSENT';
    if (filterStatus === 'ON_LEAVE') return r.finalStatus === 'ON_LEAVE' || r.onLeave;
    if (filterStatus === 'NOT_MARKED') return r.finalStatus === 'NOT_MARKED';
    return true;
  });

  return (
    <div className="space-y-6 pb-24">
      
      {/* Top Bar with Date Selector and Action Buttons */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div>
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Verification Desk</span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
              Daily Attendance Approval
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Review and finalize official attendance for school staff.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Date Picker */}
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
              onClick={fetchRecords}
              className="p-2.5 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            {/* Audit Log Trigger */}
            <button
              onClick={() => setShowAuditModal(true)}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors"
            >
              <History className="w-3.5 h-3.5 text-indigo-600" />
              <span>Audit Trail</span>
            </button>

            {/* Bulk Approve Button */}
            <button
              onClick={() => setShowBulkConfirm(true)}
              disabled={pendingCount === 0 || bulkLoading}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white text-xs font-bold shadow-md shadow-emerald-700/20 disabled:opacity-50 transition-all active:scale-[0.98]"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Approve All Pending ({pendingCount})</span>
            </button>
          </div>

        </div>

        {/* Quick Date Stat Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-5 pt-4 border-t border-slate-100 text-xs">
          <div className="bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/70 text-center">
            <span className="text-[10px] text-amber-700 block font-medium">Pending Review</span>
            <span className="text-base font-extrabold text-amber-900">{pendingCount}</span>
          </div>
          <div className="bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-200/70 text-center">
            <span className="text-[10px] text-emerald-700 block font-medium">Approved Present</span>
            <span className="text-base font-extrabold text-emerald-900">{presentCount}</span>
          </div>
          <div className="bg-rose-50/60 p-2.5 rounded-xl border border-rose-200/70 text-center">
            <span className="text-[10px] text-rose-700 block font-medium">Approved Absent</span>
            <span className="text-base font-extrabold text-rose-900">{absentCount}</span>
          </div>
          <div className="bg-purple-50/60 p-2.5 rounded-xl border border-purple-200/70 text-center">
            <span className="text-[10px] text-purple-700 block font-medium">On Approved Leave</span>
            <span className="text-base font-extrabold text-purple-900">{onLeaveCount}</span>
          </div>
        </div>

      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div className={`p-4 rounded-2xl text-xs font-semibold flex items-center space-x-2 ${
          feedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center space-x-1 overflow-x-auto pb-1">
        {[
          { id: 'ALL', label: `All Staff (${records.length})` },
          { id: 'PENDING', label: `Pending (${pendingCount})` },
          { id: 'PRESENT', label: `Present (${presentCount})` },
          { id: 'ABSENT', label: `Absent (${absentCount})` },
          { id: 'ON_LEAVE', label: `On Leave (${onLeaveCount})` },
          { id: 'NOT_MARKED', label: 'Not Marked' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterStatus(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              filterStatus === tab.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Mobile Card List (Section 28 Mobile-First Design) */}
      <div className="space-y-3">
        {loading ? (
          <div className="bg-white rounded-3xl p-12 text-center text-xs text-slate-400 border border-slate-200">
            <Clock className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
            Loading attendance records for {selectedDate}...
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center text-xs text-slate-400 border border-slate-200">
            No attendance records match the selected filter.
          </div>
        ) : (
          filteredRecords.map((r) => {
            const isApproved = r.approvalStatus === 'APPROVED';
            const isPending = r.approvalStatus === 'PENDING' && r.markedStatus != null;
            const isOnLeave = r.finalStatus === 'ON_LEAVE' || r.onLeave;
            const notMarked = r.finalStatus === 'NOT_MARKED';

            return (
              <div
                key={r.employeeId}
                className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  
                  {/* Staff Info */}
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center font-extrabold text-slate-700 text-xs shrink-0">
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

                      {/* Check-in Details */}
                      <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
                        {r.markedStatus ? (
                          <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-md font-semibold text-[11px] ${
                            r.markedStatus === 'PRESENT' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                          }`}>
                            <span>Staff Marked: {r.markedStatus}</span>
                            {r.markedAt && (
                              <span className="text-slate-400 font-normal">
                                @ {new Date(r.markedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            )}
                          </span>
                        ) : isOnLeave ? (
                          <span className="px-2 py-0.5 rounded-md font-semibold text-[11px] bg-purple-50 text-purple-700">
                            Approved Leave Today
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
                              ? 'bg-emerald-100/70 text-emerald-800 border-emerald-300'
                              : r.finalStatus === 'ABSENT'
                              ? 'bg-rose-100/70 text-rose-800 border-rose-300'
                              : 'bg-purple-100/70 text-purple-800 border-purple-300'
                          }`}>
                            Official: {r.finalStatus}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Principal Action Buttons */}
                  <div className="flex items-center gap-2 self-end sm:self-center mt-2 sm:mt-0">
                    
                    {/* If marked and pending approval */}
                    {isPending && (
                      <>
                        <button
                          onClick={() => handleApprove(r, 'PRESENT')}
                          disabled={actionLoading === r.id}
                          className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve Present</span>
                        </button>

                        <button
                          onClick={() => handleApprove(r, 'ABSENT')}
                          disabled={actionLoading === r.id}
                          className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Confirm Absent</span>
                        </button>
                      </>
                    )}

                    {/* Correction / Audit option if already has an attendance record */}
                    {r.id && (
                      <button
                        onClick={() => {
                          setSelectedCorrectionRecord(r);
                          setShowCorrectionModal(true);
                        }}
                        className="flex items-center space-x-1 px-2.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold"
                        title="Correct attendance with audit trail"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                        <span className="hidden sm:inline">Correct</span>
                      </button>
                    )}

                    {notMarked && (
                      <span className="text-xs text-slate-400 italic px-2">Awaiting staff mark</span>
                    )}

                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Confirmation Modal for Bulk Approval */}
      {showBulkConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center space-x-2.5 text-amber-600 font-bold text-base mb-2">
              <AlertCircle className="w-5 h-5" />
              <span>Confirm Bulk Approval</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Are you sure you want to approve all <strong>{pendingCount} pending attendance records</strong> for{' '}
              <strong>{selectedDate}</strong>?
              <br /><br />
              Staff marked as Present will be finalized as <strong>PRESENT</strong>, and staff marked as Absent will be finalized as <strong>ABSENT</strong>.
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowBulkConfirm(false)}
                className="flex-1 py-2.5 text-xs font-semibold rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkApprove}
                disabled={bulkLoading}
                className="flex-1 py-2.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20"
              >
                {bulkLoading ? 'Approving...' : 'Yes, Approve All'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Correction Modal */}
      <AttendanceCorrectionModal
        record={selectedCorrectionRecord}
        isOpen={showCorrectionModal}
        onClose={() => setShowCorrectionModal(false)}
        onSuccess={fetchRecords}
      />

      {/* Audit Trail Modal */}
      <AuditTrailModal
        isOpen={showAuditModal}
        onClose={() => setShowAuditModal(false)}
      />

    </div>
  );
};
