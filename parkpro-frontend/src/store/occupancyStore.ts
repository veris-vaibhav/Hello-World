import { create } from 'zustand';
import type { RealTimeOccupancy } from '../types';

interface OccupancyState {
  occupancy: RealTimeOccupancy | null;
  isLoading: boolean;
  error: string | null;
  fetchOccupancy: (parkingLocationId: string) => Promise<void>;
  updateOccupancy: (occupancy: RealTimeOccupancy) => void;
}

// Mock occupancy data
const mockOccupancy: RealTimeOccupancy = {
  parkingLocationId: 'pl-001',
  timestamp: new Date().toISOString(),
  summary: {
    totalCapacity: 500,
    totalOccupied: 347,
    totalAvailable: 153,
    utilizationPercentage: 69.4,
  },
  byFloor: [
    { floorId: 'flr-b1', name: 'Basement 1', capacity: 120, occupied: 98, available: 22 },
    { floorId: 'flr-b2', name: 'Basement 2', capacity: 150, occupied: 112, available: 38 },
    { floorId: 'flr-b3', name: 'Basement 3', capacity: 130, occupied: 87, available: 43 },
    { floorId: 'flr-surface', name: 'Surface Parking', capacity: 100, occupied: 50, available: 50 },
  ],
  byTenant: [
    {
      tenantId: 'tenant-001',
      name: 'TechCorp Inc.',
      quota: 150,
      occupied: 98,
      available: 52,
      pools: [
        { pool: 'Reserved', quota: 100, occupied: 75 },
        { pool: 'FCFS', quota: 30, occupied: 18 },
        { pool: 'Visitor', quota: 20, occupied: 5 },
      ],
    },
    {
      tenantId: 'tenant-002',
      name: 'FinanceHub Ltd.',
      quota: 100,
      occupied: 72,
      available: 28,
      pools: [
        { pool: 'Reserved', quota: 70, occupied: 55 },
        { pool: 'FCFS', quota: 20, occupied: 12 },
        { pool: 'Visitor', quota: 10, occupied: 5 },
      ],
    },
    {
      tenantId: 'tenant-003',
      name: 'DesignStudio',
      quota: 80,
      occupied: 65,
      available: 15,
      pools: [
        { pool: 'Reserved', quota: 50, occupied: 45 },
        { pool: 'FCFS', quota: 20, occupied: 15 },
        { pool: 'Visitor', quota: 10, occupied: 5 },
      ],
    },
  ],
  byVehicleType: [
    { vehicleType: 'FOUR_WHEELER', capacity: 400, occupied: 287 },
    { vehicleType: 'TWO_WHEELER', capacity: 100, occupied: 60 },
  ],
  exceptions: {
    unidentifiedVehicles: 8,
    staleEntries: 3,
    overstays: 5,
  },
};

export const useOccupancyStore = create<OccupancyState>((set) => ({
  occupancy: null,
  isLoading: false,
  error: null,

  fetchOccupancy: async (_parkingLocationId: string) => {
    set({ isLoading: true, error: null });

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Add some random variation to make it more realistic
    const updatedOccupancy: RealTimeOccupancy = {
      ...mockOccupancy,
      timestamp: new Date().toISOString(),
      summary: {
        ...mockOccupancy.summary,
        totalOccupied: mockOccupancy.summary.totalOccupied + Math.floor(Math.random() * 10) - 5,
      },
    };

    updatedOccupancy.summary.totalAvailable =
      updatedOccupancy.summary.totalCapacity - updatedOccupancy.summary.totalOccupied;
    updatedOccupancy.summary.utilizationPercentage =
      (updatedOccupancy.summary.totalOccupied / updatedOccupancy.summary.totalCapacity) * 100;

    set({ occupancy: updatedOccupancy, isLoading: false });
  },

  updateOccupancy: (occupancy: RealTimeOccupancy) => {
    set({ occupancy });
  },
}));
