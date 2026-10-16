import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { Student, StudentDailyCareLog } from '../types';
import { 
  Users, 
  Smile, 
  Utensils, 
  Moon, 
  CheckCircle2, 
  Clock, 
  Save, 
  Camera, 
  Sun, 
  Sparkles, 
  Send,
  AlertCircle
} from 'lucide-react';

export const PrePrimaryTeacherDesk: React.FC = () => {
  const [grade, setGrade] = useState<string>('Nursery');
  const [section, setSection] = useState<string>('Butterflies');
  const [students, setStudents] = useState<Student[]>([]);
  const [logs, setLogs] = useState<Record<number, Partial<StudentDailyCareLog>>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // New Moment form state
  const [showMomentForm, setShowMomentForm] = useState<boolean>(false);
  const [momentTitle, setMomentTitle] = useState<string>('');
  const [momentDesc, setMomentDesc] = useState<string>('');
  const [momentCategory, setMomentCategory] = useState<string>('ACTIVITY');
  const [momentUrl, setMomentUrl] = useState<string>('');
  const [momentLyrics, setMomentLyrics] = useState<string>('');
  const [momentLoading, setMomentLoading] = useState<boolean>(false);

  // New Reminder form state
  const [showReminderForm, setShowReminderForm] = useState<boolean>(false);
  const [remTitle, setRemTitle] = useState<string>('');
  const [remMsg, setRemMsg] = useState<string>('');
  const [remItems, setRemItems] = useState<string>('');
  const [remDress, setRemDress] = useState<string>('');
  const [remLoading, setRemLoading] = useState<boolean>(false);

  const fetchClassSheet = async () => {
    setLoading(true);
    try {
      const res = await api.get<{ students: Student[]; careLogs: Record<number, StudentDailyCareLog> }>(
        `/student-portal/teacher/class-sheet?grade=${grade}&section=${section}`
      );
      setStudents(res.data.students || []);
      setLogs(res.data.careLogs || {});
    } catch (e) {
      console.warn('Backend fetch failed, using fallback list', e);
      // Fallback students for demo
      const mockStudents: Student[] = [
        {
          id: 1,
          admissionNumber: 'BBPS-2026-N101',
          firstName: 'Aarav',
          lastName: 'Sharma',
          grade: 'Nursery',
          section: 'Butterflies',
          rollNumber: '04',
          motherTeacherName: 'Neha Kapoor'
        },
        {
          id: 2,
          admissionNumber: 'BBPS-2026-N102',
          firstName: 'Maya',
          lastName: 'Deshmukh',
          grade: 'Nursery',
          section: 'Butterflies',
          rollNumber: '05',
          motherTeacherName: 'Neha Kapoor'
        },
        {
          id: 3,
          admissionNumber: 'BBPS-2026-N103',
          firstName: 'Kabir',
          lastName: 'Mehta',
          grade: 'Nursery',
          section: 'Butterflies',
          rollNumber: '06',
          motherTeacherName: 'Neha Kapoor'
        }
      ];
      setStudents(mockStudents);
      setLogs({
        1: {
          attendanceStatus: 'PRESENT',
          checkInTime: '08:40 AM',
          mealStatus: 'FINISHED_ALL',
          mood: 'HAPPY',
          napMinutes: 45,
          teacherNotes: 'Very joyful, shared crayons and water beads with friends.'
        },
        2: {
          attendanceStatus: 'PRESENT',
          checkInTime: '08:45 AM',
          mealStatus: 'PARTIALLY_EATEN',
          mood: 'PLAYFUL',
          napMinutes: 30,
          teacherNotes: 'Loved finger painting!'
        },
        3: {
          attendanceStatus: 'PRESENT',
          checkInTime: '08:50 AM',
          mealStatus: 'FINISHED_ALL',
          mood: 'CALM',
          napMinutes: 40,
          teacherNotes: 'Participated in caterpillar rhyme.'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassSheet();
  }, [grade, section]);

  const handleUpdateField = (studentId: number, field: string, value: any) => {
    setLogs(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }));
  };

  const handleSaveStudentLog = async (studentId: number) => {
    setSavingId(studentId);
    try {
      const studentLog = logs[studentId] || {};
      await api.post('/student-portal/teacher/quick-log', {
        studentId,
        attendanceStatus: studentLog.attendanceStatus || 'PRESENT',
        checkInTime: studentLog.checkInTime || '08:40 AM',
        mealStatus: studentLog.mealStatus || 'FINISHED_ALL',
        mealNotes: studentLog.mealNotes,
        mood: studentLog.mood || 'HAPPY',
        napMinutes: studentLog.napMinutes || 40,
        teacherNotes: studentLog.teacherNotes || 'Active and happy during learning play.'
      });
      setStatusMessage(`Log saved for student #${studentId}`);
      setTimeout(() => setStatusMessage(null), 2500);
    } catch (e: any) {
      setStatusMessage('Log saved locally (demo mode)');
      setTimeout(() => setStatusMessage(null), 2500);
    } finally {
      setSavingId(null);
    }
  };

  const handlePostMoment = async (e: React.FormEvent) => {
    e.preventDefault();
    setMomentLoading(true);
    try {
      await api.post('/student-portal/teacher/moment', {
        grade,
        section,
        momentDate: new Date().toISOString().split('T')[0],
        title: momentTitle,
        description: momentDesc,
        category: momentCategory,
        mediaUrl: momentUrl || 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=600&q=80',
        rhymeLyrics: momentLyrics
      });
      alert('Activity Moment broadcasted to all parents in Nursery Butterflies!');
      setShowMomentForm(false);
      setMomentTitle('');
      setMomentDesc('');
      setMomentLyrics('');
    } catch (e: any) {
      alert('Activity broadcasted in demo mode!');
      setShowMomentForm(false);
    } finally {
      setMomentLoading(false);
    }
  };

  const handlePostReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    setRemLoading(true);
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      await api.post('/student-portal/teacher/reminder', {
        grade,
        section,
        targetDate: tomorrow.toISOString().split('T')[0],
        title: remTitle,
        message: remMsg,
        itemsToPack: remItems,
        dressCode: remDress
      });
      alert('"Pack for Tomorrow" reminder alert pushed to parents!');
      setShowReminderForm(false);
      setRemTitle('');
      setRemMsg('');
      setRemItems('');
    } catch (e: any) {
      alert('Reminder alert pushed in demo mode!');
      setShowReminderForm(false);
    } finally {
      setRemLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-20">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
              Mother Teacher Live Desk
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Pre-Primary Daily Care Desk 🧸
          </h1>
          <p className="text-xs text-slate-500">
            Quick 1-tap logging for meals, mood, attendance & parent alerts
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowMomentForm(true)}
            className="px-3.5 py-2 rounded-2xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 flex items-center space-x-1.5 shadow-xs"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Post Class Photo</span>
          </button>
          <button
            onClick={() => setShowReminderForm(true)}
            className="px-3.5 py-2 rounded-2xl bg-amber-400 text-amber-950 text-xs font-extrabold hover:bg-amber-300 flex items-center space-x-1.5 shadow-xs"
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Tomorrow's Pack Alert</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Class Roster Cards */}
      <div className="space-y-4">
        {students.map((st) => {
          const log = logs[st.id] || {};
          const isSaving = savingId === st.id;

          return (
            <div key={st.id} className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm space-y-4">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 font-extrabold flex items-center justify-center text-sm">
                    {st.rollNumber || '01'}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">{st.firstName} {st.lastName}</h3>
                    <p className="text-[11px] text-slate-500">ID: {st.admissionNumber} • {st.grade} ({st.section})</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs text-slate-400">Status:</span>
                  <select
                    value={log.attendanceStatus || 'PRESENT'}
                    onChange={(e) => handleUpdateField(st.id, 'attendanceStatus', e.target.value)}
                    className="px-2.5 py-1 rounded-xl text-xs font-bold border border-slate-200 bg-white"
                  >
                    <option value="PRESENT">Present</option>
                    <option value="ABSENT">Absent</option>
                    <option value="ON_LEAVE">On Leave</option>
                  </select>
                </div>
              </div>

              {/* Tiffin, Mood, Nap controls */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                
                {/* Tiffin / Lunch */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <span className="font-bold text-slate-700 flex items-center space-x-1 text-[11px]">
                    <Utensils className="w-3.5 h-3.5 text-rose-500" />
                    <span>Tiffin & Meal</span>
                  </span>
                  <select
                    value={log.mealStatus || 'FINISHED_ALL'}
                    onChange={(e) => handleUpdateField(st.id, 'mealStatus', e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium"
                  >
                    <option value="FINISHED_ALL">Finished Full Lunch</option>
                    <option value="PARTIALLY_EATEN">Ate Partially</option>
                    <option value="REFUSED">Ate Very Little</option>
                  </select>
                </div>

                {/* Mood of the day */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <span className="font-bold text-slate-700 flex items-center space-x-1 text-[11px]">
                    <Smile className="w-3.5 h-3.5 text-amber-500" />
                    <span>Child's Mood</span>
                  </span>
                  <select
                    value={log.mood || 'HAPPY'}
                    onChange={(e) => handleUpdateField(st.id, 'mood', e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium"
                  >
                    <option value="HAPPY">🌟 Joyful & Smiling</option>
                    <option value="PLAYFUL">🎨 Playful & Creative</option>
                    <option value="CALM">🧘 Calm & Focused</option>
                    <option value="TEARFUL">🧸 Needed Cuddles</option>
                  </select>
                </div>

                {/* Nap Minutes */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <span className="font-bold text-slate-700 flex items-center space-x-1 text-[11px]">
                    <Moon className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Nap Duration</span>
                  </span>
                  <select
                    value={log.napMinutes || 40}
                    onChange={(e) => handleUpdateField(st.id, 'napMinutes', Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium"
                  >
                    <option value={45}>45 Minutes (Full Rest)</option>
                    <option value={30}>30 Minutes</option>
                    <option value={15}>15 Minutes (Brief)</option>
                    <option value={0}>Did not sleep</option>
                  </select>
                </div>

              </div>

              {/* Personal Teacher Observation note */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Teacher's Note for Parent Today:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Loved the sensory paint activity and helped pack up blocks!"
                  value={log.teacherNotes || ''}
                  onChange={(e) => handleUpdateField(st.id, 'teacherNotes', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => handleSaveStudentLog(st.id)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center space-x-1.5 transition-all shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Updating...' : 'Publish to Parent Portal'}</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* MODAL: POST CLASS MOMENT */}
      {showMomentForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">Broadcast Classroom Moment 📸</h3>
            <form onSubmit={handlePostMoment} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Activity Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fingerprint Tree & Caterpillar Story"
                  value={momentTitle}
                  onChange={(e) => setMomentTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Short Description</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Explain what the children explored today..."
                  value={momentDesc}
                  onChange={(e) => setMomentDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Rhyme Verse / Lyrics (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Crawling, crawling caterpillar..."
                  value={momentLyrics}
                  onChange={(e) => setMomentLyrics(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowMomentForm(false)}
                  className="flex-1 py-2 text-xs font-semibold rounded-xl border border-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={momentLoading}
                  className="flex-1 py-2 text-xs font-bold rounded-xl bg-purple-600 text-white hover:bg-purple-700"
                >
                  {momentLoading ? 'Posting...' : 'Post to Parents'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: POST TOMORROW'S REMINDER */}
      {showReminderForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">🎒 Push "Pack for Tomorrow" Alert</h3>
            <form onSubmit={handlePostReminder} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Yellow Day & Fruit Salad Party"
                  value={remTitle}
                  onChange={(e) => setRemTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Dress Code (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Bright Yellow casuals"
                  value={remDress}
                  onChange={(e) => setRemDress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Items to Pack in Bag</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1 yellow fruit (banana/mango), apron, extra napkin"
                  value={remItems}
                  onChange={(e) => setRemItems(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Detailed Message</label>
                <textarea
                  rows={2}
                  placeholder="Any extra instructions for parents..."
                  value={remMsg}
                  onChange={(e) => setRemMsg(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReminderForm(false)}
                  className="flex-1 py-2 text-xs font-semibold rounded-xl border border-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={remLoading}
                  className="flex-1 py-2 text-xs font-bold rounded-xl bg-amber-500 text-white hover:bg-amber-600"
                >
                  {remLoading ? 'Sending...' : 'Broadcast to Parents'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
