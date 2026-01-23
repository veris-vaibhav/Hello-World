import { useState, useEffect } from 'react';
import { PlusIcon, MagnifyingGlassIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import type { Vehicle, VehicleStatus } from '../types';

// Mock vehicle data
const mockVehicles: Vehicle[] = [
  {
    id: 'veh-001',
    registrationNumber: 'HR26DK1234',
    registrationState: 'HR',
    vehicleType: 'FOUR_WHEELER',
    vehicleCategory: 'CAR',
    plateType: 'WHITE',
    make: 'Honda',
    model: 'City',
    color: 'White',
    ownership: { type: 'PERSONAL', primaryOwnerId: 'emp-001', authorizedUsers: ['emp-001'] },
    verification: { rcVerified: true, insuranceValidUntil: '2025-12-31', pucValidUntil: '2025-06-30' },
    validity: { isTemporary: false },
    status: 'ACTIVE',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'veh-002',
    registrationNumber: 'DL01AB5678',
    registrationState: 'DL',
    vehicleType: 'FOUR_WHEELER',
    vehicleCategory: 'SUV',
    plateType: 'WHITE',
    make: 'Toyota',
    model: 'Fortuner',
    color: 'Black',
    ownership: { type: 'PERSONAL', primaryOwnerId: 'emp-002', authorizedUsers: ['emp-002'] },
    verification: { rcVerified: true, insuranceValidUntil: '2025-08-15', pucValidUntil: '2025-04-20' },
    validity: { isTemporary: false },
    status: 'ACTIVE',
    createdAt: '2024-02-10T10:00:00Z',
    updatedAt: '2024-02-10T10:00:00Z',
  },
  {
    id: 'veh-003',
    registrationNumber: 'MH12CD9012',
    registrationState: 'MH',
    vehicleType: 'TWO_WHEELER',
    vehicleCategory: 'BIKE',
    plateType: 'WHITE',
    make: 'Royal Enfield',
    model: 'Classic 350',
    color: 'Gunmetal Grey',
    ownership: { type: 'PERSONAL', primaryOwnerId: 'emp-003', authorizedUsers: ['emp-003'] },
    verification: { rcVerified: true, insuranceValidUntil: '2025-05-31', pucValidUntil: '2025-03-15' },
    validity: { isTemporary: false },
    status: 'ACTIVE',
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-03-01T10:00:00Z',
  },
  {
    id: 'veh-004',
    registrationNumber: 'KA05EF3456',
    registrationState: 'KA',
    vehicleType: 'FOUR_WHEELER',
    vehicleCategory: 'CAR',
    plateType: 'WHITE',
    make: 'Maruti',
    model: 'Swift',
    color: 'Red',
    ownership: { type: 'COMPANY_POOL', authorizedUsers: ['emp-001', 'emp-002', 'emp-003'] },
    verification: { rcVerified: true, insuranceValidUntil: '2025-11-30', pucValidUntil: '2025-08-10' },
    validity: { isTemporary: false },
    status: 'ACTIVE',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
  },
  {
    id: 'veh-005',
    registrationNumber: 'TN09GH7890',
    registrationState: 'TN',
    vehicleType: 'FOUR_WHEELER',
    vehicleCategory: 'CAR',
    plateType: 'YELLOW',
    make: 'Hyundai',
    model: 'Verna',
    color: 'Silver',
    ownership: { type: 'RENTAL', primaryOwnerId: 'emp-005', authorizedUsers: ['emp-005'] },
    verification: { rcVerified: false },
    validity: { isTemporary: true, validFrom: '2025-01-01', validUntil: '2025-03-31' },
    status: 'ACTIVE',
    createdAt: '2025-01-01T10:00:00Z',
    updatedAt: '2025-01-01T10:00:00Z',
  },
  {
    id: 'veh-006',
    registrationNumber: 'HR26XY9999',
    registrationState: 'HR',
    vehicleType: 'FOUR_WHEELER',
    vehicleCategory: 'CAR',
    plateType: 'WHITE',
    make: 'Tata',
    model: 'Nexon',
    color: 'Blue',
    ownership: { type: 'PERSONAL', primaryOwnerId: 'emp-010', authorizedUsers: ['emp-010'] },
    verification: { rcVerified: true },
    validity: { isTemporary: false },
    status: 'BLACKLISTED',
    createdAt: '2024-06-15T10:00:00Z',
    updatedAt: '2024-12-01T10:00:00Z',
  },
];

const employeeNames: Record<string, string> = {
  'emp-001': 'Rahul Sharma',
  'emp-002': 'Priya Patel',
  'emp-003': 'Amit Kumar',
  'emp-005': 'Sara Johnson',
  'emp-010': 'Vijay Mehta',
};

export function Vehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<VehicleStatus | ''>('');
  const [typeFilter, setTypeFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      let filtered = [...mockVehicles];

      if (search) {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter(
          (v) =>
            v.registrationNumber.toLowerCase().includes(searchLower) ||
            v.make.toLowerCase().includes(searchLower) ||
            v.model.toLowerCase().includes(searchLower)
        );
      }

      if (statusFilter) {
        filtered = filtered.filter((v) => v.status === statusFilter);
      }

      if (typeFilter) {
        filtered = filtered.filter((v) => v.vehicleType === typeFilter);
      }

      setVehicles(filtered);
      setIsLoading(false);
    }, 300);
  }, [search, statusFilter, typeFilter]);

  const getStatusBadge = (status: VehicleStatus) => {
    const styles: Record<VehicleStatus, string> = {
      ACTIVE: 'badge-green',
      INACTIVE: 'badge-gray',
      BLACKLISTED: 'badge-red',
    };
    return <span className={styles[status]}>{status}</span>;
  };

  const getOwnershipBadge = (type: string) => {
    const styles: Record<string, string> = {
      PERSONAL: 'badge-blue',
      COMPANY_POOL: 'badge bg-purple-100 text-purple-800',
      RENTAL: 'badge-yellow',
      VISITOR: 'badge-gray',
    };
    return <span className={styles[type] || 'badge-gray'}>{type.replace('_', ' ')}</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vehicle Registry</h1>
          <p className="text-gray-500 mt-1">Manage registered vehicles and their documents</p>
        </div>
        <button className="btn-primary">
          <PlusIcon className="h-5 w-5 mr-2" />
          Register Vehicle
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-2xl font-bold text-gray-900">{mockVehicles.length}</p>
          <p className="text-sm text-gray-500">Total Vehicles</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-2xl font-bold text-green-600">
            {mockVehicles.filter((v) => v.status === 'ACTIVE').length}
          </p>
          <p className="text-sm text-gray-500">Active</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-2xl font-bold text-blue-600">
            {mockVehicles.filter((v) => v.vehicleType === 'FOUR_WHEELER').length}
          </p>
          <p className="text-sm text-gray-500">Four Wheelers</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-2xl font-bold text-orange-600">
            {mockVehicles.filter((v) => v.vehicleType === 'TWO_WHEELER').length}
          </p>
          <p className="text-sm text-gray-500">Two Wheelers</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by registration number, make, or model..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as VehicleStatus | '')}
          className="input w-40"
        >
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="BLACKLISTED">Blacklisted</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="input w-40"
        >
          <option value="">All Types</option>
          <option value="FOUR_WHEELER">Four Wheeler</option>
          <option value="TWO_WHEELER">Two Wheeler</option>
          <option value="HEAVY">Heavy</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-500">Loading vehicles...</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Owner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Ownership
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Documents
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {vehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-mono font-semibold text-gray-900">
                        {vehicle.registrationNumber}
                      </p>
                      <p className="text-sm text-gray-500">
                        {vehicle.make} {vehicle.model} - {vehicle.color}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-900">
                      {vehicle.ownership.primaryOwnerId
                        ? employeeNames[vehicle.ownership.primaryOwnerId] || vehicle.ownership.primaryOwnerId
                        : 'Pool Vehicle'}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-900">{vehicle.vehicleCategory}</p>
                    <p className="text-xs text-gray-500">{vehicle.vehicleType.replace('_', ' ')}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getOwnershipBadge(vehicle.ownership.type)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          vehicle.verification.rcVerified ? 'bg-green-500' : 'bg-red-500'
                        }`}
                        title={vehicle.verification.rcVerified ? 'RC Verified' : 'RC Not Verified'}
                      ></span>
                      <span className="text-sm text-gray-500">
                        {vehicle.verification.rcVerified ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(vehicle.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-1 text-gray-400 hover:text-gray-600" title="View">
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600" title="Edit">
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button className="p-1 text-red-400 hover:text-red-600" title="Delete">
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
