import React, { useState } from 'react';
import { AttendanceRecord, FinalAttendanceStatus } from '../types';
import api from '../api/client';
import { AlertTriangle, X, CheckCircle2 } from 'lucide-react';

interface AttendanceCorrectionModalProps {
  record: AttendanceRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AttendanceCorrectionModal: React.FC<AttendanceCorrectionModalProps> = ({
  record,
  isOpen,
  onClose,
  onSuccess,
}) => {
  if (!isOpen || !record) return null;

  const [newStatus, setNewStatus] = useState<FinalAttendanceStatus>(
    record.finalStatus === 'PRESENT' ? 'ABSENT' : 'PRESENT'
  );
  const [reason, setReason] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('Please provide a valid reason for this attendance correction.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await api.post('/attendance/correct', {
        attendanceId: record.id,
        newStatus,
        reason: reason.trim(),
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to correct attendance');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-amber-50/70 border-b border-amber-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-slate-800 text-sm sm:text-base">Correct Attendance & Audit</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400">Staff Member:</span>
              <span className="font-semibold text-slate-800">{record.staffName} ({record.employeeId})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Date:</span>
              <span className="font-semibold text-slate-800">{record.attendanceDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Current Status:</span>
              <span className="font-semibold text-amber-600">{record.finalStatus}</span>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-medium border border-rose-200">
              {error}
            </div>
          )}

          {/* New Status Select */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">New Attendance Status</label>
            <div className="grid grid-cols-3 gap-2">
              {(['PRESENT', 'ABSENT', 'ON_LEAVE'] as FinalAttendanceStatus[]).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setNewStatus(status)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    newStatus === status
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Reason Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Reason for Adjustment <span className="text-rose-500">* (Audit Logged)</span>
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Staff had permission to leave early, biometric mismatch, medical excuse..."
              className="w-full text-xs rounded-xl border border-slate-300 p-3 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>

          <div className="text-[11px] text-slate-400">
            This action will generate an immutable entry in the system attendance audit log.
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all disabled:opacity-60 shadow-md shadow-emerald-600/20"
            >
              {submitting ? 'Saving...' : 'Save Correction'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
