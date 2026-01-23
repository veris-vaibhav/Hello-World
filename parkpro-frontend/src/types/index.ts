// ==========================================
// VERIS PARKPRO - Core Type Definitions
// ==========================================

// Base Types
export type UUID = string;
export type ISODateString = string;
export type TimeString = string; // HH:mm format

// ==========================================
// Organization & Site Hierarchy
// ==========================================

export interface Organization {
  id: UUID;
  name: string;
  code: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface Site {
  id: UUID;
  organizationId: UUID;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  timezone: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export type OperatingMode = 'SINGLE_TENANT' | 'MULTI_TENANT';

export interface OperatingHours {
  start: TimeString;
  end: TimeString;
}

export interface Shift {
  name: string;
  start: TimeString;
  end: TimeString;
}

export interface ParkingLocationSettings {
  allowOvernightParking: boolean;
  maxContinuousParkingHours: number;
  requireVehicleRegistration: boolean;
}

export interface ParkingLocation {
  id: UUID;
  siteId: UUID;
  name: string;
  address: string;
  operatingMode: OperatingMode;
  totalCapacity: number;
  operatingHours: {
    weekdays: OperatingHours;
    weekends: OperatingHours;
  };
  shifts: Shift[];
  settings: ParkingLocationSettings;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

// ==========================================
// Floor, Zone & Spot
// ==========================================

export type LevelType = 'SURFACE' | 'BASEMENT' | 'ELEVATED';
export type VehicleType = 'FOUR_WHEELER' | 'TWO_WHEELER' | 'HEAVY';
export type PoolType = 'RESERVABLE' | 'FIRST_COME_FIRST_SERVED' | 'VISITOR';

export interface Floor {
  id: UUID;
  parkingLocationId: UUID;
  name: string;
  levelType: LevelType;
  levelNumber: number;
  totalSpots: number;
  vehicleTypesAllowed: VehicleType[];
  heightRestrictionMeters?: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Zone {
  id: UUID;
  floorId: UUID;
  name: string;
  spotCount: number;
  poolType: PoolType;
  tenantId?: UUID;
  status: 'ACTIVE' | 'INACTIVE';
}

export type SpotType = 'STANDARD' | 'COMPACT' | 'LARGE' | 'ACCESSIBLE' | 'EV' | 'TWO_WHEELER' | 'BUS';
export type SpotState = 'AVAILABLE' | 'RESERVED' | 'OCCUPIED' | 'INACTIVE' | 'BLOCKED';
export type SpotAssignmentType = 'NONE' | 'PERMANENT' | 'TEMPORARY' | 'DEPARTMENT';

export interface SpotAttributes {
  isEvEnabled: boolean;
  evChargerId?: UUID;
  isCovered: boolean;
  isAccessible: boolean;
  lengthMeters: number;
  widthMeters: number;
}

export interface SpotAssignment {
  type: SpotAssignmentType;
  assignedTo?: UUID;
  validFrom?: ISODateString;
  validUntil?: ISODateString;
}

export interface ParkingSpot {
  id: UUID;
  zoneId: UUID;
  spotNumber: string;
  spotType: SpotType;
  vehicleCategory: VehicleType;
  attributes: SpotAttributes;
  currentState: SpotState;
  assignment: SpotAssignment;
}

// ==========================================
// Multi-Tenancy
// ==========================================

export interface Tenant {
  id: UUID;
  organizationId: UUID;
  name: string;
  code: string;
  contactEmail: string;
  contactPhone: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: ISODateString;
}

export interface TenantPool {
  poolId: UUID;
  name: string;
  poolType: PoolType;
  quota: number;
  eligibleGroups: string[];
}

export interface DepartmentSubQuota {
  department: string;
  reservedSpots: number;
  type: 'PERMANENT_ASSIGNMENT' | 'DEPARTMENT_POOL';
}

export interface TenantAllocation {
  id: UUID;
  tenantId: UUID;
  parkingLocationId: UUID;
  totalQuota: number;
  allocationType: 'FIXED' | 'DYNAMIC';
  pools: TenantPool[];
  departmentSubQuotas: DepartmentSubQuota[];
  overflowRules: {
    allowOverflowToShared: boolean;
    overflowAction: 'DENY' | 'WAITLIST' | 'ALERT_ADMIN';
  };
}

// ==========================================
// Employee & Vehicle
// ==========================================

export interface EmployeeContact {
  email: string;
  phone: string;
}

export interface ParkingPrivileges {
  eligiblePools: UUID[];
  hasPermanentAssignment: boolean;
  permanentSpotId?: UUID;
  maxAdvanceBookingDays: number;
  maxActiveBookings: number;
}

export type EmployeeStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface Employee {
  id: UUID;
  tenantId: UUID;
  employeeCode: string;
  name: string;
  department: string;
  designation: string;
  contact: EmployeeContact;
  parkingPrivileges: ParkingPrivileges;
  vehicles: UUID[];
  defaultVehicleId?: UUID;
  status: EmployeeStatus;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export type VehicleCategory = 'CAR' | 'SUV' | 'BIKE' | 'SCOOTER' | 'BUS' | 'TRUCK';
export type PlateType = 'WHITE' | 'YELLOW' | 'GREEN' | 'BLUE';
export type VehicleOwnershipType = 'PERSONAL' | 'COMPANY_POOL' | 'RENTAL' | 'VISITOR';
export type VehicleStatus = 'ACTIVE' | 'INACTIVE' | 'BLACKLISTED';

export interface VehicleOwnership {
  type: VehicleOwnershipType;
  primaryOwnerId?: UUID;
  authorizedUsers: UUID[];
}

export interface VehicleVerification {
  rcVerified: boolean;
  rcDocumentId?: UUID;
  insuranceValidUntil?: ISODateString;
  pucValidUntil?: ISODateString;
}

export interface VehicleValidity {
  isTemporary: boolean;
  validFrom?: ISODateString;
  validUntil?: ISODateString;
}

export interface Vehicle {
  id: UUID;
  registrationNumber: string;
  registrationState: string;
  vehicleType: VehicleType;
  vehicleCategory: VehicleCategory;
  plateType: PlateType;
  make: string;
  model: string;
  color: string;
  ownership: VehicleOwnership;
  verification: VehicleVerification;
  validity: VehicleValidity;
  status: VehicleStatus;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

// ==========================================
// Booking
// ==========================================

export type BookingType = 'SINGLE_DAY' | 'MULTI_DAY' | 'RECURRING';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
export type SpotAssignmentTypeBooking = 'AT_ENTRY' | 'PRE_ASSIGNED';
export type CheckInMethod = 'ANPR' | 'QR' | 'MANUAL' | 'RFID';

export interface BookingTiming {
  date: ISODateString;
  shift: string;
  startTime: TimeString;
  endTime: TimeString;
}

export interface BookingAllocation {
  poolId: UUID;
  zonePreference?: UUID;
  spotAssigned?: UUID;
  assignmentType: SpotAssignmentTypeBooking;
}

export interface BookingTimestamps {
  createdAt: ISODateString;
  confirmedAt?: ISODateString;
  checkinAt?: ISODateString;
  checkoutAt?: ISODateString;
  cancelledAt?: ISODateString;
}

export interface CheckinDetails {
  method?: CheckInMethod;
  gateId?: UUID;
  actualVehicleId?: UUID;
}

export interface Booking {
  id: UUID;
  tenantId: UUID;
  employeeId: UUID;
  vehicleId: UUID;
  bookingType: BookingType;
  timing: BookingTiming;
  allocation: BookingAllocation;
  status: BookingStatus;
  timestamps: BookingTimestamps;
  checkinDetails: CheckinDetails;
}

// ==========================================
// Visitor Parking
// ==========================================

export interface VisitorInfo {
  name: string;
  phone: string;
  email?: string;
  company: string;
  vehicleNumber: string;
  vehicleType: VehicleType;
}

export interface HostInfo {
  employeeId: UUID;
  name: string;
  department: string;
}

export interface VisitDetails {
  purpose: string;
  expectedArrival: ISODateString;
  expectedDeparture: ISODateString;
}

export interface VisitorParkingAllocation {
  poolId: UUID;
  spotAssigned?: UUID;
  allocationType: SpotAssignmentTypeBooking;
}

export interface VisitorValidation {
  isValidated: boolean;
  validatedBy?: UUID;
  validatedAt?: ISODateString;
}

export type VisitorParkingStatus = 'INVITED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED' | 'NO_SHOW';
export type VisitorCreatedVia = 'VMS_INTEGRATION' | 'MANUAL' | 'SELF_KIOSK';

export interface VisitorParkingBooking {
  id: UUID;
  tenantId: UUID;
  visitor: VisitorInfo;
  host: HostInfo;
  visitDetails: VisitDetails;
  parkingAllocation: VisitorParkingAllocation;
  status: VisitorParkingStatus;
  validation: VisitorValidation;
  createdVia: VisitorCreatedVia;
  createdAt: ISODateString;
}

// ==========================================
// Gate & Entry/Exit
// ==========================================

export type GateType = 'ENTRY_ONLY' | 'EXIT_ONLY' | 'ENTRY_EXIT';

export interface ANPRCamera {
  enabled: boolean;
  vendor: string;
  ipAddress: string;
  protocol: string;
}

export interface Barrier {
  enabled: boolean;
  type: string;
  controllerIp: string;
  protocol: string;
}

export interface GateDisplay {
  enabled: boolean;
  type: string;
  ipAddress: string;
}

export interface QRScanner {
  enabled: boolean;
  deviceId: string;
}

export interface GateHardware {
  anprCamera: ANPRCamera;
  barrier: Barrier;
  display: GateDisplay;
  qrScanner: QRScanner;
  rfidReaderEnabled: boolean;
}

export interface Gate {
  id: UUID;
  parkingLocationId: UUID;
  name: string;
  gateType: GateType;
  vehicleTypes: VehicleType[];
  hardware: GateHardware;
  fallbackSequence: string[];
  antiPassback: {
    enabled: boolean;
    mode: 'STRICT' | 'SOFT' | 'DISABLED';
  };
  status: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE';
}

export type EntryExitEventType = 'ENTRY' | 'EXIT';
export type CaptureMethod = 'ANPR' | 'QR' | 'MANUAL' | 'RFID';

export interface EntryExitEvent {
  id: UUID;
  eventType: EntryExitEventType;
  vehicleId?: UUID;
  vehicleNumber: string;
  bookingId?: UUID;
  spotId?: UUID;
  gateId: UUID;
  captureMethod: CaptureMethod;
  captureConfidence?: number;
  imageId?: UUID;
  timestamp: ISODateString;
  employeeId?: UUID;
  tenantId?: UUID;
  isException: boolean;
  exceptionType?: string;
}

// ==========================================
// Exception Management
// ==========================================

export type ExceptionType =
  | 'UNKNOWN_VEHICLE'
  | 'EXIT_WITHOUT_ENTRY'
  | 'ENTRY_WITHOUT_EXIT'
  | 'ANTI_PASSBACK_VIOLATION'
  | 'VEHICLE_MISMATCH'
  | 'CAPACITY_BREACH'
  | 'BOOKING_NO_SHOW'
  | 'OVERSTAY';

export type ExceptionSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type ExceptionStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'DISMISSED';

export interface Exception {
  id: UUID;
  type: ExceptionType;
  severity: ExceptionSeverity;
  status: ExceptionStatus;
  vehicleNumber?: string;
  vehicleId?: UUID;
  employeeId?: UUID;
  bookingId?: UUID;
  gateId?: UUID;
  description: string;
  autoAction?: string;
  resolution?: string;
  resolvedBy?: UUID;
  resolvedAt?: ISODateString;
  createdAt: ISODateString;
}

// ==========================================
// Real-Time Occupancy
// ==========================================

export interface FloorOccupancy {
  floorId: UUID;
  name: string;
  capacity: number;
  occupied: number;
  available: number;
}

export interface TenantOccupancy {
  tenantId: UUID;
  name: string;
  quota: number;
  occupied: number;
  available: number;
  pools: {
    pool: string;
    quota: number;
    occupied: number;
  }[];
}

export interface VehicleTypeOccupancy {
  vehicleType: VehicleType;
  capacity: number;
  occupied: number;
}

export interface OccupancyExceptions {
  unidentifiedVehicles: number;
  staleEntries: number;
  overstays: number;
}

export interface RealTimeOccupancy {
  parkingLocationId: UUID;
  timestamp: ISODateString;
  summary: {
    totalCapacity: number;
    totalOccupied: number;
    totalAvailable: number;
    utilizationPercentage: number;
  };
  byFloor: FloorOccupancy[];
  byTenant: TenantOccupancy[];
  byVehicleType: VehicleTypeOccupancy[];
  exceptions: OccupancyExceptions;
}

// ==========================================
// Calendar & Blocking
// ==========================================

export type CalendarExceptionType = 'HOLIDAY' | 'EVENT' | 'MAINTENANCE' | 'CUSTOM';
export type BlockScope = 'ENTIRE_LOCATION' | 'SPECIFIC_FLOORS' | 'SPECIFIC_ZONES';
export type BlockReason = 'MAINTENANCE' | 'EVENT' | 'VIP_RESERVED' | 'CONSTRUCTION';
export type BlockStatus = 'DRAFT' | 'SCHEDULED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export interface CalendarException {
  id: UUID;
  parkingLocationId: UUID;
  exceptionType: CalendarExceptionType;
  name: string;
  date: ISODateString;
  impact: {
    scope: BlockScope;
    affectedFloors: UUID[];
    affectedZones: UUID[];
  };
  parkingRules: {
    operatingHours: OperatingHours;
    bookingsAllowed: boolean;
    existingBookingsAction: string;
  };
  notifications: {
    notifyAffectedUsers: boolean;
    notificationDaysBefore: number[];
  };
}

export interface ZoneBlock {
  id: UUID;
  scope: 'ZONE' | 'FLOOR' | 'SPOTS';
  zoneId?: UUID;
  floorId?: UUID;
  affectedSpotIds: UUID[];
  blockReason: BlockReason;
  description: string;
  duration: {
    startDatetime: ISODateString;
    endDatetime: ISODateString;
  };
  impact: {
    spotsBlocked: number;
    existingBookingsInWindow: number;
  };
  bookingHandling: {
    action: 'RELOCATE' | 'CANCEL' | 'NOTIFY_ONLY';
    relocationZone?: UUID;
    notifyAffectedEmployees: boolean;
  };
  createdBy: UUID;
  approvedBy?: UUID;
  status: BlockStatus;
}

// ==========================================
// Reports & Analytics
// ==========================================

export interface OccupancyReport {
  date: ISODateString;
  peakOccupancyTime: TimeString;
  peakOccupancy: number;
  averageOccupancy: number;
  totalEntries: number;
  totalExits: number;
  byTenant: {
    tenantId: UUID;
    tenantName: string;
    entries: number;
    exits: number;
    averageOccupancy: number;
  }[];
}

export interface UtilizationReport {
  period: {
    from: ISODateString;
    to: ISODateString;
  };
  bookedVsActual: {
    totalBookings: number;
    actualUsage: number;
    utilizationRate: number;
  };
  noShowRate: number;
  poolUtilization: {
    poolId: UUID;
    poolName: string;
    utilizationRate: number;
  }[];
  underutilizedZones: {
    zoneId: UUID;
    zoneName: string;
    utilizationRate: number;
  }[];
}

// ==========================================
// User & Authentication
// ==========================================

export type UserRole =
  | 'SUPER_ADMIN'
  | 'BUILDING_ADMIN'
  | 'TENANT_ADMIN'
  | 'FACILITY_MANAGER'
  | 'SECURITY_GUARD'
  | 'EMPLOYEE';

export interface User {
  id: UUID;
  email: string;
  name: string;
  role: UserRole;
  tenantId?: UUID;
  parkingLocationId?: UUID;
  permissions: string[];
  status: 'ACTIVE' | 'INACTIVE';
  lastLogin?: ISODateString;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ==========================================
// API Response Types
// ==========================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  pagination?: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterParams {
  search?: string;
  status?: string;
  startDate?: ISODateString;
  endDate?: ISODateString;
  tenantId?: UUID;
  floorId?: UUID;
  zoneId?: UUID;
}
