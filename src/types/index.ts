
export type UserRole = 'staff' | 'manager' | 'admin';

export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export type LeaveType = 'annual' | 'sick' | 'personal' | 'maternity' | 'paternity' | 'unpaid' | 'other';

export type AuthProvider = 'microsoft' | 'google' | 'email';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  managerId?: string;
  profileImage?: string;
  authProvider?: AuthProvider;
}

export interface LeaveBalance {
  userId: string;
  annual: number;
  sick: number;
  personal: number;
  carryForward: number;
  lastUpdated: Date;
}

export interface LeaveRequest {
  id: string;
  userId: string;
  employee?: string; // Added for display purposes
  type: LeaveType;
  status: LeaveStatus;
  startDate: Date;
  endDate: Date;
  isHalfDay: boolean;
  isMorning?: boolean;
  reason?: string;
  documentUrls?: string[];
  approvedBy?: string;
  comments?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Holiday {
  id: string;
  name: string;
  date: Date;
  isRestricted: boolean;
}


export interface LeavePolicy {
  id: string;
  name: string;
  annualAllowance: number;
  sickAllowance: number;
  personalAllowance: number;
  carryForwardLimit: number;
  requiresApproval: boolean;
  requiresDocumentation: boolean;
  minDaysBeforeRequest: number;
}

export interface Department {
  id: string;
  name: string;
  managerId: string;
}

export interface LeaveAdjustment {
  id: string;
  userId: string;
  leaveType: LeaveType;
  amount: number;
  reason: string;
  adjustedBy: string;
  date: Date;
}

export interface LeaveReport {
  departmentId?: string;
  leaveType?: LeaveType;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  employeeCount: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export * from './response'