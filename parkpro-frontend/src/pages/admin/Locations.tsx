import { useState } from 'react';
import { PlusIcon, PencilIcon, EyeIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import type { ParkingLocation } from '../../types';

// Mock data
const mockLocations: ParkingLocation[] = [
  {
    id: 'pl-001',
    siteId: 'site-001',
    name: 'Tower A Parking',
    address: '123 Business Park, Sector 62, Gurgaon',
    operatingMode: 'MULTI_TENANT',
    totalCapacity: 500,
    operatingHours: {
      weekdays: { start: '06:00', end: '23:00' },
      weekends: { start: '08:00', end: '20:00' },
    },
    shifts: [
      { name: 'Day Shift', start: '06:00', end: '18:00' },
      { name: 'Night Shift', start: '18:00', end: '06:00' },
    ],
    settings: {
      allowOvernightParking: true,
      maxContinuousParkingHours: 72,
      requireVehicleRegistration: true,
    },
    status: 'ACTIVE',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'pl-002',
    siteId: 'site-001',
    name: 'Tower B Parking',
    address: '125 Business Park, Sector 62, Gurgaon',
    operatingMode: 'SINGLE_TENANT',
    totalCapacity: 300,
    operatingHours: {
      weekdays: { start: '07:00', end: '22:00' },
      weekends: { start: '09:00', end: '18:00' },
    },
    shifts: [
      { name: 'Day Shift', start: '07:00', end: '19:00' },
    ],
    settings: {
      allowOvernightParking: false,
      maxContinuousParkingHours: 12,
      requireVehicleRegistration: true,
    },
    status: 'ACTIVE',
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
  },
];

export function Locations() {
  const [locations] = useState<ParkingLocation[]>(mockLocations);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Parking Locations</h1>
          <p className="text-gray-500 mt-1">Manage parking facilities and their configurations</p>
        </div>
        <button className="btn-primary">
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Location
        </button>
      </div>

      {/* Location Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.map((location) => (
          <div key={location.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <div className="p-3 bg-primary-100 rounded-lg">
                    <BuildingOfficeIcon className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900">{location.name}</h3>
                    <p className="text-sm text-gray-500">{location.id}</p>
                  </div>
                </div>
                <span
                  className={`badge ${
                    location.status === 'ACTIVE' ? 'badge-green' : 'badge-gray'
                  }`}
                >
                  {location.status}
                </span>
              </div>

              <p className="text-sm text-gray-500 mt-4">{location.address}</p>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Capacity</p>
                  <p className="text-lg font-semibold text-gray-900">{location.totalCapacity}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Mode</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {location.operatingMode === 'MULTI_TENANT' ? 'Multi-Tenant' : 'Single Tenant'}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-500">Operating Hours (Weekdays)</p>
                <p className="text-sm font-medium text-gray-900">
                  {location.operatingHours.weekdays.start} - {location.operatingHours.weekdays.end}
                </p>
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-500">Shifts</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {location.shifts.map((shift) => (
                    <span key={shift.name} className="badge-blue text-xs">
                      {shift.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end space-x-2">
              <button className="btn-secondary text-sm">
                <EyeIcon className="h-4 w-4 mr-1" />
                View
              </button>
              <button className="btn-secondary text-sm">
                <PencilIcon className="h-4 w-4 mr-1" />
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <p className="text-3xl font-bold text-gray-900">{locations.length}</p>
            <p className="text-sm text-gray-500">Total Locations</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">
              {locations.reduce((sum, l) => sum + l.totalCapacity, 0)}
            </p>
            <p className="text-sm text-gray-500">Total Capacity</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">
              {locations.filter((l) => l.operatingMode === 'MULTI_TENANT').length}
            </p>
            <p className="text-sm text-gray-500">Multi-Tenant</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-green-600">
              {locations.filter((l) => l.status === 'ACTIVE').length}
            </p>
            <p className="text-sm text-gray-500">Active</p>
          </div>
        </div>
      </div>
    </div>
  );
}
