export type Role = 'ROLE_PRINCIPAL' | 'ROLE_SUPERVISOR' | 'ROLE_STAFF' | 'ROLE_PARENT';
export type AccountStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
export type MarkedStatus = 'PRESENT' | 'ABSENT';
export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type FinalAttendanceStatus = 'NOT_MARKED' | 'PENDING' | 'PRESENT' | 'ABSENT' | 'ON_LEAVE';
export type LeaveType = 'CASUAL' | 'SICK' | 'EMERGENCY' | 'ANNUAL' | 'MATERNITY' | 'PATERNITY' | 'UNPAID';
export type LeaveStatus = 'PENDING' | 'SUPERVISOR_APPROVED' | 'PENDING_PRINCIPAL_APPROVAL' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export interface User {
  id?: number;
  employeeId: string;
  fullName: string;
  email: string;
  mobileNumber?: string;
  department?: string;
  designation?: string;
  joiningDate?: string;
  supervisorEmployeeId?: string;
  supervisorName?: string;
  role: Role;
  status: AccountStatus;
  paidLeaveBalance: number;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  employeeId: string;
  fullName: string;
  email: string;
  role: Role;
  status: AccountStatus;
  department?: string;
  designation?: string;
  supervisorEmployeeId?: string;
  paidLeaveBalance: number;
}

export interface AttendanceRecord {
  id?: number;
  employeeId: string;
  staffName?: string;
  department?: string;
  designation?: string;
  supervisorEmployeeId?: string;
  attendanceDate: string;
  markedStatus?: MarkedStatus;
  markedAt?: string;
  approvalStatus: ApprovalStatus;
  finalStatus: FinalAttendanceStatus;
  approvedBy?: string;
  approvedAt?: string;
  principalRemarks?: string;
  onLeave?: boolean;
}

export interface AttendanceAudit {
  id: number;
  attendanceId: number;
  employeeId: string;
  attendanceDate: string;
  previousStatus: string;
  newStatus: string;
  changedBy: string;
  changedAt: string;
  reason: string;
}

