import React, { useState, useEffect } from 'react';
import { AttendanceRecord, LeaveRecord } from '../types';
import api from '../api/client';
import {
  FileText, Download, Filter, Printer, Calendar,
  Table, RefreshCw, CheckCircle2, ShieldCheck, Sparkles
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const [reportType, setReportType] = useState<'attendance' | 'leave'>('attendance');
  const [startDate, setStartDate] = useState<string>(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [department, setDepartment] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [employeeId, setEmployeeId] = useState<string>('');

  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [leaveData, setLeaveData] = useState<LeaveRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (department) params.append('department', department);
      if (status) params.append('status', status);
      if (employeeId) params.append('employeeId', employeeId);

      if (reportType === 'attendance') {
        const res = await api.get<AttendanceRecord[]>(`/reports/attendance?${params.toString()}`);
        setAttendanceData(res.data);
      } else {
        const res = await api.get<LeaveRecord[]>(`/reports/leaves?${params.toString()}`);
        setLeaveData(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [reportType, startDate, endDate, department, status]);

  const handleExportExcel = () => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (department) params.append('department', department);
    if (status) params.append('status', status);
    if (employeeId) params.append('employeeId', employeeId);

    const token = localStorage.getItem('bbps_token');
    window.open(`/api/reports/attendance/export/excel?${params.toString()}&token=${token}`, '_blank');
  };

  const handleExportCsv = () => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (department) params.append('department', department);
    if (status) params.append('status', status);
    if (employeeId) params.append('employeeId', employeeId);

    const token = localStorage.getItem('bbps_token');
    const path = reportType === 'attendance' ? '/api/reports/attendance/export/csv' : '/api/reports/leaves/export/csv';
    window.open(`${path}?${params.toString()}&token=${token}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-24">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Audit & Compliance</span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">Staff Reports & Analytics</h1>
          <p className="text-xs text-slate-500 mt-1">Official reports generated from approved database records</p>
        </div>

        <div className="flex items-center space-x-2">
          {reportType === 'attendance' && (
            <button
              onClick={handleExportExcel}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Excel</span>
            </button>
          )}

          <button
            onClick={handleExportCsv}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="p-2 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
            title="Print report"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Report Toggle & Filters */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        
        {/* Toggle Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => setReportType('attendance')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
              reportType === 'attendance'
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            Attendance Report
          </button>
          <button
            onClick={() => setReportType('leave')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
              reportType === 'leave'
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            Leave Usage Report
          </button>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-slate-500 font-semibold mb-1">From Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 font-medium"
            />
          </div>

          <div>
            <label className="block text-slate-500 font-semibold mb-1">To Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 font-medium"
            />
          </div>

          <div>
            <label className="block text-slate-500 font-semibold mb-1">Department</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full p-2 rounded-xl border border-slate-200 bg-white"
            >
              <option value="">All Departments</option>
              <option value="Science">Science</option>
              <option value="Humanities">Humanities</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Administration">Administration</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-500 font-semibold mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 rounded-xl border border-slate-200 bg-white"
            >
              <option value="">All Statuses</option>
              {reportType === 'attendance' ? (
                <>
                  <option value="PRESENT">PRESENT</option>
                  <option value="ABSENT">ABSENT</option>
                  <option value="ON_LEAVE">ON_LEAVE</option>
                </>
              ) : (
                <>
                  <option value="APPROVED">APPROVED</option>
                  <option value="PENDING">PENDING</option>
                  <option value="REJECTED">REJECTED</option>
                </>
              )}
            </select>
          </div>
        </div>

      </div>

      {/* Report Table / Cards */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading report records...</div>
        ) : reportType === 'attendance' ? (
          /* Attendance Report Table */
          attendanceData.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400">No attendance data matching your criteria.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px]">
                    <th className="pb-3 px-3">Date</th>
                    <th className="pb-3 px-3">Employee</th>
                    <th className="pb-3 px-3">Department</th>
                    <th className="pb-3 px-3">Marked</th>
                    <th className="pb-3 px-3">Official Status</th>
                    <th className="pb-3 px-3">Approval</th>
                    <th className="pb-3 px-3">Approved By</th>
                    <th className="pb-3 px-3">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {attendanceData.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3 font-semibold text-slate-900 whitespace-nowrap">{row.attendanceDate}</td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-800">{row.staffName}</div>
                        <div className="text-[10px] text-slate-400">{row.employeeId}</div>
                      </td>
                      <td className="py-3 px-3">{row.department}</td>
                      <td className="py-3 px-3 font-semibold">{row.markedStatus || '-'}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          row.finalStatus === 'PRESENT' ? 'bg-emerald-100 text-emerald-800' :
                          row.finalStatus === 'ABSENT' ? 'bg-rose-100 text-rose-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {row.finalStatus}
                        </span>
                      </td>
                      <td className="py-3 px-3">{row.approvalStatus}</td>
                      <td className="py-3 px-3 font-medium text-slate-800">{row.approvedBy || '-'}</td>
                      <td className="py-3 px-3 text-slate-500 italic max-w-xs truncate">{row.principalRemarks || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          /* Leave Report Table */
          leaveData.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400">No leave records matching your criteria.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px]">
                    <th className="pb-3 px-3">Staff</th>
                    <th className="pb-3 px-3">Leave Type</th>
                    <th className="pb-3 px-3">Date Range</th>
                    <th className="pb-3 px-3">Total Days</th>
                    <th className="pb-3 px-3">Paid Days</th>
                    <th className="pb-3 px-3">Unpaid Days</th>
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 px-3">Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {leaveData.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-800">{row.staffName}</div>
                        <div className="text-[10px] text-slate-400">{row.employeeId} • {row.department}</div>
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-800">{row.leaveType}</td>
                      <td className="py-3 px-3 whitespace-nowrap">{row.startDate} to {row.endDate}</td>
                      <td className="py-3 px-3 font-extrabold text-slate-900">{row.totalDays}</td>
                      <td className="py-3 px-3 font-bold text-emerald-700">{row.paidDays}</td>
                      <td className="py-3 px-3 font-bold text-amber-700">{row.unpaidDays}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          row.finalStatus === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                          row.finalStatus === 'REJECTED' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {row.finalStatus}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-500 italic max-w-xs truncate">{row.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>

    </div>
  );
};
