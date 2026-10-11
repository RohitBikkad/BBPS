export type Role = 'ROLE_PRINCIPAL' | 'ROLE_SUPERVISOR' | 'ROLE_STAFF';
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
