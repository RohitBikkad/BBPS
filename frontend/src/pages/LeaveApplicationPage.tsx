import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LeaveRecord, LeavePreview, LeaveType } from '../types';
import api from '../api/client';
import { LeaveBalanceCard } from '../components/LeaveBalanceCard';
import {
  Calendar, Clock, CheckCircle2, XCircle, AlertCircle,
  PlusCircle, FileText, ChevronRight, Sparkles, Send, ShieldCheck
} from 'lucide-react';

export const LeaveApplicationPage: React.FC = () => {
  const { user, role, refreshProfile } = useAuth();
  
  // Application Form State
  const [showApplyModal, setShowApplyModal] = useState<boolean>(false);
  const [leaveType, setLeaveType] = useState<LeaveType>('CASUAL');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [preview, setPreview] = useState<LeavePreview | null>(null);
  const [previewLoading, setPreviewLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Leave Lists
  const [myLeaves, setMyLeaves] = useState<LeaveRecord[]>([]);
  const [supervisorLeaves, setSupervisorLeaves] = useState<LeaveRecord[]>([]);
  const [principalLeaves, setPrincipalLeaves] = useState<LeaveRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Review Modal State
  const [reviewModalLeave, setReviewModalLeave] = useState<LeaveRecord | null>(null);
  const [reviewAction, setReviewAction] = useState<'APPROVE' | 'REJECT'>('APPROVE');
  const [reviewRemarks, setReviewRemarks] = useState<string>('');
  const [reviewLoading, setReviewLoading] = useState<boolean>(false);

  // Active sub-tab
  const [subTab, setSubTab] = useState<'my' | 'supervisor-queue' | 'principal-queue'>('my');

  useEffect(() => {
    if (role === 'ROLE_PRINCIPAL') setSubTab('principal-queue');
    else if (role === 'ROLE_SUPERVISOR') setSubTab('supervisor-queue');
    else setSubTab('my');
  }, [role]);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      if (role === 'ROLE_STAFF' || subTab === 'my') {
        const res = await api.get<LeaveRecord[]>('/leaves/my-leaves');
        setMyLeaves(res.data);
      }
      if (role === 'ROLE_SUPERVISOR' || role === 'ROLE_PRINCIPAL') {
        const supRes = await api.get<LeaveRecord[]>('/leaves/supervisor/team-leaves');
        setSupervisorLeaves(supRes.data);
      }
      if (role === 'ROLE_PRINCIPAL') {
        const prinRes = await api.get<LeaveRecord[]>('/leaves/principal/all');
        setPrincipalLeaves(prinRes.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [subTab]);

  // Live dynamic Paid vs Unpaid calculation preview
  useEffect(() => {
    if (startDate && endDate) {
      if (new Date(endDate) >= new Date(startDate)) {
        setPreviewLoading(true);
        api.get<LeavePreview>(`/leaves/preview?startDate=${startDate}&endDate=${endDate}`)
          .then((res) => {
            setPreview(res.data);
          })
          .catch((err) => {
            console.error(err);
            setPreview(null);
          })
          .finally(() => setPreviewLoading(false));
      } else {
        setPreview(null);
      }
    } else {
      setPreview(null);
    }
  }, [startDate, endDate]);

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setFeedback({ message: 'Please provide a reason for the leave.', type: 'error' });
      return;
    }

    setSubmitting(true);
    setFeedback(null);
    try {
      await api.post('/leaves/apply', {
        leaveType,
        startDate,
        endDate,
        reason: reason.trim(),
      });
      setFeedback({
        message: 'Leave application submitted successfully. Sent for supervisor and principal approval.',
        type: 'success',
      });
      setShowApplyModal(false);
      setStartDate('');
      setEndDate('');
      setReason('');
      setPreview(null);
      fetchLeaves();
      refreshProfile();
    } catch (err: any) {
      setFeedback({
        message: err.response?.data?.message || 'Failed to submit leave request.',
        type: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewModalLeave) return;

    setReviewLoading(true);
    try {
      if (role === 'ROLE_SUPERVISOR') {
        await api.post('/leaves/supervisor/review', {
          leaveRequestId: reviewModalLeave.id,
          action: reviewAction,
          remarks: reviewRemarks.trim(),
        });
        setFeedback({ message: `Leave request ${reviewAction === 'APPROVE' ? 'recommended' : 'rejected'}.`, type: 'success' });
      } else if (role === 'ROLE_PRINCIPAL') {
        await api.post('/leaves/principal/review', {
          leaveRequestId: reviewModalLeave.id,
          action: reviewAction,
          remarks: reviewRemarks.trim(),
        });
        setFeedback({ message: `Leave request officially ${reviewAction === 'APPROVE' ? 'APPROVED' : 'REJECTED'} by Principal.`, type: 'success' });
      }
      setReviewModalLeave(null);
      setReviewRemarks('');
      fetchLeaves();
      refreshProfile();
    } catch (err: any) {
      setFeedback({ message: err.response?.data?.message || 'Review action failed.', type: 'error' });
    } finally {
      setReviewLoading(false);
    }
  };

  const handleCancelLeave = async (id: number) => {
    if (!window.confirm('Are you sure you want to cancel this leave application?')) return;
    try {
      await api.post(`/leaves/cancel/${id}`);
      setFeedback({ message: 'Leave application cancelled.', type: 'success' });
      fetchLeaves();
    } catch (err: any) {
      setFeedback({ message: err.response?.data?.message || 'Failed to cancel leave.', type: 'error' });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">Approved</span>;
      case 'REJECTED':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">Rejected</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-300">Cancelled</span>;
      case 'SUPERVISOR_APPROVED':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-300">Supervisor Recommended</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">Pending Review</span>;
    }
  };

  return (
    <div className="space-y-6 pb-24">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Leave Management</span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">Leaves & Approvals</h1>
          <p className="text-xs text-slate-500 mt-1">
            8 Paid Leave Days allocated per annual cycle. Automatic paid/unpaid calculation.
          </p>
        </div>

        <button
          onClick={() => setShowApplyModal(true)}
          className="self-start sm:self-center flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white text-xs font-bold shadow-md shadow-emerald-700/20 active:scale-95 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Apply for Leave</span>
        </button>
      </div>

      {/* Balance Card for Personal Account */}
      {role === 'ROLE_STAFF' && (
        <LeaveBalanceCard
          total={8}
          used={8 - (user?.paidLeaveBalance ?? 8)}
          remaining={user?.paidLeaveBalance ?? 8}
          onApplyLeave={() => setShowApplyModal(true)}
        />
      )}

      {/* Feedback Alert */}
      {feedback && (
        <div className={`p-4 rounded-2xl text-xs font-semibold flex items-center space-x-2 ${
          feedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Role Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setSubTab('my')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            subTab === 'my' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          My Applications
        </button>

        {role === 'ROLE_SUPERVISOR' && (
          <button
            onClick={() => setSubTab('supervisor-queue')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              subTab === 'supervisor-queue' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Team Queue ({supervisorLeaves.filter(l => l.finalStatus === 'PENDING').length})
          </button>
        )}

        {role === 'ROLE_PRINCIPAL' && (
          <button
            onClick={() => setSubTab('principal-queue')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              subTab === 'principal-queue' ? 'bg-emerald-700 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Principal Approval Queue ({principalLeaves.filter(l => l.finalStatus === 'PENDING' || l.finalStatus === 'SUPERVISOR_APPROVED').length})
          </button>
        )}
      </div>

      {/* Active Leave Records View */}
      <div className="space-y-3">
        {loading ? (
          <div className="bg-white rounded-3xl p-12 text-center text-xs text-slate-400 border border-slate-200">
            Loading leave applications...
          </div>
        ) : (
          (() => {
            const list = subTab === 'principal-queue' ? principalLeaves : subTab === 'supervisor-queue' ? supervisorLeaves : myLeaves;
            if (list.length === 0) {
              return (
                <div className="bg-white rounded-3xl p-12 text-center text-xs text-slate-400 border border-slate-200">
                  No leave applications found in this queue.
                </div>
              );
            }

            return list.map((leave) => (
              <div
                key={leave.id}
                className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{leave.leaveType} LEAVE</span>
                    <span className="text-slate-400">•</span>
                    <span className="font-semibold text-slate-700">
                      {leave.startDate} to {leave.endDate}
                    </span>
                    <span className="font-extrabold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[11px]">
                      {leave.totalDays} Day{leave.totalDays > 1 ? 's' : ''}
                    </span>
                    {getStatusBadge(leave.finalStatus)}
                  </div>

                  {/* Staff Info if Supervisor or Principal */}
                  {subTab !== 'my' && (
                    <div className="text-slate-500 font-medium">
                      Staff: <strong className="text-slate-800">{leave.staffName}</strong> ({leave.employeeId}) • {leave.department}
                    </div>
                  )}

                  {/* Paid vs Unpaid breakdown */}
                  <div className="flex items-center space-x-3 text-[11px]">
                    <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                      Paid: <strong>{leave.paidDays}</strong> days
                    </span>
                    <span className="text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-md">
                      Unpaid: <strong>{leave.unpaidDays}</strong> days
                    </span>
                  </div>

                  {/* Reason */}
                  <div className="text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="font-semibold text-slate-700">Reason: </span>
                    {leave.reason}
                  </div>

                  {/* Multi-step status log */}
                  <div className="text-[10px] text-slate-400 space-y-0.5">
                    {leave.supervisorReviewedBy && (
                      <div>Supervisor ({leave.supervisorReviewedBy}): {leave.supervisorStatus} {leave.supervisorRemarks && `"${leave.supervisorRemarks}"`}</div>
                    )}
                    {leave.principalApprovedBy && (
                      <div className="text-emerald-700 font-medium">Principal ({leave.principalApprovedBy}): {leave.principalStatus} {leave.principalRemarks && `"${leave.principalRemarks}"`}</div>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center space-x-2 self-end md:self-center">
                  {subTab === 'my' && leave.finalStatus === 'PENDING' && (
                    <button
                      onClick={() => handleCancelLeave(leave.id)}
                      className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold text-xs"
                    >
                      Cancel Request
                    </button>
                  )}

                  {subTab === 'supervisor-queue' && leave.finalStatus === 'PENDING' && (
                    <button
                      onClick={() => {
                        setReviewModalLeave(leave);
                        setReviewAction('APPROVE');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs"
                    >
                      Review & Recommend
                    </button>
                  )}

                  {subTab === 'principal-queue' && (leave.finalStatus === 'PENDING' || leave.finalStatus === 'SUPERVISOR_APPROVED') && (
                    <button
                      onClick={() => {
                        setReviewModalLeave(leave);
                        setReviewAction('APPROVE');
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                    >
                      Final Decision
                    </button>
                  )}
                </div>

              </div>
            ));
          })()
        )}
      </div>

      {/* Leave Application Modal (Sections 14 & 15 Dynamic Paid/Unpaid Calculator) */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden">
            
            <div className="px-6 py-4 bg-emerald-50/70 border-b border-emerald-100 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-800 text-sm sm:text-base">Apply for Leave</h3>
              </div>
              <button onClick={() => setShowApplyModal(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="p-6 space-y-4">
              
              {/* Leave Type */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Leave Type</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as LeaveType)}
                  className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="CASUAL">Casual Leave</option>
                  <option value="SICK">Sick / Medical Leave</option>
                  <option value="EMERGENCY">Emergency Leave</option>
                  <option value="ANNUAL">Annual Planned Leave</option>
                  <option value="MATERNITY">Maternity Leave</option>
                  <option value="PATERNITY">Paternity Leave</option>
                  <option value="UNPAID">Unpaid Leave (Leave Without Pay)</option>
                </select>
              </div>

              {/* Date Pickers */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
              </div>

              {/* Dynamic Calculation Preview Box (Section 15 Automatic Paid vs Unpaid Calculation) */}
              {preview && (
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 text-xs space-y-2">
                  <div className="flex items-center space-x-1.5 text-emerald-800 font-bold">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Automatic Calculation Preview:</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center pt-1">
                    <div className="bg-white p-2 rounded-xl border border-emerald-100">
                      <span className="text-[10px] text-slate-400 block">Total Requested</span>
                      <span className="font-extrabold text-slate-800 text-sm">{preview.totalDays}</span>
                      <span className="text-[9px] text-slate-400 block">Day(s)</span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-emerald-100">
                      <span className="text-[10px] text-emerald-600 block">Paid Days</span>
                      <span className="font-extrabold text-emerald-700 text-sm">{preview.paidDays}</span>
                      <span className="text-[9px] text-emerald-600 block">Deducted</span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-emerald-100">
                      <span className="text-[10px] text-amber-600 block">Unpaid Days</span>
                      <span className="font-extrabold text-amber-700 text-sm">{preview.unpaidDays}</span>
                      <span className="text-[9px] text-amber-600 block">Without pay</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-emerald-800 font-medium pt-1">
                    {preview.message}
                  </p>
                </div>
              )}

              {/* Reason */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Reason for Leave <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Explain reason for absence..."
                  className="w-full text-xs rounded-xl border border-slate-300 p-3 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 disabled:opacity-60"
                >
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Review Modal for Supervisor and Principal */}
      {reviewModalLeave && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                {role === 'ROLE_PRINCIPAL' ? 'Principal Final Approval' : 'Supervisor Review & Recommendation'}
              </h3>
              <button onClick={() => setReviewModalLeave(null)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="p-6 space-y-4 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-1">
                <div>Staff: <strong className="text-slate-900">{reviewModalLeave.staffName}</strong> ({reviewModalLeave.employeeId})</div>
                <div>Dates: <strong>{reviewModalLeave.startDate} to {reviewModalLeave.endDate}</strong> ({reviewModalLeave.totalDays} Days)</div>
                <div>Calculation: <span className="text-emerald-700 font-bold">{reviewModalLeave.paidDays} Paid</span>, <span className="text-amber-700 font-bold">{reviewModalLeave.unpaidDays} Unpaid</span></div>
                <div className="italic text-slate-600 mt-1">"{reviewModalLeave.reason}"</div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Decision</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setReviewAction('APPROVE')}
                    className={`py-2 px-3 rounded-xl font-bold border transition-all ${
                      reviewAction === 'APPROVE'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    {role === 'ROLE_PRINCIPAL' ? 'Approve Leave' : 'Recommend Approval'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewAction('REJECT')}
                    className={`py-2 px-3 rounded-xl font-bold border transition-all ${
                      reviewAction === 'REJECT'
                        ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    Reject
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Remarks (Optional)</label>
                <textarea
                  rows={2}
                  value={reviewRemarks}
                  onChange={(e) => setReviewRemarks(e.target.value)}
                  placeholder="Enter remarks for staff member..."
                  className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {role === 'ROLE_PRINCIPAL' && reviewAction === 'APPROVE' && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-[11px] leading-relaxed">
                  Approving this leave will officially deduct <strong>{reviewModalLeave.paidDays} day(s)</strong> from the staff member's paid leave balance and set attendance to <strong>ON_LEAVE</strong>.
                </div>
              )}

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModalLeave(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reviewLoading}
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-black disabled:opacity-60 shadow-md"
                >
                  {reviewLoading ? 'Processing...' : 'Submit Decision'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
