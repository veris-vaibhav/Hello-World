import { useState } from 'react';
import { PlusIcon, PencilIcon, MapPinIcon, ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import type { Floor, Zone } from '../../types';

// Mock data
const mockFloors: (Floor & { zones: (Zone & { spotCount: number })[] })[] = [
  {
    id: 'flr-b1',
    parkingLocationId: 'pl-001',
    name: 'Basement 1',
    levelType: 'BASEMENT',
    levelNumber: -1,
    totalSpots: 120,
    vehicleTypesAllowed: ['FOUR_WHEELER', 'TWO_WHEELER'],
    heightRestrictionMeters: 2.5,
    status: 'ACTIVE',
    zones: [
      { id: 'zone-001', floorId: 'flr-b1', name: 'Zone A - Reserved', spotCount: 40, poolType: 'RESERVABLE', tenantId: 'tenant-001', status: 'ACTIVE' },
      { id: 'zone-002', floorId: 'flr-b1', name: 'Zone B - FCFS', spotCount: 50, poolType: 'FIRST_COME_FIRST_SERVED', status: 'ACTIVE' },
      { id: 'zone-003', floorId: 'flr-b1', name: 'Zone C - Visitor', spotCount: 30, poolType: 'VISITOR', status: 'ACTIVE' },
    ],
  },
  {
    id: 'flr-b2',
    parkingLocationId: 'pl-001',
    name: 'Basement 2',
    levelType: 'BASEMENT',
    levelNumber: -2,
    totalSpots: 150,
    vehicleTypesAllowed: ['FOUR_WHEELER'],
    heightRestrictionMeters: 2.1,
    status: 'ACTIVE',
    zones: [
      { id: 'zone-004', floorId: 'flr-b2', name: 'Zone A - TechCorp Reserved', spotCount: 80, poolType: 'RESERVABLE', tenantId: 'tenant-001', status: 'ACTIVE' },
      { id: 'zone-005', floorId: 'flr-b2', name: 'Zone B - FinanceHub Reserved', spotCount: 50, poolType: 'RESERVABLE', tenantId: 'tenant-002', status: 'ACTIVE' },
      { id: 'zone-006', floorId: 'flr-b2', name: 'Zone C - Shared', spotCount: 20, poolType: 'FIRST_COME_FIRST_SERVED', status: 'ACTIVE' },
    ],
  },
  {
    id: 'flr-surface',
    parkingLocationId: 'pl-001',
    name: 'Surface Parking',
    levelType: 'SURFACE',
    levelNumber: 0,
    totalSpots: 100,
    vehicleTypesAllowed: ['FOUR_WHEELER', 'TWO_WHEELER', 'HEAVY'],
    status: 'ACTIVE',
    zones: [
      { id: 'zone-007', floorId: 'flr-surface', name: 'Two-Wheeler Zone', spotCount: 60, poolType: 'FIRST_COME_FIRST_SERVED', status: 'ACTIVE' },
      { id: 'zone-008', floorId: 'flr-surface', name: 'Visitor Zone', spotCount: 30, poolType: 'VISITOR', status: 'ACTIVE' },
      { id: 'zone-009', floorId: 'flr-surface', name: 'Bus/Heavy Vehicles', spotCount: 10, poolType: 'RESERVABLE', status: 'INACTIVE' },
    ],
  },
];

const tenantNames: Record<string, string> = {
  'tenant-001': 'TechCorp Inc.',
  'tenant-002': 'FinanceHub Ltd.',
};

export function Zones() {
  const [expandedFloors, setExpandedFloors] = useState<string[]>(['flr-b1']);

  const toggleFloor = (floorId: string) => {
    setExpandedFloors((prev) =>
      prev.includes(floorId) ? prev.filter((id) => id !== floorId) : [...prev, floorId]
    );
  };

  const getPoolTypeBadge = (poolType: Zone['poolType']) => {
    const styles: Record<string, string> = {
      RESERVABLE: 'bg-blue-100 text-blue-800',
      FIRST_COME_FIRST_SERVED: 'bg-green-100 text-green-800',
      VISITOR: 'bg-purple-100 text-purple-800',
    };
    return (
      <span className={`badge ${styles[poolType]}`}>
        {poolType === 'FIRST_COME_FIRST_SERVED' ? 'FCFS' : poolType}
      </span>
    );
  };

  const totalSpots = mockFloors.reduce((sum, f) => sum + f.totalSpots, 0);
  const totalZones = mockFloors.reduce((sum, f) => sum + f.zones.length, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Zones & Spots</h1>
          <p className="text-gray-500 mt-1">Manage floors, zones, and parking spot configurations</p>
        </div>
        <div className="flex space-x-3">
          <button className="btn-secondary">
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Floor
          </button>
          <button className="btn-primary">
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Zone
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-2xl font-bold text-gray-900">{mockFloors.length}</p>
          <p className="text-sm text-gray-500">Floors</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-2xl font-bold text-gray-900">{totalZones}</p>
          <p className="text-sm text-gray-500">Zones</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-2xl font-bold text-gray-900">{totalSpots}</p>
          <p className="text-sm text-gray-500">Total Spots</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-2xl font-bold text-green-600">
            {mockFloors.filter((f) => f.status === 'ACTIVE').length}
          </p>
          <p className="text-sm text-gray-500">Active Floors</p>
        </div>
      </div>

      {/* Floor/Zone Tree */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Floor & Zone Hierarchy</h3>
        </div>

        <div className="divide-y divide-gray-100">
          {mockFloors.map((floor) => (
            <div key={floor.id}>
              {/* Floor Row */}
              <div
                className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                onClick={() => toggleFloor(floor.id)}
              >
                <div className="flex items-center space-x-3">
                  {expandedFloors.includes(floor.id) ? (
                    <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                  )}
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <MapPinIcon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{floor.name}</p>
                    <p className="text-sm text-gray-500">
                      Level {floor.levelNumber} | {floor.totalSpots} spots | {floor.zones.length} zones
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span
                    className={`badge ${floor.status === 'ACTIVE' ? 'badge-green' : 'badge-gray'}`}
                  >
                    {floor.status}
                  </span>
                  <div className="flex space-x-1">
                    {floor.vehicleTypesAllowed.map((type) => (
                      <span key={type} className="badge-gray text-xs">
                        {type === 'FOUR_WHEELER' ? '4W' : type === 'TWO_WHEELER' ? '2W' : 'H'}
                      </span>
                    ))}
                  </div>
                  <button
                    className="p-1 text-gray-400 hover:text-gray-600"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Zones */}
              {expandedFloors.includes(floor.id) && (
                <div className="bg-gray-50 border-t border-gray-100">
                  {floor.zones.map((zone) => (
                    <div
                      key={zone.id}
                      className="px-6 py-3 ml-10 flex items-center justify-between hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                        <div>
                          <p className="font-medium text-gray-800">{zone.name}</p>
                          <p className="text-sm text-gray-500">
                            {zone.spotCount} spots
                            {zone.tenantId && ` | ${tenantNames[zone.tenantId]}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {getPoolTypeBadge(zone.poolType)}
                        <span
                          className={`badge text-xs ${
                            zone.status === 'ACTIVE' ? 'badge-green' : 'badge-gray'
                          }`}
                        >
                          {zone.status}
                        </span>
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="px-6 py-2 ml-10">
                    <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                      + Add Zone to {floor.name}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Spot Configuration Help */}
      <div className="bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-blue-900 mb-2">About Spot Configuration</h3>
        <p className="text-sm text-blue-800">
          Each zone contains parking spots that can be configured individually. Spots can have different
          types (Standard, Compact, EV, Accessible), assignments (None, Permanent, Temporary), and states
          (Available, Reserved, Occupied, Blocked). Use the spot editor within each zone to manage
          individual spot configurations.
        </p>
      </div>
    </div>
  );
}
