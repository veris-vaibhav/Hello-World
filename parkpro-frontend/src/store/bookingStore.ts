import { create } from 'zustand';
import type { Booking, BookingStatus, PaginationParams, FilterParams } from '../types';

interface BookingState {
  bookings: Booking[];
  selectedBooking: Booking | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
  fetchBookings: (params?: PaginationParams & FilterParams) => Promise<void>;
  createBooking: (booking: Partial<Booking>) => Promise<Booking>;
  updateBooking: (id: string, booking: Partial<Booking>) => Promise<void>;
  cancelBooking: (id: string) => Promise<void>;
  checkIn: (id: string, method: string, gateId: string) => Promise<void>;
  checkOut: (id: string, gateId: string) => Promise<void>;
  setSelectedBooking: (booking: Booking | null) => void;
}

// Mock bookings data
const generateMockBookings = (): Booking[] => {
  const statuses: BookingStatus[] = ['CONFIRMED', 'CHECKED_IN', 'COMPLETED', 'CANCELLED', 'NO_SHOW'];
  const bookings: Booking[] = [];
  const today = new Date();

  for (let i = 0; i < 50; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + Math.floor(Math.random() * 14) - 7);
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    bookings.push({
      id: `bkg-${String(i + 1).padStart(3, '0')}`,
      tenantId: `tenant-00${(i % 3) + 1}`,
      employeeId: `emp-${String((i % 20) + 1).padStart(3, '0')}`,
      vehicleId: `veh-${String((i % 30) + 1).padStart(3, '0')}`,
      bookingType: i % 5 === 0 ? 'MULTI_DAY' : 'SINGLE_DAY',
      timing: {
        date: date.toISOString().split('T')[0],
        shift: i % 2 === 0 ? 'Day Shift' : 'Night Shift',
        startTime: i % 2 === 0 ? '09:00' : '18:00',
        endTime: i % 2 === 0 ? '18:00' : '06:00',
      },
      allocation: {
        poolId: `pool-${(i % 3) + 1}`,
        zonePreference: i % 4 === 0 ? `zone-${(i % 3) + 1}` : undefined,
        spotAssigned: status === 'CHECKED_IN' || status === 'COMPLETED' ? `spot-${String(i + 1).padStart(3, '0')}` : undefined,
        assignmentType: i % 3 === 0 ? 'PRE_ASSIGNED' : 'AT_ENTRY',
      },
      status,
      timestamps: {
        createdAt: new Date(date.getTime() - 86400000 * 2).toISOString(),
        confirmedAt: new Date(date.getTime() - 86400000 * 2).toISOString(),
        checkinAt: status === 'CHECKED_IN' || status === 'COMPLETED' ? new Date(date.getTime() + 32400000).toISOString() : undefined,
        checkoutAt: status === 'COMPLETED' ? new Date(date.getTime() + 64800000).toISOString() : undefined,
        cancelledAt: status === 'CANCELLED' ? new Date(date.getTime() - 86400000).toISOString() : undefined,
      },
      checkinDetails: {
        method: status === 'CHECKED_IN' || status === 'COMPLETED' ? 'ANPR' : undefined,
        gateId: status === 'CHECKED_IN' || status === 'COMPLETED' ? 'gate-001' : undefined,
        actualVehicleId: status === 'CHECKED_IN' || status === 'COMPLETED' ? `veh-${String((i % 30) + 1).padStart(3, '0')}` : undefined,
      },
    });
  }

  return bookings;
};

