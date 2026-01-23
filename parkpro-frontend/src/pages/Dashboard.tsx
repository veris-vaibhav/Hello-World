import { useEffect } from 'react';
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  TruckIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import { useOccupancyStore, useExceptionStore, useBookingStore } from '../store';
import { OccupancyChart } from '../components/dashboard/OccupancyChart';
import { FloorOccupancyGrid } from '../components/dashboard/FloorOccupancyGrid';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { ExceptionAlert } from '../components/dashboard/ExceptionAlert';

export function Dashboard() {
  const { occupancy, fetchOccupancy } = useOccupancyStore();
  const { exceptions, fetchExceptions } = useExceptionStore();
  const { bookings, fetchBookings } = useBookingStore();

  useEffect(() => {
    fetchOccupancy('pl-001');
    fetchExceptions();
    fetchBookings({ page: 1, pageSize: 5, status: 'CONFIRMED' });

    // Refresh occupancy every 30 seconds
    const interval = setInterval(() => {
      fetchOccupancy('pl-001');
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const openExceptions = exceptions.filter((e) => e.status === 'OPEN' || e.status === 'IN_PROGRESS');

  const stats = [
    {
      name: 'Total Occupancy',
      value: occupancy?.summary.totalOccupied || 0,
      total: occupancy?.summary.totalCapacity || 0,
      change: '+12',
      changeType: 'increase',
      icon: TruckIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Available Spots',
      value: occupancy?.summary.totalAvailable || 0,
      percentage: `${((occupancy?.summary.totalAvailable || 0) / (occupancy?.summary.totalCapacity || 1) * 100).toFixed(1)}%`,
      changeType: 'neutral',
      icon: TruckIcon,
      color: 'bg-green-500',
    },
    {
      name: 'Active Exceptions',
      value: openExceptions.length,
      change: openExceptions.filter((e) => e.severity === 'HIGH' || e.severity === 'CRITICAL').length + ' critical',
      changeType: openExceptions.length > 5 ? 'increase' : 'neutral',
      icon: ExclamationTriangleIcon,
      color: 'bg-orange-500',
    },
    {
      name: "Today's Bookings",
      value: bookings.filter((b) => b.timing.date === new Date().toISOString().split('T')[0]).length,
      change: 'confirmed',
      changeType: 'neutral',
      icon: ClockIcon,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Real-time parking overview for Tower A</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span>Live</span>
          <span className="text-gray-300">|</span>
          <span>Last updated: {new Date(occupancy?.timestamp || '').toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <span
                className={`inline-flex items-center text-sm font-medium ${
                  stat.changeType === 'increase'
                    ? 'text-red-600'
                    : stat.changeType === 'decrease'
                    ? 'text-green-600'
                    : 'text-gray-500'
                }`}
              >
                {stat.changeType === 'increase' && <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />}
                {stat.changeType === 'decrease' && <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />}
                {stat.change || stat.percentage}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-gray-900">
                {stat.value}
                {stat.total && <span className="text-lg font-normal text-gray-400">/{stat.total}</span>}
              </p>
              <p className="text-sm text-gray-500 mt-1">{stat.name}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Exception Alerts */}
      {openExceptions.filter((e) => e.severity === 'HIGH' || e.severity === 'CRITICAL').length > 0 && (
        <div className="space-y-3">
          {openExceptions
            .filter((e) => e.severity === 'HIGH' || e.severity === 'CRITICAL')
            .slice(0, 3)
            .map((exception) => (
              <ExceptionAlert key={exception.id} exception={exception} />
            ))}
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Occupancy Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Occupancy Trend</h3>
          <OccupancyChart />
        </div>

        {/* Tenant Breakdown */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tenant Occupancy</h3>
          <div className="space-y-4">
            {occupancy?.byTenant.map((tenant) => (
              <div key={tenant.tenantId}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{tenant.name}</span>
                  <span className="text-sm text-gray-500">
                    {tenant.occupied}/{tenant.quota}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      (tenant.occupied / tenant.quota) * 100 > 90
                        ? 'bg-red-500'
                        : (tenant.occupied / tenant.quota) * 100 > 70
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${(tenant.occupied / tenant.quota) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floor Occupancy & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Floor Occupancy */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Floor-wise Occupancy</h3>
          <FloorOccupancyGrid floors={occupancy?.byFloor || []} />
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <RecentActivity />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-left">
            <TruckIcon className="h-6 w-6 text-primary-600 mb-2" />
            <p className="font-medium text-gray-900">Manual Entry</p>
            <p className="text-sm text-gray-500">Register vehicle entry</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-left">
            <ClockIcon className="h-6 w-6 text-primary-600 mb-2" />
            <p className="font-medium text-gray-900">New Booking</p>
            <p className="text-sm text-gray-500">Create parking booking</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-left">
            <UsersIcon className="h-6 w-6 text-primary-600 mb-2" />
            <p className="font-medium text-gray-900">Visitor Pass</p>
            <p className="text-sm text-gray-500">Register visitor vehicle</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-left">
            <ExclamationTriangleIcon className="h-6 w-6 text-primary-600 mb-2" />
            <p className="font-medium text-gray-900">Report Issue</p>
            <p className="text-sm text-gray-500">Log parking exception</p>
          </button>
        </div>
      </div>
    </div>
  );
}
