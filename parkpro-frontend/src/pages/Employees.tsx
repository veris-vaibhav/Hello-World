import { useState, useEffect } from 'react';
import { PlusIcon, MagnifyingGlassIcon, PencilIcon, EyeIcon, TruckIcon } from '@heroicons/react/24/outline';
import type { Employee, EmployeeStatus } from '../types';

// Mock employee data
const mockEmployees: Employee[] = [
  {
    id: 'emp-001',
    tenantId: 'tenant-001',
    employeeCode: 'TC001',
    name: 'Rahul Sharma',
    department: 'Engineering',
    designation: 'Senior Manager',
    contact: { email: 'rahul.sharma@techcorp.com', phone: '+91-9876543210' },
    parkingPrivileges: {
      eligiblePools: ['pool-001', 'pool-002'],
      hasPermanentAssignment: true,
      permanentSpotId: 'spot-001',
      maxAdvanceBookingDays: 7,
      maxActiveBookings: 2,
    },
    vehicles: ['veh-001'],
    defaultVehicleId: 'veh-001',
    status: 'ACTIVE',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
  },
  {
    id: 'emp-002',
    tenantId: 'tenant-001',
    employeeCode: 'TC002',
    name: 'Priya Patel',
    department: 'Sales',
    designation: 'Sales Lead',
    contact: { email: 'priya.patel@techcorp.com', phone: '+91-9876543211' },
    parkingPrivileges: {
      eligiblePools: ['pool-002'],
      hasPermanentAssignment: false,
      maxAdvanceBookingDays: 5,
      maxActiveBookings: 1,
    },
    vehicles: ['veh-002'],
    defaultVehicleId: 'veh-002',
    status: 'ACTIVE',
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-02-01T10:00:00Z',
  },
  {
    id: 'emp-003',
    tenantId: 'tenant-001',
    employeeCode: 'TC003',
    name: 'Amit Kumar',
    department: 'Marketing',
    designation: 'Marketing Manager',
    contact: { email: 'amit.kumar@techcorp.com', phone: '+91-9876543212' },
    parkingPrivileges: {
      eligiblePools: ['pool-002'],
      hasPermanentAssignment: false,
      maxAdvanceBookingDays: 3,
      maxActiveBookings: 1,
    },
    vehicles: ['veh-003'],
    defaultVehicleId: 'veh-003',
    status: 'ACTIVE',
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-03-01T10:00:00Z',
  },
  {
    id: 'emp-004',
    tenantId: 'tenant-002',
    employeeCode: 'FH001',
    name: 'Sara Johnson',
    department: 'Finance',
    designation: 'Finance Controller',
    contact: { email: 'sara.johnson@financehub.com', phone: '+91-9876543213' },
    parkingPrivileges: {
      eligiblePools: ['pool-001'],
      hasPermanentAssignment: true,
      permanentSpotId: 'spot-050',
      maxAdvanceBookingDays: 7,
      maxActiveBookings: 2,
    },
    vehicles: ['veh-005'],
    defaultVehicleId: 'veh-005',
    status: 'ACTIVE',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'emp-005',
    tenantId: 'tenant-001',
    employeeCode: 'TC004',
    name: 'Vijay Mehta',
    department: 'HR',
    designation: 'HR Head',
    contact: { email: 'vijay.mehta@techcorp.com', phone: '+91-9876543214' },
    parkingPrivileges: {
      eligiblePools: ['pool-001', 'pool-002'],
      hasPermanentAssignment: false,
      maxAdvanceBookingDays: 5,
      maxActiveBookings: 2,
    },
    vehicles: [],
    status: 'SUSPENDED',
    createdAt: '2024-04-01T10:00:00Z',
    updatedAt: '2024-12-01T10:00:00Z',
  },
];

const tenantNames: Record<string, string> = {
  'tenant-001': 'TechCorp Inc.',
  'tenant-002': 'FinanceHub Ltd.',
};

export function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<EmployeeStatus | ''>('');
  const [isLoading, setIsLoading] = useState(true);

  const departments = ['Engineering', 'Sales', 'Marketing', 'Finance', 'HR'];

  useEffect(() => {
    setTimeout(() => {
      let filtered = [...mockEmployees];

      if (search) {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter(
          (e) =>
            e.name.toLowerCase().includes(searchLower) ||
            e.employeeCode.toLowerCase().includes(searchLower) ||
            e.contact.email.toLowerCase().includes(searchLower)
        );
      }

      if (departmentFilter) {
        filtered = filtered.filter((e) => e.department === departmentFilter);
      }

      if (statusFilter) {
        filtered = filtered.filter((e) => e.status === statusFilter);
      }

      setEmployees(filtered);
      setIsLoading(false);
    }, 300);
  }, [search, departmentFilter, statusFilter]);

  const getStatusBadge = (status: EmployeeStatus) => {
    const styles: Record<EmployeeStatus, string> = {
      ACTIVE: 'badge-green',
      INACTIVE: 'badge-gray',
      SUSPENDED: 'badge-red',
    };
    return <span className={styles[status]}>{status}</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee Directory</h1>
          <p className="text-gray-500 mt-1">Manage employee parking privileges and assignments</p>
        </div>
        <button className="btn-primary">
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Employee
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-2xl font-bold text-gray-900">{mockEmployees.length}</p>
          <p className="text-sm text-gray-500">Total Employees</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-2xl font-bold text-green-600">
            {mockEmployees.filter((e) => e.status === 'ACTIVE').length}
          </p>
          <p className="text-sm text-gray-500">Active</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-2xl font-bold text-blue-600">
            {mockEmployees.filter((e) => e.parkingPrivileges.hasPermanentAssignment).length}
          </p>
          <p className="text-sm text-gray-500">Permanent Spots</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-2xl font-bold text-orange-600">
            {mockEmployees.filter((e) => e.vehicles.length > 0).length}
          </p>
          <p className="text-sm text-gray-500">With Vehicles</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, employee code, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="input w-40"
        >
          <option value="">All Departments</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as EmployeeStatus | '')}
          className="input w-40"
        >
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="SUSPENDED">Suspended</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-500">Loading employees...</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Tenant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Parking
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Vehicles
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
              {employees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-700 font-medium">
                          {employee.name.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">{employee.name}</p>
                        <p className="text-sm text-gray-500">{employee.employeeCode}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-900">{employee.department}</p>
                    <p className="text-sm text-gray-500">{employee.designation}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-900">{tenantNames[employee.tenantId]}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {employee.parkingPrivileges.hasPermanentAssignment ? (
                      <span className="badge-blue">Permanent - {employee.parkingPrivileges.permanentSpotId}</span>
                    ) : (
                      <span className="badge-gray">Pool Access</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <TruckIcon className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-900">{employee.vehicles.length}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(employee.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-1 text-gray-400 hover:text-gray-600" title="View">
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600" title="Edit">
                        <PencilIcon className="h-5 w-5" />
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
