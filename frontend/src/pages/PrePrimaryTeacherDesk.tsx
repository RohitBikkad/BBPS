import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { Student, StudentDailyCareLog, DevelopmentalMilestone, StudentLeaveRequest } from '../types';
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
  AlertCircle,
  Award,
  Calendar,
  ShieldCheck,
  UserPlus,
  X,
  FileCheck,
  ChevronRight,
  Filter,
  Check,
  Sparkle
} from 'lucide-react';

export interface PrePrimaryTeacherDeskProps {
  initialTab?: 'roster' | 'milestones' | 'leaves' | 'broadcast' | 'students';
}

export const PrePrimaryTeacherDesk: React.FC<PrePrimaryTeacherDeskProps> = ({ initialTab = 'roster' }) => {
  const [activeTab, setActiveTab] = useState<'roster' | 'milestones' | 'leaves' | 'broadcast' | 'students'>(initialTab);
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

  // Award Milestone state
  const [showMilestoneModal, setShowMilestoneModal] = useState<boolean>(false);
  const [msStudentId, setMsStudentId] = useState<number>(1);
  const [msDomain, setMsDomain] = useState<'FINE_MOTOR' | 'GROSS_MOTOR' | 'LANGUAGE' | 'SOCIAL_EMOTIONAL' | 'COGNITIVE'>('FINE_MOTOR');
  const [msSkillTitle, setMsSkillTitle] = useState<string>('');
  const [msRating, setMsRating] = useState<'ACHIEVED' | 'DEVELOPING' | 'EMERGING'>('ACHIEVED');
  const [msBadgeTitle, setMsBadgeTitle] = useState<string>('Pincer Grip Pro');
  const [msNotes, setMsNotes] = useState<string>('');
  const [msLoading, setMsLoading] = useState<boolean>(false);

  // Student Leaves state
  const [leavesList, setLeavesList] = useState<StudentLeaveRequest[]>([]);
  const [leavesLoading, setLeavesLoading] = useState<boolean>(false);

  // Register Student Modal
  const [showAddStudentModal, setShowAddStudentModal] = useState<boolean>(false);
  const [newFirstName, setNewFirstName] = useState<string>('');
  const [newLastName, setNewLastName] = useState<string>('');
  const [newAdmissionNo, setNewAdmissionNo] = useState<string>('');
  const [newParentName, setNewParentName] = useState<string>('');
  const [newParentPhone, setNewParentPhone] = useState<string>('');
  const [newParentEmail, setNewParentEmail] = useState<string>('');
  const [newAllergies, setNewAllergies] = useState<string>('');
  const [addStudentLoading, setAddStudentLoading] = useState<boolean>(false);

  const fetchClassSheet = async () => {
    setLoading(true);
    try {
      const res = await api.get<{ students: Student[]; careLogs: Record<number, StudentDailyCareLog> }>(
        `/student-portal/teacher/class-sheet?grade=${grade}&section=${section}`
      );
      setStudents(res.data.students || []);
      setLogs(res.data.careLogs || {});
      if (res.data.students && res.data.students.length > 0) {
        setMsStudentId(res.data.students[0].id);
      }
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
          bloodGroup: 'B+',
          allergies: 'Peanut sensitive (mild)',
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
          bloodGroup: 'A+',
          allergies: 'None',
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
          bloodGroup: 'O+',
          allergies: 'Lactose sensitive',
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
          temperature: '98.4 °F',
          teacherNotes: 'Very joyful, shared crayons and water beads with friends.'
        },
        2: {
          attendanceStatus: 'PRESENT',
          checkInTime: '08:45 AM',
          mealStatus: 'PARTIALLY_EATEN',
          mood: 'PLAYFUL',
          napMinutes: 30,
          temperature: '98.2 °F',
          teacherNotes: 'Loved finger painting with yellow vegetable colors!'
        },
        3: {
          attendanceStatus: 'PRESENT',
          checkInTime: '08:50 AM',
          mealStatus: 'FINISHED_ALL',
          mood: 'CALM',
          napMinutes: 40,
          temperature: '98.6 °F',
          teacherNotes: 'Participated attentively in caterpillar felt puppet story.'
        }
      });
      setMsStudentId(1);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaves = async () => {
    setLeavesLoading(true);
    try {
      const res = await api.get<StudentLeaveRequest[]>('/student-portal/teacher/leaves');
      setLeavesList(res.data);
    } catch (e) {
      // Fallback leaves list
      setLeavesList([
        {
          id: 1,
          studentId: 1,
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date().toISOString().split('T')[0],
          totalDays: 1,
          reasonType: 'DOCTOR_VISIT',
          reasonDetails: 'Routine pediatrician booster vaccination checkup',
          status: 'PENDING',
          createdAt: new Date().toISOString()
        }
      ]);
    } finally {
      setLeavesLoading(false);
    }
  };

  useEffect(() => {
    fetchClassSheet();
  }, [grade, section]);

  useEffect(() => {
    if (activeTab === 'leaves') {
      fetchLeaves();
    }
  }, [activeTab]);

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
        temperature: studentLog.temperature || '98.4 °F',
        teacherNotes: studentLog.teacherNotes || 'Active and joyful during sensory learning.'
      });
      setStatusMessage(`Updated & Published to Parent Portal for student #${studentId}`);
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (e: any) {
      setStatusMessage('Saved locally for demo testing');
      setTimeout(() => setStatusMessage(null), 3000);
    } finally {
      setSavingId(null);
    }
  };

  const handleMarkAllPresent = async () => {
    try {
      await api.post('/student-portal/teacher/bulk-attendance', {
        grade,
        section,
        status: 'PRESENT',
        checkInTime: '08:40 AM'
      });
      // update local state
      const updatedLogs = { ...logs };
      students.forEach(s => {
        updatedLogs[s.id] = {
          ...updatedLogs[s.id],
          attendanceStatus: 'PRESENT',
          checkInTime: '08:40 AM'
        };
      });
      setLogs(updatedLogs);
      setStatusMessage('Marked all students in class as PRESENT (08:40 AM)');
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (e) {
      const updatedLogs = { ...logs };
      students.forEach(s => {
        updatedLogs[s.id] = {
          ...updatedLogs[s.id],
          attendanceStatus: 'PRESENT',
          checkInTime: '08:40 AM'
        };
      });
      setLogs(updatedLogs);
      setStatusMessage('Marked all students PRESENT (Demo mode)');
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  const handleMarkAllMealsFinished = () => {
    const updatedLogs = { ...logs };
    students.forEach(s => {
      updatedLogs[s.id] = {
        ...updatedLogs[s.id],
        mealStatus: 'FINISHED_ALL',
        mealNotes: 'Finished full lunch and drank water.'
      };
    });
    setLogs(updatedLogs);
    setStatusMessage('1-Click: Marked all students Finished Full Lunch');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleAwardMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsLoading(true);
    try {
      await api.post('/student-portal/teacher/milestones', {
        studentId: msStudentId,
        term: 'Term 1 (2026-2027)',
        domain: msDomain,
        skillTitle: msSkillTitle,
        rating: msRating,
        badgeTitle: msBadgeTitle,
        teacherNotes: msNotes,
        evaluatedDate: new Date().toISOString().split('T')[0]
      });
      alert(`🌟 Growth Badge "${msBadgeTitle}" awarded to student! Parent can now view it.`);
      setShowMilestoneModal(false);
      setMsSkillTitle('');
      setMsNotes('');
    } catch (e) {
      alert(`🌟 Badge "${msBadgeTitle}" awarded in demo mode!`);
      setShowMilestoneModal(false);
    } finally {
      setMsLoading(false);
    }
  };

  const handleApproveLeave = async (leaveId: number) => {
    try {
      await api.patch(`/student-portal/teacher/leaves/${leaveId}/status`, {
        status: 'APPROVED',
        remarks: 'Acknowledged and approved by Mother Teacher. Get well soon!'
      });
      setLeavesList(prev => prev.map(l => l.id === leaveId ? { ...l, status: 'APPROVED', teacherRemarks: 'Approved by Mother Teacher' } : l));
      setStatusMessage('Student leave request approved.');
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (e) {
      setLeavesList(prev => prev.map(l => l.id === leaveId ? { ...l, status: 'APPROVED', teacherRemarks: 'Approved by Mother Teacher' } : l));
      setStatusMessage('Student leave approved (Demo mode).');
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddStudentLoading(true);
    try {
      const res = await api.post<Student>('/student-portal/teacher/students', {
        firstName: newFirstName.trim(),
        lastName: newLastName.trim(),
        admissionNumber: newAdmissionNo.trim() || undefined,
        grade,
        section,
        parentName: newParentName.trim(),
        parentPhone: newParentPhone.trim(),
        parentEmail: newParentEmail.trim(),
        allergies: newAllergies.trim() || 'None',
        motherTeacherName: 'Neha Kapoor'
      });
      alert(`Student ${res.data.firstName} registered successfully!`);
      setShowAddStudentModal(false);
      setNewFirstName('');
      setNewLastName('');
      setNewAdmissionNo('');
      fetchClassSheet();
    } catch (e) {
      const newMock: Student = {
        id: Date.now(),
        firstName: newFirstName.trim(),
        lastName: newLastName.trim(),
        admissionNumber: newAdmissionNo.trim() || `BBPS-2026-N${students.length + 10}`,
        grade,
        section,
        parentName: newParentName.trim(),
        parentPhone: newParentPhone.trim(),
        allergies: newAllergies.trim() || 'None',
        motherTeacherName: 'Neha Kapoor'
      };
      setStudents(prev => [...prev, newMock]);
      alert(`Student ${newFirstName} added to class!`);
      setShowAddStudentModal(false);
    } finally {
      setAddStudentLoading(false);
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
    <div className="space-y-6 pb-24">

      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-purple-800 via-indigo-700 to-purple-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-purple-950/20 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[11px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                Classroom Care & Student Portal Desk
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
              Teacher Student Care Portal 🧸
            </h1>
            <p className="text-xs text-purple-200 mt-1">
              Full control for preschool teachers: Log daily meals, mood, attendance, award growth badges & post parent updates
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowAddStudentModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-white text-purple-950 text-xs font-black hover:bg-purple-50 shadow-md active:scale-95 transition-all flex items-center space-x-1.5"
            >
              <UserPlus className="w-3.5 h-3.5 text-purple-700" />
              <span>+ Register Student</span>
            </button>
            <button
              onClick={() => setShowMilestoneModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-amber-400 text-amber-950 text-xs font-black hover:bg-amber-300 shadow-md active:scale-95 transition-all flex items-center space-x-1.5"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Award Badge 🌟</span>
            </button>
          </div>
        </div>

        {/* Section / Grade Selector Pills */}
        <div className="mt-6 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-purple-200 font-semibold">Active Class:</span>
            {['Nursery', 'Playgroup', 'KG'].map((g) => (
              <button
                key={g}
                onClick={() => {
                  setGrade(g);
                  if (g === 'Nursery') setSection('Butterflies');
                  if (g === 'Playgroup') setSection('Little Explorers');
                  if (g === 'KG') setSection('Dolphins');
                }}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  grade === g 
                    ? 'bg-white text-purple-950 shadow-xs' 
                    : 'bg-white/15 text-white hover:bg-white/25'
                }`}
              >
                {g}
              </button>
            ))}
            <span className="text-amber-300 font-bold ml-1">({section})</span>
          </div>

          <div className="text-[11px] text-purple-200">
            Total Enrolled: <strong className="text-white">{students.length} students</strong>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Action Tabs for Teachers */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'roster', label: '1. Daily Routine & Care Sheet', icon: Utensils },
          { id: 'milestones', label: '2. Award Milestones & Badges', icon: Award },
          { id: 'leaves', label: '3. Student Leave Requests', icon: Calendar },
          { id: 'broadcast', label: '4. Post Moments & Reminders', icon: Camera },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center space-x-2 ${
                isActive 
                  ? 'bg-purple-900 text-white shadow-md shadow-purple-900/20' 
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: DAILY ROUTINE & CARE SHEET */}
      {activeTab === 'roster' && (
        <div className="space-y-4">
          
          {/* Fast Bulk Action Toolbar */}
          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="font-bold text-slate-700">⚡ Teacher Quick 1-Tap Fill:</span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleMarkAllPresent}
                className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold hover:bg-emerald-100 flex items-center space-x-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Mark All Present (08:40 AM)</span>
              </button>
              <button
                type="button"
                onClick={handleMarkAllMealsFinished}
                className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 font-bold hover:bg-rose-100 flex items-center space-x-1"
              >
                <Utensils className="w-3.5 h-3.5" />
                <span>Mark All Finished Lunch</span>
              </button>
            </div>
          </div>

          {/* Student Cards */}
          <div className="space-y-4">
            {students.map((st) => {
              const log = logs[st.id] || {};
              const isSaving = savingId === st.id;

              return (
                <div key={st.id} className="bg-white rounded-3xl border border-slate-100 p-5 sm:p-6 shadow-sm space-y-4 transition-all">
                  
                  {/* Top line: Student Name, Roll, Attendance Selector */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
                    <div className="flex items-center space-x-3">
                      <div className="w-11 h-11 rounded-2xl bg-purple-100 text-purple-800 font-black flex items-center justify-center text-sm border border-purple-200">
                        {st.rollNumber || '01'}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-extrabold text-slate-900 text-base">{st.firstName} {st.lastName}</h3>
                          <span className="text-[10px] font-bold px-2 py-0.2 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                            {st.grade} • {st.section}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          ID: {st.admissionNumber} {st.allergies && st.allergies !== 'None' ? `• ⚠️ ${st.allergies}` : ''}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2.5">
                      <span className="text-xs font-bold text-slate-500">Attendance:</span>
                      <select
                        value={log.attendanceStatus || 'PRESENT'}
                        onChange={(e) => handleUpdateField(st.id, 'attendanceStatus', e.target.value)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border ${
                          log.attendanceStatus === 'PRESENT' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                          log.attendanceStatus === 'ABSENT' ? 'bg-rose-50 text-rose-800 border-rose-300' : 'bg-amber-50 text-amber-800 border-amber-300'
                        }`}
                      >
                        <option value="PRESENT">✓ Present</option>
                        <option value="ABSENT">✕ Absent</option>
                        <option value="ON_LEAVE">📅 On Leave</option>
                      </select>
                    </div>
                  </div>

                  {/* Routine Inputs: Meal, Mood, Nap, Health Temp */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                    
                    {/* Tiffin / Lunch */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                      <label className="font-bold text-slate-700 flex items-center space-x-1 text-[11px]">
                        <Utensils className="w-3.5 h-3.5 text-rose-500" />
                        <span>Lunch & Tiffin Status</span>
                      </label>
                      <select
                        value={log.mealStatus || 'FINISHED_ALL'}
                        onChange={(e) => handleUpdateField(st.id, 'mealStatus', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold"
                      >
                        <option value="FINISHED_ALL">🍱 Finished Full Lunch</option>
                        <option value="PARTIALLY_EATEN">🥪 Ate Partially</option>
                        <option value="REFUSED">❌ Ate Very Little</option>
                      </select>
                      <input
                        type="text"
                        placeholder="e.g. Ate all moong khichdi & apple"
                        value={log.mealNotes || ''}
                        onChange={(e) => handleUpdateField(st.id, 'mealNotes', e.target.value)}
                        className="w-full px-2 py-1 rounded-lg border border-slate-200 text-[11px] bg-white"
                      />
                    </div>

                    {/* Mood of the day */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                      <label className="font-bold text-slate-700 flex items-center space-x-1 text-[11px]">
                        <Smile className="w-3.5 h-3.5 text-amber-500" />
                        <span>Today's Child Mood</span>
                      </label>
                      <select
                        value={log.mood || 'HAPPY'}
                        onChange={(e) => handleUpdateField(st.id, 'mood', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold"
                      >
                        <option value="HAPPY">🌟 Joyful & Smiling</option>
                        <option value="PLAYFUL">🎨 Playful & Creative</option>
                        <option value="CALM">🧘 Calm & Focused</option>
                        <option value="TEARFUL">🧸 Needed Cuddles</option>
                        <option value="TIRED">😴 Sleepy / Low Energy</option>
                      </select>
                      <span className="text-[10px] text-slate-400 block">Visible live to parent</span>
                    </div>

                    {/* Nap Time */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                      <label className="font-bold text-slate-700 flex items-center space-x-1 text-[11px]">
                        <Moon className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Quiet / Nap Time</span>
                      </label>
                      <select
                        value={log.napMinutes || 40}
                        onChange={(e) => handleUpdateField(st.id, 'napMinutes', Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold"
                      >
                        <option value={45}>45 Minutes (Full Rest)</option>
                        <option value={30}>30 Minutes</option>
                        <option value={15}>15 Minutes</option>
                        <option value={0}>Did not sleep</option>
                      </select>
                      <span className="text-[10px] text-slate-400 block">Daycare quiet hour</span>
                    </div>

                    {/* Health & Check-In */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                      <label className="font-bold text-slate-700 flex items-center space-x-1 text-[11px]">
                        <Clock className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Check-In & Temp</span>
                      </label>
                      <div className="flex space-x-1.5">
                        <input
                          type="text"
                          placeholder="08:40 AM"
                          value={log.checkInTime || '08:40 AM'}
                          onChange={(e) => handleUpdateField(st.id, 'checkInTime', e.target.value)}
                          className="w-1/2 px-2 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-center"
                        />
                        <input
                          type="text"
                          placeholder="98.4 °F"
                          value={log.temperature || '98.4 °F'}
                          onChange={(e) => handleUpdateField(st.id, 'temperature', e.target.value)}
                          className="w-1/2 px-2 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-center"
                        />
                      </div>
                      <span className="text-[10px] text-emerald-600 font-semibold block">✓ Gate verified</span>
                    </div>

                  </div>

                  {/* Personal Teacher Observation Note */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Mother Teacher's Personal Observation Note for Parents:
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        placeholder="e.g. Loved the sensory paint activity, sang rhymes with actions, and helped pack up blocks!"
                        value={log.teacherNotes || ''}
                        onChange={(e) => handleUpdateField(st.id, 'teacherNotes', e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
                      />
                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => handleSaveStudentLog(st.id)}
                        className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-extrabold flex items-center justify-center space-x-1.5 shadow-md active:scale-95 transition-all shrink-0"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{isSaving ? 'Saving...' : 'Save & Push to Parent'}</span>
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* TAB 2: AWARD MILESTONES & BADGES */}
      {activeTab === 'milestones' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Award Developmental Milestones & Growth Badges 🌟
              </h2>
              <p className="text-xs text-slate-500">
                Observational assessment across 5 NEP core developmental areas. Badges appear instantly on the parent portal!
              </p>
            </div>
            <button
              onClick={() => setShowMilestoneModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-amber-400 text-amber-950 text-xs font-extrabold hover:bg-amber-300 shadow-xs flex items-center space-x-1.5"
            >
              <Award className="w-4 h-4" />
              <span>+ Award New Badge</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-2">
              <span className="text-[10px] font-black uppercase text-purple-700">1. Fine Motor</span>
              <h4 className="font-bold text-slate-900 text-xs">Pincer Grip & Art</h4>
              <p className="text-[11px] text-slate-600">Holding crayons with tripod grip, turning book pages, clay pinching.</p>
              <span className="text-[10px] font-bold text-purple-600 bg-white px-2 py-0.5 rounded-md inline-block">Badge: Pincer Grip Pro</span>
            </div>

            <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-2">
              <span className="text-[10px] font-black uppercase text-sky-700">2. Language & Rhymes</span>
              <h4 className="font-bold text-slate-900 text-xs">Singing & Vocabulary</h4>
              <p className="text-[11px] text-slate-600">Reciting 4+ rhymes with body actions, speaking clearly, answering questions.</p>
              <span className="text-[10px] font-bold text-sky-600 bg-white px-2 py-0.5 rounded-md inline-block">Badge: Rhyme Master</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
              <span className="text-[10px] font-black uppercase text-emerald-700">3. Social & Emotional</span>
              <h4 className="font-bold text-slate-900 text-xs">Sharing & Empathy</h4>
              <p className="text-[11px] text-slate-600">Sharing play tools without tears, waiting for turn, comforting friends.</p>
              <span className="text-[10px] font-bold text-emerald-600 bg-white px-2 py-0.5 rounded-md inline-block">Badge: Star Sharer</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: STUDENT LEAVE REQUESTS */}
      {activeTab === 'leaves' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                Student Absence / Sick Notes from Parents
              </h3>
              <p className="text-xs text-slate-500">Review parent leave notifications and acknowledge them</p>
            </div>
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              {leavesList.length} Requests
            </span>
          </div>

          {leavesList.length === 0 ? (
            <p className="text-xs text-slate-400 p-6 text-center">No student leave applications pending.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {leavesList.map(leave => (
                <div key={leave.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-slate-900">
                        {students.find(s => s.id === leave.studentId)?.firstName || 'Student'} {students.find(s => s.id === leave.studentId)?.lastName || ''}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800">
                        {leave.reasonType}
                      </span>
                      <span className="text-slate-400 text-[11px]">
                        ({leave.startDate} to {leave.endDate} • {leave.totalDays} day)
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px] mt-1">{leave.reasonDetails || 'Sick leave note from parent'}</p>
                    {leave.teacherRemarks && (
                      <p className="text-[10px] text-emerald-700 mt-1">✓ Teacher Note: {leave.teacherRemarks}</p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {leave.status === 'APPROVED' ? (
                      <span className="px-3 py-1 rounded-xl text-xs font-extrabold bg-emerald-100 text-emerald-800">
                        ✓ Approved
                      </span>
                    ) : (
                      <button
                        onClick={() => handleApproveLeave(leave.id)}
                        className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-extrabold shadow-sm active:scale-95 transition-all"
                      >
                        Approve & Acknowledge
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: POST MOMENTS & REMINDERS */}
      {activeTab === 'broadcast' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: Broadcast Classroom Moment */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center space-x-2">
              <Camera className="w-5 h-5 text-purple-600" />
              <h3 className="font-extrabold text-slate-900 text-sm">Post Classroom Photo & Moments</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Share sensory play photos, storytelling videos, and weekly songs directly to parents' feed.
            </p>
            <button
              onClick={() => setShowMomentForm(true)}
              className="w-full py-3 rounded-2xl bg-purple-700 text-white text-xs font-black shadow-md hover:bg-purple-800 transition-all flex items-center justify-center space-x-1.5"
            >
              <Camera className="w-4 h-4" />
              <span>Open Photo Upload & Story Form</span>
            </button>
          </div>

          {/* Card 2: Pack for Tomorrow Reminder */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center space-x-2">
              <Sun className="w-5 h-5 text-amber-500" />
              <h3 className="font-extrabold text-slate-900 text-sm">Push "Pack for Tomorrow" Alert</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Remind parents about dress codes (Yellow Day, Blue Day) and special activity supplies to pack in school bags.
            </p>
            <button
              onClick={() => setShowReminderForm(true)}
              className="w-full py-3 rounded-2xl bg-amber-400 text-amber-950 text-xs font-black shadow-md hover:bg-amber-300 transition-all flex items-center justify-center space-x-1.5"
            >
              <Sun className="w-4 h-4" />
              <span>Create Pack Alert for Parents</span>
            </button>
          </div>

        </div>
      )}

      {/* MODAL 1: AWARD MILESTONE BADGE */}
      {showMilestoneModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-extrabold text-slate-900">Award Milestone & Growth Badge 🌟</h3>
              </div>
              <button onClick={() => setShowMilestoneModal(false)} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAwardMilestone} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Select Student</label>
                <select
                  value={msStudentId}
                  onChange={(e) => setMsStudentId(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-semibold"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.firstName} {s.lastName} (Roll #{s.rollNumber})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Development Domain</label>
                  <select
                    value={msDomain}
                    onChange={(e) => setMsDomain(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  >
                    <option value="FINE_MOTOR">Fine Motor Skills</option>
                    <option value="LANGUAGE">Language & Speech</option>
                    <option value="SOCIAL_EMOTIONAL">Social & Emotional</option>
                    <option value="GROSS_MOTOR">Gross Motor Skills</option>
                    <option value="COGNITIVE">Cognitive & Shapes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Observation Rating</label>
                  <select
                    value={msRating}
                    onChange={(e) => setMsRating(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-bold"
                  >
                    <option value="ACHIEVED">★ Achieved</option>
                    <option value="DEVELOPING">● Developing</option>
                    <option value="EMERGING">○ Emerging</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Badge Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pincer Grip Pro / Rhyme Master / Star Sharer"
                  value={msBadgeTitle}
                  onChange={(e) => setMsBadgeTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Specific Skill Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Holds crayons with steady 3-finger tripod grip"
                  value={msSkillTitle}
                  onChange={(e) => setMsSkillTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Teacher's Observation Remarks</label>
                <textarea
                  rows={2}
                  placeholder="What positive change or accomplishment did the child demonstrate?"
                  value={msNotes}
                  onChange={(e) => setMsNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowMilestoneModal(false)}
                  className="flex-1 py-2 text-xs font-semibold rounded-xl border border-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={msLoading}
                  className="flex-1 py-2 text-xs font-bold rounded-xl bg-amber-400 text-amber-950 hover:bg-amber-300 shadow-md"
                >
                  {msLoading ? 'Saving...' : 'Award Badge'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: REGISTER NEW STUDENT */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-extrabold text-slate-900">Register Pre-Primary Student</h3>
              </div>
              <button onClick={() => setShowAddStudentModal(false)} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aarav"
                    value={newFirstName}
                    onChange={(e) => setNewFirstName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sharma"
                    value={newLastName}
                    onChange={(e) => setNewLastName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Grade</label>
                  <input
                    type="text"
                    disabled
                    value={grade}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Section</label>
                  <input
                    type="text"
                    disabled
                    value={section}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Admission Number (Optional)</label>
                <input
                  type="text"
                  placeholder="Auto-generated if empty"
                  value={newAdmissionNo}
                  onChange={(e) => setNewAdmissionNo(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Parent Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikram Sharma"
                    value={newParentName}
                    onChange={(e) => setNewParentName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Parent Phone</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98..."
                    value={newParentPhone}
                    onChange={(e) => setNewParentPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Critical Allergy Notice (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Peanut allergy / Lactose sensitive"
                  value={newAllergies}
                  onChange={(e) => setNewAllergies(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="flex-1 py-2 text-xs font-semibold rounded-xl border border-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addStudentLoading}
                  className="flex-1 py-2 text-xs font-bold rounded-xl bg-purple-700 text-white hover:bg-purple-800"
                >
                  {addStudentLoading ? 'Saving...' : 'Enroll Toddler'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: POST CLASS MOMENT */}
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

      {/* MODAL 4: POST TOMORROW'S REMINDER */}
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
