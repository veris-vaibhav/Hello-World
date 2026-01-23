import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

// Mock user for demo purposes
const mockUsers: Record<string, { user: User; password: string }> = {
  'admin@veris.com': {
    password: 'admin123',
    user: {
      id: 'usr-001',
      email: 'admin@veris.com',
      name: 'Admin User',
      role: 'BUILDING_ADMIN' as UserRole,
      parkingLocationId: 'pl-001',
      permissions: ['ALL'],
      status: 'ACTIVE',
    },
  },
  'tenant@company.com': {
    password: 'tenant123',
    user: {
      id: 'usr-002',
      email: 'tenant@company.com',
      name: 'Tenant Admin',
      role: 'TENANT_ADMIN' as UserRole,
      tenantId: 'tenant-001',
      parkingLocationId: 'pl-001',
      permissions: ['MANAGE_TENANT_SETTINGS', 'VIEW_TENANT_REPORTS', 'MANAGE_EMPLOYEES'],
      status: 'ACTIVE',
    },
  },
  'facility@veris.com': {
    password: 'facility123',
    user: {
      id: 'usr-003',
      email: 'facility@veris.com',
      name: 'Facility Manager',
      role: 'FACILITY_MANAGER' as UserRole,
      tenantId: 'tenant-001',
      parkingLocationId: 'pl-001',
      permissions: ['VIEW_OCCUPANCY', 'MANAGE_BLOCKS', 'VIEW_EXCEPTIONS'],
      status: 'ACTIVE',
    },
  },
  'security@veris.com': {
    password: 'security123',
    user: {
      id: 'usr-004',
      email: 'security@veris.com',
      name: 'Security Guard',
      role: 'SECURITY_GUARD' as UserRole,
      parkingLocationId: 'pl-001',
      permissions: ['ENTRY_EXIT_OPERATIONS', 'VIEW_VEHICLE', 'MANAGE_EXCEPTIONS'],
      status: 'ACTIVE',
    },
  },
  'employee@company.com': {
    password: 'employee123',
    user: {
      id: 'usr-005',
      email: 'employee@company.com',
      name: 'John Employee',
      role: 'EMPLOYEE' as UserRole,
      tenantId: 'tenant-001',
      parkingLocationId: 'pl-001',
      permissions: ['BOOK', 'VIEW_OWN_BOOKINGS', 'MANAGE_OWN_VEHICLES'],
      status: 'ACTIVE',
    },
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        const mockUser = mockUsers[email];

        if (mockUser && mockUser.password === password) {
          set({
            user: mockUser.user,
            token: 'mock-jwt-token-' + Date.now(),
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          set({ isLoading: false });
          throw new Error('Invalid email or password');
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      setUser: (user: User) => {
        set({ user });
      },
    }),
    {
      name: 'parkpro-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
