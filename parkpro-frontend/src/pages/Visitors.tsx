import { useState, useEffect } from 'react';
import { PlusIcon, MagnifyingGlassIcon, CheckIcon, XMarkIcon, EyeIcon } from '@heroicons/react/24/outline';
import type { VisitorParkingBooking, VisitorParkingStatus } from '../types';

// Mock visitor parking data
const mockVisitorBookings: VisitorParkingBooking[] = [
  {
    id: 'vpb-001',
    tenantId: 'tenant-001',
    visitor: {
      name: 'Ankit Verma',
      phone: '+91-9988776655',
      email: 'ankit.verma@external.com',
      company: 'Consulting Partners',
      vehicleNumber: 'DL08AB1234',
      vehicleType: 'FOUR_WHEELER',
    },
    host: {
      employeeId: 'emp-001',
      name: 'Rahul Sharma',
      department: 'Engineering',
    },
    visitDetails: {
      purpose: 'Project Discussion',
      expectedArrival: new Date().toISOString(),
      expectedDeparture: new Date(Date.now() + 4 * 3600000).toISOString(),
    },
    parkingAllocation: {
      poolId: 'pool-003',
      allocationType: 'AT_ENTRY',
    },
    status: 'INVITED',
    validation: {
      isValidated: false,
    },
    createdVia: 'VMS_INTEGRATION',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'vpb-002',
    tenantId: 'tenant-001',
    visitor: {
      name: 'Sneha Kapoor',
      phone: '+91-9988776644',
      email: 'sneha@vendor.com',
      company: 'Tech Vendors Ltd',
      vehicleNumber: 'HR26DQ5678',
      vehicleType: 'FOUR_WHEELER',
    },
    host: {
      employeeId: 'emp-002',
      name: 'Priya Patel',
      department: 'Sales',
    },
    visitDetails: {
      purpose: 'Product Demo',
      expectedArrival: new Date(Date.now() - 3600000).toISOString(),
      expectedDeparture: new Date(Date.now() + 2 * 3600000).toISOString(),
    },
    parkingAllocation: {
      poolId: 'pool-003',
      spotAssigned: 'spot-v01',
      allocationType: 'AT_ENTRY',
    },
    status: 'CHECKED_IN',
    validation: {
      isValidated: true,
      validatedBy: 'emp-002',
      validatedAt: new Date(Date.now() - 3000000).toISOString(),
    },
    createdVia: 'MANUAL',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'vpb-003',
    tenantId: 'tenant-002',
    visitor: {
      name: 'Rajesh Kumar',
      phone: '+91-9988776633',
      company: 'Audit Firm',
      vehicleNumber: 'KA01MN9012',
      vehicleType: 'FOUR_WHEELER',
    },
    host: {
      employeeId: 'emp-004',
      name: 'Sara Johnson',
      department: 'Finance',
    },
    visitDetails: {
      purpose: 'Quarterly Audit',
      expectedArrival: new Date(Date.now() - 7200000).toISOString(),
      expectedDeparture: new Date(Date.now() - 3600000).toISOString(),
    },
    parkingAllocation: {
      poolId: 'pool-003',
      spotAssigned: 'spot-v02',
      allocationType: 'AT_ENTRY',
    },
    status: 'CHECKED_OUT',
    validation: {
      isValidated: true,
      validatedBy: 'emp-004',
      validatedAt: new Date(Date.now() - 6000000).toISOString(),
    },
    createdVia: 'VMS_INTEGRATION',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'vpb-004',
    tenantId: 'tenant-001',
    visitor: {
      name: 'Meera Singh',
      phone: '+91-9988776622',
      company: 'HR Solutions',
      vehicleNumber: 'MH12XY3456',
      vehicleType: 'FOUR_WHEELER',
    },
    host: {
      employeeId: 'emp-005',
      name: 'Vijay Mehta',
      department: 'HR',
    },
    visitDetails: {
      purpose: 'Interview',
      expectedArrival: new Date(Date.now() - 86400000).toISOString(),
      expectedDeparture: new Date(Date.now() - 82800000).toISOString(),
    },
    parkingAllocation: {
      poolId: 'pool-003',
      allocationType: 'AT_ENTRY',
    },
    status: 'NO_SHOW',
    validation: {
      isValidated: false,
    },
    createdVia: 'MANUAL',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

export function Visitors() {
  const [visitors, setVisitors] = useState<VisitorParkingBooking[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<VisitorParkingStatus | ''>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      let filtered = [...mockVisitorBookings];

      if (search) {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter(
          (v) =>
            v.visitor.name.toLowerCase().includes(searchLower) ||
            v.visitor.vehicleNumber.toLowerCase().includes(searchLower) ||
            v.host.name.toLowerCase().includes(searchLower)
        );
      }

      if (statusFilter) {
        filtered = filtered.filter((v) => v.status === statusFilter);
      }

      setVisitors(filtered);
      setIsLoading(false);
    }, 300);
  }, [search, statusFilter]);

  const getStatusBadge = (status: VisitorParkingStatus) => {
    const styles: Record<VisitorParkingStatus, string> = {
      INVITED: 'badge-blue',
      CHECKED_IN: 'badge-green',
      CHECKED_OUT: 'badge-gray',
      CANCELLED: 'badge-red',
      NO_SHOW: 'badge-yellow',
    };
    return <span className={styles[status]}>{status.replace('_', ' ')}</span>;
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Visitor Parking</h1>
          <p className="text-gray-500 mt-1">Manage visitor parking passes and allocations</p>
        </div>
        <button className="btn-primary">
          <PlusIcon className="h-5 w-5 mr-2" />
          Register Visitor
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-2xl font-bold text-blue-600">
            {mockVisitorBookings.filter((v) => v.status === 'INVITED').length}
          </p>
          <p className="text-sm text-gray-500">Expected Today</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-2xl font-bold text-green-600">
            {mockVisitorBookings.filter((v) => v.status === 'CHECKED_IN').length}
          </p>
          <p className="text-sm text-gray-500">Currently Parked</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-2xl font-bold text-gray-600">
            {mockVisitorBookings.filter((v) => v.status === 'CHECKED_OUT').length}
          </p>
          <p className="text-sm text-gray-500">Checked Out</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-2xl font-bold text-orange-600">
            {mockVisitorBookings.filter((v) => !v.validation.isValidated && v.status === 'CHECKED_IN').length}
          </p>
          <p className="text-sm text-gray-500">Pending Validation</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by visitor name, vehicle, or host..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as VisitorParkingStatus | '')}
          className="input w-40"
        >
          <option value="">All Status</option>
          <option value="INVITED">Invited</option>
          <option value="CHECKED_IN">Checked In</option>
          <option value="CHECKED_OUT">Checked Out</option>
          <option value="NO_SHOW">No Show</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-500">Loading visitors...</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Visitor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Host
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Visit Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Spot
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
              {visitors.map((visitor) => (
                <tr key={visitor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{visitor.visitor.name}</p>
                      <p className="text-sm text-gray-500">{visitor.visitor.company}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-mono text-gray-900">{visitor.visitor.vehicleNumber}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm text-gray-900">{visitor.host.name}</p>
                      <p className="text-sm text-gray-500">{visitor.host.department}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm text-gray-900">
                        {formatDate(visitor.visitDetails.expectedArrival)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatTime(visitor.visitDetails.expectedArrival)} -{' '}
                        {formatTime(visitor.visitDetails.expectedDeparture)}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {visitor.parkingAllocation.spotAssigned ? (
                      <span className="text-sm font-medium text-gray-900">
                        {visitor.parkingAllocation.spotAssigned}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400 italic">At entry</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(visitor.status)}
                      {visitor.status === 'CHECKED_IN' && !visitor.validation.isValidated && (
                        <span className="badge-yellow text-xs">Unvalidated</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-1 text-gray-400 hover:text-gray-600" title="View">
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      {visitor.status === 'INVITED' && (
                        <button className="p-1 text-green-500 hover:text-green-700" title="Check In">
                          <CheckIcon className="h-5 w-5" />
                        </button>
                      )}
                      {visitor.status === 'INVITED' && (
                        <button className="p-1 text-red-500 hover:text-red-700" title="Cancel">
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      )}
                      {visitor.status === 'CHECKED_IN' && !visitor.validation.isValidated && (
                        <button className="btn-primary text-xs py-1 px-2">Validate</button>
                      )}
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
