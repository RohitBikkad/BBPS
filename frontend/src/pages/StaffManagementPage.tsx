import React, { useState, useEffect } from 'react';
import { User, Role, AccountStatus } from '../types';
import api from '../api/client';
import {
  Users, UserPlus, Search, Edit2, ShieldAlert, CheckCircle2,
  XCircle, Key, RefreshCw, ChevronRight, Lock, Sparkles
} from 'lucide-react';

export const StaffManagementPage: React.FC = () => {
  const [staffList, setStaffList] = useState<User[]>([]);
  const [supervisors, setSupervisors] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');

  // Modals
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingStaff, setEditingStaff] = useState<User | null>(null);
  const [resetPwStaff, setResetPwStaff] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState<string>('');

  // Form State
  const [employeeId, setEmployeeId] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [department, setDepartment] = useState<string>('Science');
  const [designation, setDesignation] = useState<string>('Teacher');
  const [role, setRole] = useState<Role>('ROLE_STAFF');
  const [supervisorEmployeeId, setSupervisorEmployeeId] = useState<string>('');
  const [paidLeaveBalance, setPaidLeaveBalance] = useState<number>(8);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const [staffRes, supRes] = await Promise.all([
        api.get<User[]>('/staff'),
        api.get<User[]>('/staff/supervisors'),
      ]);
      setStaffList(staffRes.data);
      setSupervisors(supRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const openAddModal = () => {
    setEditingStaff(null);
    setEmployeeId(`EMP00${staffList.length + 1}`);
    setFullName('');
    setEmail('');
    setPassword('School@123');
    setMobileNumber('+91 ');
    setDepartment('Science');
    setDesignation('Teacher');
    setRole('ROLE_STAFF');
    setSupervisorEmployeeId(supervisors.length > 0 ? supervisors[0].employeeId : '');
    setPaidLeaveBalance(8);
    setShowAddModal(true);
  };

  const openEditModal = (s: User) => {
    setEditingStaff(s);
    setEmployeeId(s.employeeId);
    setFullName(s.fullName);
    setEmail(s.email);
    setPassword('');
    setMobileNumber(s.mobileNumber || '');
    setDepartment(s.department || '');
    setDesignation(s.designation || '');
    setRole(s.role);
    setSupervisorEmployeeId(s.supervisorEmployeeId || '');
    setPaidLeaveBalance(s.paidLeaveBalance);
    setShowAddModal(true);
  };

  const handleSaveStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);
    try {
      const payload = {
        employeeId,
        fullName,
        email,
        password: password || undefined,
        mobileNumber,
        department,
        designation,
        role,
        supervisorEmployeeId: supervisorEmployeeId || undefined,
        paidLeaveBalance,
        status: 'ACTIVE' as AccountStatus,
      };

      if (editingStaff) {
        await api.put(`/staff/${editingStaff.employeeId}`, payload);
        setFeedback({ message: `Staff member ${fullName} updated successfully.`, type: 'success' });
      } else {
        await api.post('/staff', payload);
        setFeedback({ message: `Staff member ${fullName} registered with 8 paid leaves.`, type: 'success' });
      }

      setShowAddModal(false);
      fetchStaff();
    } catch (err: any) {
      setFeedback({ message: err.response?.data?.message || 'Failed to save staff record.', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (s: User) => {
    const newStatus: AccountStatus = s.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await api.patch(`/staff/${s.employeeId}/status?status=${newStatus}`);
      setFeedback({ message: `Account for ${s.fullName} set to ${newStatus}.`, type: 'success' });
      fetchStaff();
    } catch (err: any) {
      setFeedback({ message: err.response?.data?.message || 'Status toggle failed.', type: 'error' });
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetPwStaff) return;
    try {
      await api.post(`/staff/${resetPwStaff.employeeId}/reset-password`, { newPassword });
      setFeedback({ message: `Password for ${resetPwStaff.fullName} reset successfully.`, type: 'success' });
      setResetPwStaff(null);
      setNewPassword('');
    } catch (err: any) {
      setFeedback({ message: err.response?.data?.message || 'Password reset failed.', type: 'error' });
    }
  };

  const departments = ['ALL', ...Array.from(new Set(staffList.map(s => s.department).filter(Boolean)))];

  const filteredStaff = staffList.filter((s) => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'ALL' || s.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6 pb-24">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Administration</span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">Staff & Supervisor Management</h1>
          <p className="text-xs text-slate-500 mt-1">Configure staff accounts, supervisor allocations, and paid leave quotas</p>
        </div>

        <button
          onClick={openAddModal}
          className="self-start sm:self-center flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white text-xs font-bold shadow-md shadow-emerald-700/20 active:scale-95 transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Staff</span>
        </button>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div className={`p-4 rounded-2xl text-xs font-semibold flex items-center space-x-2 ${
          feedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Search & Filters */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, employee ID, or email..."
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
          />
        </div>

        {/* Dept Filter */}
        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="w-full sm:w-48 text-xs px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-hidden"
        >
          {departments.map((dept) => (
            <option key={dept} value={dept}>Dept: {dept}</option>
          ))}
        </select>

        <button
          onClick={fetchStaff}
          className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 self-end sm:self-center"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Staff Cards Grid (Mobile-First responsive cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full p-12 bg-white rounded-3xl text-center text-xs text-slate-400 border border-slate-200">
            Loading staff directory...
          </div>
        ) : filteredStaff.length === 0 ? (
          <div className="col-span-full p-12 bg-white rounded-3xl text-center text-xs text-slate-400 border border-slate-200">
            No staff records matched your query.
          </div>
        ) : (
          filteredStaff.map((s) => (
            <div
              key={s.employeeId}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all text-xs"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm">
                      {s.fullName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm leading-tight">{s.fullName}</h3>
                      <span className="text-[10px] text-slate-400">{s.employeeId} • {s.department}</span>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    s.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {s.status}
                  </span>
                </div>

                <div className="space-y-1.5 py-2 border-y border-slate-100 text-[11px] text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Designation:</span>
                    <span className="font-semibold text-slate-800">{s.designation || 'Teacher'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Email:</span>
                    <span className="font-medium text-slate-700">{s.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Role:</span>
                    <span className="font-bold text-slate-800">
                      {s.role === 'ROLE_PRINCIPAL' ? 'Principal' : s.role === 'ROLE_SUPERVISOR' ? 'Supervisor' : 'Staff'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Paid Leave Balance:</span>
                    <span className="font-extrabold text-emerald-600">{s.paidLeaveBalance} Days remaining</span>
                  </div>
                  {s.supervisorName && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Supervisor:</span>
                      <span className="font-semibold text-blue-700">{s.supervisorName}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-2 flex items-center justify-between gap-2">
                <button
                  onClick={() => openEditModal(s)}
                  className="flex-1 py-1.5 px-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-[11px] text-center"
                >
                  Edit
                </button>

                <button
                  onClick={() => setResetPwStaff(s)}
                  className="py-1.5 px-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-[11px]"
                  title="Reset Password"
                >
                  <Key className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleToggleStatus(s)}
                  className={`py-1.5 px-2.5 rounded-xl font-bold text-[11px] ${
                    s.status === 'ACTIVE'
                      ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {s.status === 'ACTIVE' ? 'Deactivate' : 'Reactivate'}
                </button>
              </div>

            </div>
          ))
        )}
      </div>

      {/* Add / Edit Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col">
            
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                {editingStaff ? 'Edit Staff Member' : 'Register New Staff Member'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStaff} className="p-6 overflow-y-auto space-y-3.5 text-xs">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Employee ID</label>
                  <input
                    type="text"
                    required
                    disabled={!!editingStaff}
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 disabled:bg-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as Role)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="ROLE_STAFF">Staff (Teacher)</option>
                    <option value="ROLE_SUPERVISOR">Supervisor (Dept Head)</option>
                    <option value="ROLE_PRINCIPAL">Principal / Admin</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Chandra"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="email@bbps.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Mobile Number</label>
                  <input
                    type="text"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="+91 98765 00000"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Department</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Science, Mathematics"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Designation</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Biology Teacher"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Assigned Supervisor</label>
                  <select
                    value={supervisorEmployeeId}
                    onChange={(e) => setSupervisorEmployeeId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="">None / Direct</option>
                    {supervisors.map((sup) => (
                      <option key={sup.employeeId} value={sup.employeeId}>
                        {sup.fullName} ({sup.employeeId})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Paid Leave Balance</label>
                  <input
                    type="number"
                    min={0}
                    max={20}
                    value={paidLeaveBalance}
                    onChange={(e) => setPaidLeaveBalance(parseInt(e.target.value) || 0)}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              {!editingStaff && (
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Initial Password</label>
                  <input
                    type="password"
                    placeholder="Defaults to School@123"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              )}

              <div className="flex space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-md shadow-emerald-600/20 disabled:opacity-60"
                >
                  {submitting ? 'Saving...' : 'Save Staff'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {resetPwStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm mb-1">Reset Staff Password</h3>
            <p className="text-xs text-slate-500 mb-4">Set a new password for {resetPwStaff.fullName} ({resetPwStaff.employeeId}).</p>

            <form onSubmit={handleResetPassword} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">New Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setResetPwStaff(null)}
                  className="flex-1 py-2 rounded-xl border border-slate-300 font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700"
                >
                  Confirm Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
