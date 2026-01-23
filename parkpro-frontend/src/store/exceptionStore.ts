import { create } from 'zustand';
import type { Exception, ExceptionStatus } from '../types';

interface ExceptionState {
  exceptions: Exception[];
  selectedException: Exception | null;
  isLoading: boolean;
  error: string | null;
  fetchExceptions: () => Promise<void>;
  resolveException: (id: string, resolution: string) => Promise<void>;
  dismissException: (id: string) => Promise<void>;
  setSelectedException: (exception: Exception | null) => void;
}

// Mock exceptions data
const mockExceptions: Exception[] = [
  {
    id: 'exc-001',
    type: 'UNKNOWN_VEHICLE',
    severity: 'MEDIUM',
    status: 'OPEN',
    vehicleNumber: 'HR26DK9999',
    description: 'Unregistered vehicle attempting entry at Main Gate',
    gateId: 'gate-001',
    autoAction: 'BLOCK_AND_ALERT',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'exc-002',
    type: 'EXIT_WITHOUT_ENTRY',
    severity: 'LOW',
    status: 'OPEN',
    vehicleNumber: 'DL01AB5678',
    vehicleId: 'veh-015',
    description: 'Vehicle exiting with no entry record',
    gateId: 'gate-002',
    autoAction: 'ALLOW_AND_LOG',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'exc-003',
    type: 'ANTI_PASSBACK_VIOLATION',
    severity: 'HIGH',
    status: 'IN_PROGRESS',
    vehicleNumber: 'MH12DE3456',
    vehicleId: 'veh-008',
    employeeId: 'emp-008',
    description: 'Duplicate entry attempt - vehicle already inside',
    gateId: 'gate-001',
    autoAction: 'BLOCK_AND_ALERT',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: 'exc-004',
    type: 'VEHICLE_MISMATCH',
    severity: 'HIGH',
    status: 'OPEN',
    vehicleNumber: 'KA05MN7890',
    vehicleId: 'veh-022',
    employeeId: 'emp-012',
    bookingId: 'bkg-045',
    description: 'Vehicle at gate does not match booking. Expected: HR26DK1234',
    gateId: 'gate-001',
    autoAction: 'BLOCK',
    createdAt: new Date(Date.now() - 900000).toISOString(),
  },
  {
    id: 'exc-005',
    type: 'OVERSTAY',
    severity: 'MEDIUM',
    status: 'OPEN',
    vehicleNumber: 'HR26DK1234',
    vehicleId: 'veh-001',
    employeeId: 'emp-001',
    bookingId: 'bkg-010',
    description: 'Vehicle parked beyond booking window by 2 hours',
    autoAction: 'ALERT_AND_CHARGE',
    createdAt: new Date(Date.now() - 5400000).toISOString(),
  },
  {
    id: 'exc-006',
    type: 'ENTRY_WITHOUT_EXIT',
    severity: 'MEDIUM',
    status: 'RESOLVED',
    vehicleNumber: 'TN09CD4567',
    vehicleId: 'veh-018',
    employeeId: 'emp-018',
    description: 'Vehicle entry recorded 48 hours ago with no exit',
    autoAction: 'MARK_STALE_AFTER_THRESHOLD',
    resolution: 'Manual checkout performed - vehicle had exited via emergency exit',
    resolvedBy: 'usr-003',
    resolvedAt: new Date(Date.now() - 3600000).toISOString(),
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 'exc-007',
    type: 'CAPACITY_BREACH',
    severity: 'CRITICAL',
    status: 'RESOLVED',
    description: 'Basement 1 occupancy exceeded capacity by 5 vehicles',
    autoAction: 'ALERT_FACILITY_MANAGER',
    resolution: 'Capacity adjusted after physical verification',
    resolvedBy: 'usr-003',
    resolvedAt: new Date(Date.now() - 7200000).toISOString(),
    createdAt: new Date(Date.now() - 10800000).toISOString(),
  },
  {
    id: 'exc-008',
    type: 'BOOKING_NO_SHOW',
    severity: 'LOW',
    status: 'DISMISSED',
    employeeId: 'emp-025',
    bookingId: 'bkg-032',
    description: 'Employee did not arrive within grace period',
    autoAction: 'RELEASE_AFTER_GRACE',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const useExceptionStore = create<ExceptionState>((set, get) => ({
  exceptions: [],
  selectedException: null,
  isLoading: false,
  error: null,

  fetchExceptions: async () => {
    set({ isLoading: true, error: null });

    await new Promise((resolve) => setTimeout(resolve, 300));

    set({ exceptions: mockExceptions, isLoading: false });
  },

  resolveException: async (id: string, resolution: string) => {
    set({ isLoading: true });

    await new Promise((resolve) => setTimeout(resolve, 300));

    const { exceptions } = get();
    const updatedExceptions = exceptions.map((e) =>
      e.id === id
        ? {
            ...e,
            status: 'RESOLVED' as ExceptionStatus,
            resolution,
            resolvedAt: new Date().toISOString(),
            resolvedBy: 'usr-current',
          }
        : e
    );

    set({ exceptions: updatedExceptions, isLoading: false });
  },

  dismissException: async (id: string) => {
    set({ isLoading: true });

    await new Promise((resolve) => setTimeout(resolve, 300));

    const { exceptions } = get();
    const updatedExceptions = exceptions.map((e) =>
      e.id === id
        ? {
            ...e,
            status: 'DISMISSED' as ExceptionStatus,
          }
        : e
    );

    set({ exceptions: updatedExceptions, isLoading: false });
  },

  setSelectedException: (exception: Exception | null) => {
    set({ selectedException: exception });
  },
}));