const mockBookings = generateMockBookings();

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: [],
  selectedBooking: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  },

  fetchBookings: async (params?: PaginationParams & FilterParams) => {
    set({ isLoading: true, error: null });

    await new Promise((resolve) => setTimeout(resolve, 300));

    let filteredBookings = [...mockBookings];

    // Apply filters
    if (params?.status) {
      filteredBookings = filteredBookings.filter((b) => b.status === params.status);
    }
    if (params?.tenantId) {
      filteredBookings = filteredBookings.filter((b) => b.tenantId === params.tenantId);
    }
    if (params?.startDate) {
      filteredBookings = filteredBookings.filter((b) => b.timing.date >= params.startDate!);
    }
    if (params?.endDate) {
      filteredBookings = filteredBookings.filter((b) => b.timing.date <= params.endDate!);
    }
    if (params?.search) {
      const search = params.search.toLowerCase();
      filteredBookings = filteredBookings.filter(
        (b) =>
          b.id.toLowerCase().includes(search) ||
          b.employeeId.toLowerCase().includes(search)
      );
    }

    // Apply pagination
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 10;
    const totalItems = filteredBookings.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = (page - 1) * pageSize;
    const paginatedBookings = filteredBookings.slice(startIndex, startIndex + pageSize);

    set({
      bookings: paginatedBookings,
      isLoading: false,
      pagination: {
        page,
        pageSize,
        totalItems,
        totalPages,
      },
    });
  },

  createBooking: async (bookingData: Partial<Booking>) => {
    set({ isLoading: true, error: null });

    await new Promise((resolve) => setTimeout(resolve, 500));

    const newBooking: Booking = {
      id: `bkg-${String(mockBookings.length + 1).padStart(3, '0')}`,
      tenantId: bookingData.tenantId || 'tenant-001',
      employeeId: bookingData.employeeId || '',
      vehicleId: bookingData.vehicleId || '',
      bookingType: bookingData.bookingType || 'SINGLE_DAY',
      timing: bookingData.timing || {
        date: new Date().toISOString().split('T')[0],
        shift: 'Day Shift',
        startTime: '09:00',
        endTime: '18:00',
      },
      allocation: bookingData.allocation || {
        poolId: 'pool-001',
        assignmentType: 'AT_ENTRY',
      },
      status: 'CONFIRMED',
      timestamps: {
        createdAt: new Date().toISOString(),
        confirmedAt: new Date().toISOString(),
      },
      checkinDetails: {},
    };

    mockBookings.push(newBooking);
    set({ isLoading: false });

    return newBooking;
  },

  updateBooking: async (id: string, bookingData: Partial<Booking>) => {
    set({ isLoading: true, error: null });

    await new Promise((resolve) => setTimeout(resolve, 300));

    const index = mockBookings.findIndex((b) => b.id === id);
    if (index !== -1) {
      mockBookings[index] = { ...mockBookings[index], ...bookingData };
    }

    const { bookings } = get();
    const updatedBookings = bookings.map((b) =>
      b.id === id ? { ...b, ...bookingData } : b
    );

    set({ bookings: updatedBookings, isLoading: false });
  },

  cancelBooking: async (id: string) => {
    await get().updateBooking(id, {
      status: 'CANCELLED',
      timestamps: {
        ...mockBookings.find((b) => b.id === id)?.timestamps,
        cancelledAt: new Date().toISOString(),
      } as Booking['timestamps'],
    });
  },

  checkIn: async (id: string, method: string, gateId: string) => {
    await get().updateBooking(id, {
      status: 'CHECKED_IN',
      timestamps: {
        ...mockBookings.find((b) => b.id === id)?.timestamps,
        checkinAt: new Date().toISOString(),
      } as Booking['timestamps'],
      checkinDetails: {
        method: method as Booking['checkinDetails']['method'],
        gateId,
        actualVehicleId: mockBookings.find((b) => b.id === id)?.vehicleId,
      },
    });
  },

  checkOut: async (id: string, _gateId: string) => {
    await get().updateBooking(id, {
      status: 'COMPLETED',
      timestamps: {
        ...mockBookings.find((b) => b.id === id)?.timestamps,
        checkoutAt: new Date().toISOString(),
      } as Booking['timestamps'],
    });
  },

  setSelectedBooking: (booking: Booking | null) => {
    set({ selectedBooking: booking });
  },
}));