export interface LeaveRecord {
  id: number;
  employeeId: string;
  staffName?: string;
  department?: string;
  designation?: string;
  supervisorEmployeeId?: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  totalDays: number;
  paidDays: number;
  unpaidDays: number;
  reason: string;
  attachmentUrl?: string;
  supervisorStatus?: ApprovalStatus;
  supervisorRemarks?: string;
  supervisorReviewedBy?: string;
  supervisorReviewedAt?: string;
  principalStatus?: ApprovalStatus;
  principalRemarks?: string;
  principalApprovedBy?: string;
  principalApprovedAt?: string;
  finalStatus: LeaveStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface LeavePreview {
  startDate: string;
  endDate: string;
  totalDays: number;
  currentPaidBalance: number;
  paidDays: number;
  unpaidDays: number;
  remainingPaidBalanceAfter: number;
  valid: boolean;
  message: string;
}

export interface SchoolHoliday {
  id?: number;
  holidayDate: string;
  name: string;
  holidayType: string;
  description?: string;
}

export interface NotificationItem {
  id: number;
  employeeId: string;
  title: string;
  message: string;
  type: 'ATTENDANCE' | 'LEAVE' | 'SYSTEM';
  isRead: boolean;
  createdAt: string;
}

export interface DashboardStats {
  totalStaff: number;
  presentToday: number;
  absentToday: number;
  onLeaveToday: number;
  notMarkedToday: number;
  pendingAttendanceApprovals: number;
  pendingLeaveRequests: number;
  approvedLeaves: number;
  rejectedLeaves: number;
  myPaidLeaveTotal: number;
  myPaidLeaveUsed: number;
  myPaidLeaveRemaining: number;
  myPendingLeaves: number;
  myApprovedLeaves: number;
  myRejectedLeaves: number;
  myPresentDays: number;
  myAbsentDays: number;
  myLeaveDays: number;
  myAttendancePercentage: number;
  todayAttendance?: AttendanceRecord;
  departmentBreakdown?: Record<string, number>;
}

export interface Student {
  id: number;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  grade: string;
  section: string;
  rollNumber?: string;
  dob?: string;
  gender?: string;
  bloodGroup?: string;
  avatarUrl?: string;
  allergies?: string;
  pediatricianContact?: string;
  emergencyPhone?: string;
  parentUserId?: number;
  parentName?: string;
  parentEmail?: string;
  parentPhone?: string;
  motherTeacherName?: string;
  schoolBusVanNumber?: string;
}

export interface StudentDailyCareLog {
  id?: number;
  studentId: number;
  logDate: string;
  checkInTime?: string;
  checkOutTime?: string;
  attendanceStatus: 'PRESENT' | 'ABSENT' | 'ON_LEAVE';
  mealStatus: 'FINISHED_ALL' | 'PARTIALLY_EATEN' | 'REFUSED' | 'BROUGHT_FRUIT';
  mealNotes?: string;
  napMinutes?: number;
  napNotes?: string;
  mood: 'HAPPY' | 'PLAYFUL' | 'CALM' | 'TEARFUL' | 'TIRED';
  temperature?: string;
  medicationGiven?: boolean;
  medicationNotes?: string;
  activitiesSummary?: string;
  teacherNotes?: string;
  recordedByStaffId?: string;
}

export interface StudentMoment {
  id?: number;
  studentId?: number;
  grade: string;
  section: string;
  momentDate: string;
  title: string;
  description?: string;
  category: 'ACTIVITY' | 'ART_CRAFT' | 'RHYME_MUSIC' | 'SPORTS_PLAY' | 'EVENT';
  mediaUrl?: string;
  tags?: string;
  weeklyTheme?: string;
  rhymeLyrics?: string;
  audioUrl?: string;
  createdByStaffId?: string;
}

export interface AuthorizedPickup {
  id?: number;
  studentId: number;
  guardianName: string;
  relation: string;
  phone: string;
  idProofNumber?: string;
  photoUrl?: string;
  isPrimary?: boolean;
  isTemporary?: boolean;
  validUntilDate?: string;
  qrSecurityCode?: string;
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
}

export interface DevelopmentalMilestone {
  id: number;
  studentId: number;
  term: string;
  domain: 'FINE_MOTOR' | 'GROSS_MOTOR' | 'LANGUAGE' | 'SOCIAL_EMOTIONAL' | 'COGNITIVE';
  skillTitle: string;
  rating: 'ACHIEVED' | 'DEVELOPING' | 'EMERGING';
  badgeTitle?: string;
  badgeIcon?: string;
  teacherNotes?: string;
  evaluatedDate?: string;
}

export interface StudentLeaveRequest {
  id: number;
  studentId: number;
  parentUserId?: number;
  startDate: string;
  endDate: string;
  totalDays: number;
  reasonType: string;
  reasonDetails?: string;
  status: 'PENDING' | 'APPROVED' | 'ACKNOWLEDGED';
  reviewedByStaffId?: string;
  teacherRemarks?: string;
  createdAt: string;
}

export interface StudentFeeRecord {
  id: number;
  studentId: number;
  termName: string;
  amount: number;
  dueDate?: string;
  paidDate?: string;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  receiptNumber?: string;
  paymentMethod?: string;
  breakdownJson?: string;
}

export interface PackTomorrowReminder {
  id: number;
  grade: string;
  section: string;
  targetDate: string;
  title: string;
  message?: string;
  itemsToPack?: string;
  dressCode?: string;
  badgeTag?: string;
  createdByStaffId?: string;
}

export interface ParentDashboardData {
  student: Student;
  siblings: Student[];
  todayLog: StudentDailyCareLog;
  recentLogs: StudentDailyCareLog[];
  recentMoments: StudentMoment[];
  authorizedPickups: AuthorizedPickup[];
  milestones: DevelopmentalMilestone[];
  recentLeaves: StudentLeaveRequest[];
  feeRecords: StudentFeeRecord[];
  tomorrowReminder?: PackTomorrowReminder;
}
