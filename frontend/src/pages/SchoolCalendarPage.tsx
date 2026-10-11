import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { SchoolHoliday } from '../types';
import api from '../api/client';
import {
  Calendar, Plus, Trash2, CheckCircle2, AlertCircle,
  Building2, Sparkles, Clock, ShieldCheck
} from 'lucide-react';

export const SchoolCalendarPage: React.FC = () => {
  const { role } = useAuth();
  const [holidays, setHolidays] = useState<SchoolHoliday[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Form State
  const [holidayDate, setHolidayDate] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [holidayType, setHolidayType] = useState<string>('HOLIDAY');
  const [description, setDescription] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchHolidays = async () => {
    setLoading(true);
    try {
      const res = await api.get<SchoolHoliday[]>('/calendar/holidays');
      setHolidays(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  const handleAddHoliday = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);
    try {
      await api.post('/calendar/holidays', {
        holidayDate,
        name,
        holidayType,
        description,
      });
      setFeedback({ message: `Holiday "${name}" added to school calendar.`, type: 'success' });
      setShowAddModal(false);
      setHolidayDate('');
      setName('');
      setDescription('');
      fetchHolidays();
    } catch (err: any) {
      setFeedback({ message: err.response?.data?.message || 'Failed to add holiday.', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteHoliday = async (id: number) => {
    if (!window.confirm('Delete this calendar holiday?')) return;
    try {
      await api.delete(`/calendar/holidays/${id}`);
      setFeedback({ message: 'Holiday deleted from calendar.', type: 'success' });
      fetchHolidays();
    } catch (err: any) {
      setFeedback({ message: 'Failed to delete holiday.', type: 'error' });
    }
  };

  return (
    <div className="space-y-6 pb-24">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Institutional Schedule</span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">School Calendar & Working Days</h1>
          <p className="text-xs text-slate-500 mt-1">Configure academic holidays, special working days, and leave year cycle</p>
        </div>

        {role === 'ROLE_PRINCIPAL' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="self-start sm:self-center flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-700/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Calendar Event</span>
          </button>
        )}
      </div>

      {/* Leave Year Configuration Card (Section 24) */}
      <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-slate-50 rounded-3xl p-5 sm:p-6 border border-emerald-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Active Academic Leave Cycle</span>
              <h2 className="text-lg font-extrabold text-slate-900">Leave Year: 2026–2027</h2>
              <p className="text-xs text-slate-600 mt-0.5">Cycle Window: <strong>1 April 2026 → 31 March 2027</strong></p>
            </div>
          </div>

          <div className="bg-white px-4 py-2.5 rounded-2xl border border-emerald-200/80 shadow-xs self-start sm:self-auto text-center">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Base Quota</span>
            <span className="text-lg font-extrabold text-emerald-700">8 Paid Days</span>
            <span className="text-[10px] text-slate-500 block">per staff / year</span>
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

      {/* Holidays List */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
        <h3 className="font-bold text-slate-900 text-sm mb-4">Official School Holidays & Schedule (2026)</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {loading ? (
            <div className="col-span-full p-8 text-center text-xs text-slate-400">Loading calendar events...</div>
          ) : holidays.length === 0 ? (
            <div className="col-span-full p-8 text-center text-xs text-slate-400">No calendar events configured.</div>
          ) : (
            holidays.map((h) => (
              <div
                key={h.id}
                className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/60 flex items-center justify-between text-xs hover:border-slate-300 transition-all"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex flex-col items-center justify-center font-bold text-slate-800 shrink-0">
                    <span className="text-[9px] uppercase text-emerald-600">
                      {new Date(h.holidayDate).toLocaleString('default', { month: 'short' })}
                    </span>
                    <span className="text-xs leading-none">
                      {new Date(h.holidayDate).getDate()}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 text-sm">{h.name}</span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                        h.holidayType === 'SPECIAL_WORKING_DAY'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {h.holidayType}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{h.description || 'School Closed'}</div>
                  </div>
                </div>

                {role === 'ROLE_PRINCIPAL' && h.id && (
                  <button
                    onClick={() => handleDeleteHoliday(h.id!)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Holiday Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-xs">
            <h3 className="font-bold text-slate-900 text-sm mb-1">Add School Calendar Event</h3>
            <p className="text-slate-500 text-[11px] mb-4">Define a school holiday or a special working day.</p>

            <form onSubmit={handleAddHoliday} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={holidayDate}
                  onChange={(e) => setHolidayDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Event / Holiday Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Annual Sports Day, Republic Day"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Type</label>
                <select
                  value={holidayType}
                  onChange={(e) => setHolidayType(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="HOLIDAY">Official Holiday (No attendance required)</option>
                  <option value="SPECIAL_WORKING_DAY">Special Working Day (Attendance mandatory)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. National holiday"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-md shadow-emerald-600/20"
                >
                  {submitting ? 'Saving...' : 'Add Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
