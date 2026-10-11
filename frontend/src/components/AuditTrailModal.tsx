import React, { useState, useEffect } from 'react';
import { AttendanceAudit } from '../types';
import api from '../api/client';
import { History, X, Search, ShieldCheck } from 'lucide-react';

interface AuditTrailModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeId?: string;
}

export const AuditTrailModal: React.FC<AuditTrailModalProps> = ({
  isOpen,
  onClose,
  employeeId,
}) => {
  if (!isOpen) return null;

  const [logs, setLogs] = useState<AttendanceAudit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const url = employeeId ? `/attendance/audit-logs?employeeId=${employeeId}` : '/attendance/audit-logs';
        const res = await api.get<AttendanceAudit[]>(url);
        setLogs(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [employeeId]);

  const filtered = logs.filter(
    (l) =>
      l.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.changedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">Attendance Audit Trail</h3>
              <p className="text-[11px] text-slate-500">Permanent record of all modifications & corrections</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-100 bg-white">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by Employee ID, reason, or modified by..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Log Entries */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {loading ? (
            <div className="p-10 text-center text-xs text-slate-400">Loading audit history...</div>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center text-xs text-slate-400">No audit logs found</div>
          ) : (
            filtered.map((log) => (
              <div key={log.id} className="bg-slate-50/70 rounded-2xl p-4 border border-slate-200/80 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900">{log.employeeId}</span>
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">
                      Date: {log.attendanceDate}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {new Date(log.changedAt).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-slate-700 font-medium">
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">{log.previousStatus}</span>
                  <span>→</span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold">{log.newStatus}</span>
                </div>

                <div className="text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200/60">
                  <span className="font-semibold text-slate-700">Reason: </span>
                  {log.reason}
                </div>

                <div className="text-[11px] text-slate-400 flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Modified by Principal: <strong className="text-slate-600">{log.changedBy}</strong></span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-900"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
