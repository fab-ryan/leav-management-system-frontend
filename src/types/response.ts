interface Root {
  message: string
  success: boolean
  status: any
  date: string
}

interface AccessToken {
  role: string
  token: string
}

export interface LoginResponse extends Root {
  access_token: AccessToken
}
interface Policy {
  id: string
  name: string
  description: string
  isActive: boolean
  annualAllowance: number
  sickAllowance: number
  personalAllowance: number
  carryForwardLimit: number
  requiresApproval: boolean
  requiresDocumentation: boolean
  minDaysBeforeRequest: number
  maternityAllowance: number
  paternityAllowance: number
  unpaidAllowance: number
  otherAllowance: number
  createdAt: string
  updatedAt: string
}

export interface GetAllLeavePolicyResponse extends Root {
  policies: Policy[]
}
export interface GetLeavePolicyResponse extends Root {
  policy: Policy;
}
export interface GetEmployeeLeavePolicyResponse extends Root {
  leave_policy: Policy;
}
interface Department {
  id: string
  name: string
  description: string
  isPublic: boolean
}
export interface GetAllDepartments extends Root {
  departments: Department[]
}
export interface GetDepartmentResponse extends Root {
  department: Department;
}
interface User {
  id: string
  name: string
  email: string
  role: string
  status: string
  department: Department
  phoneNumber: string
  emergencyPhoneNumber?: string
  createdAt: string
  updatedAt: string,
  profileCompleted: boolean,
  team?: string
  location?: string
  profilePictureUrl?: string
  lastLoginAt: any
  leavePolicy: Policy
}

export interface GetAllUsersResponse extends Root {
  users: UserPagination
}
interface UserPagination {
  content: User[]
  pageable: Pageable
  last: boolean
  totalElements: number
  totalPages: number
}
export interface validateLeaveTypeResponse extends Root {
  leave_validation: boolean
}
interface LeaveValidation {
  isValid: boolean
  balance: number
}
export interface validateLeaveByDateResponse extends Root {
  leave_validation: LeaveValidation
}
export interface ApplyLeaveResponse extends Root {
  leave_application: LeaveApplication
}
export interface GetAllLeaveApplicationsResponse extends Root {
  leave_applications: LeavePagination
}
export interface GetAllLeaveApplicationsByDateResponse extends Root {
  leave_applications: LeaveApplication[]
}
export interface GetAllLeaveApplicationsByPaginationResponse extends Root {
  leave_applications: LeavePagination
}
interface LeavePagination {
  content: LeaveApplication[]
  pageable: Pageable
  last: boolean
  totalElements: number
  totalPages: number
  size: number
  number: number
  sort: Sort2
  first: boolean
  numberOfElements: number
  empty: boolean
}
export interface GetCompassionateLeaveResponse extends Root {

  compassion_requests: CompassionateLeave[]
}
interface CompassionateLeave {
  id: string
  employee: User
  workDate: string
  reason: string
  status: string
  rejectionReason?: any
  approvedBy?: User
  approvedAt?: string
}

export interface Pageable {
  pageNumber: number
  pageSize: number
  sort: Sort
  offset: number
  paged: boolean
  unpaged: boolean
}

export interface Sort {
  empty: boolean
  sorted: boolean
  unsorted: boolean
}

export interface Sort2 {
  empty: boolean
  sorted: boolean
  unsorted: boolean
}
export interface LeaveApplication {
  id: string
  employee: User
  leaveType: string
  startDate: string
  endDate: string
  isHalfDay: boolean
  isMorning: boolean
  reason: string
  supportingDocuments?: SupportingDocument[]
  status: string
  createdAt: string
  updatedAt: string
  comment?: string
}
interface SupportingDocument {
  type: string
  filePath: string
}

export interface GetLeaveBalanceResponse extends Root {
  leave_balance: LeaveBalances
}
interface LeaveBalance {
  id: string
  employee: User
  annualAllowance: number
  sickAllowance: number
  personalAllowance: number
  carryForwardLimit: number
  maternityAllowance: number
  paternityAllowance: number
  unpaidAllowance: number
  otherAllowance: number
  createdAt: string
  updatedAt: string
}
export interface LeaveBalances {
  id: string
  employee: User
  year: number
  annualBalance: number
  sickBalance: number
  maternityBalance: number
  paternityBalance: number
  unpaidBalance: number
  otherBalance: number
  carryForwardBalance: number
  personalBalance: number
  createdAt: string
  updatedAt: string
}
export interface GetAllLeavePoliciesBalanceResponse extends Root {
  leave_balances: LeaveBalances[]
}
export interface GetEmployeeDashboardResponse extends Root {
  dashboard: Dashboard
}
interface Dashboard {
  approvedLeavesCount: number
  pendingLeavesCount: number
  upcomingLeaves: LeaveApplication[]
}
export interface GetAllHolidays extends Root {
  holidays: Holiday[]
}
interface Holiday {
  id: string
  name: string
  date: string
  restrictionReason: any
  createdAt: string
  updatedAt: string
  active: boolean
  restricted: boolean
  recurring: boolean
}

export interface PostHolidayResponse extends Root {
  holiday: Holiday
}
export interface EmployeeProfileResponse extends Root {
  employee: User
}

export interface Notification {
  id: string
  employee: User
  title: string
  message: string
  createdAt: string
  type: string
  isRead?: boolean
}

export interface GetAllNotificationsResponse extends Root {
  notifications: Notification[]
}
export interface GetUnreadNotificationsResponse extends Root {
  notifications: Notification[]
}
export interface CountUnreadNotificationsResponse extends Root {
  count: number
}

export interface ManagerDashboardResponse extends Root {
  dashboard: ManagerDashboard
}
interface ManagerDashboard {
  leaveTypeMonthlyStats: LeaveTypeMonthlyStats
  departmentLeaveDays: DepartmentLeaveDays
  statusCounts: StatusCounts
  statusRatios: StatusRatios
}
interface DepartmentLeaveDays {
  [key: string]: LeaveType
}
interface LeaveTypeMonthlyStats {
  [key: string]: LeaveType
}
interface LeaveType {
  PERSONAL?: number
  OTHER?: number
  PATERNITY?: number
  ANNUAL?: number
  SICK?: number
  UNPAID?: number
  MATERNITY?: number
}


interface StatusCounts {
  APPROVED: number
  PENDING: number
  REJECTED: number
}

interface StatusRatios {
  APPROVED: number
  CANCELLED: number
  REJECTED: number
  PENDING: number
}
interface StatusCounts {
  APPROVED: number
  CANCELLED: number
  REJECTED: number
  PENDING: number
}