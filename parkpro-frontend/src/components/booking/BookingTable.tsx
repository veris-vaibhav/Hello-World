import { EyeIcon, XMarkIcon, CheckIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import type { Booking } from '../../types';
import { useBookingStore } from '../../store';

interface BookingTableProps {
  bookings: Booking[];
  isLoading: boolean;
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
}

export function BookingTable({ bookings, isLoading, pagination, onPageChange }: BookingTableProps) {
  const { cancelBooking, checkIn, checkOut } = useBookingStore();

  const getStatusBadge = (status: Booking['status']) => {
    const styles: Record<string, string> = {
      PENDING: 'bg-gray-100 text-gray-800',
      CONFIRMED: 'bg-blue-100 text-blue-800',
      CHECKED_IN: 'bg-green-100 text-green-800',
      COMPLETED: 'bg-purple-100 text-purple-800',
      CANCELLED: 'bg-red-100 text-red-800',
      NO_SHOW: 'bg-orange-100 text-orange-800',
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // Mock employee and vehicle data for display
  const getEmployeeName = (employeeId: string) => {
    const names = ['Rahul Sharma', 'Priya Patel', 'Amit Kumar', 'Sara Johnson', 'Vijay Mehta'];
    const index = parseInt(employeeId.replace('emp-', '')) % names.length;
    return names[index];
  };

  const getVehicleNumber = (vehicleId: string) => {
    const prefix = ['HR26DK', 'DL01AB', 'MH12CD', 'KA05EF', 'TN09GH'];
    const index = parseInt(vehicleId.replace('veh-', '')) % prefix.length;
    return `${prefix[index]}${1000 + parseInt(vehicleId.replace('veh-', ''))}`;
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
        <p className="mt-2 text-gray-500">Loading bookings...</p>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">No bookings found</p>
      </div>
    );
  }

  return (
    <div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Booking ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Employee
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Vehicle
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date & Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Spot
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {bookings.map((booking) => (
            <tr key={booking.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm font-medium text-gray-900">{booking.id.toUpperCase()}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {getEmployeeName(booking.employeeId)}
                  </p>
                  <p className="text-sm text-gray-500">{booking.employeeId}</p>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm font-mono text-gray-900">
                  {getVehicleNumber(booking.vehicleId)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <p className="text-sm text-gray-900">{formatDate(booking.timing.date)}</p>
                  <p className="text-sm text-gray-500">
                    {booking.timing.startTime} - {booking.timing.endTime}
                  </p>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {booking.allocation.spotAssigned ? (
                  <span className="text-sm font-medium text-gray-900">
                    {booking.allocation.spotAssigned}
                  </span>
                ) : (
                  <span className="text-sm text-gray-400 italic">At entry</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(booking.status)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className="flex items-center justify-end space-x-2">
                  <button
                    className="p-1 text-gray-400 hover:text-gray-600"
                    title="View Details"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </button>
                  {booking.status === 'CONFIRMED' && (
                    <>
                      <button
                        onClick={() => checkIn(booking.id, 'MANUAL', 'gate-001')}
                        className="p-1 text-green-500 hover:text-green-700"
                        title="Check In"
                      >
                        <CheckIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => cancelBooking(booking.id)}
                        className="p-1 text-red-500 hover:text-red-700"
                        title="Cancel"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </>
                  )}
                  {booking.status === 'CHECKED_IN' && (
                    <button
                      onClick={() => checkOut(booking.id, 'gate-001')}
                      className="p-1 text-blue-500 hover:text-blue-700"
                      title="Check Out"
                    >
                      <ArrowRightIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing {(pagination.page - 1) * pagination.pageSize + 1} to{' '}
          {Math.min(pagination.page * pagination.pageSize, pagination.totalItems)} of{' '}
          {pagination.totalItems} bookings
        </p>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => i + 1).map(
            (page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-3 py-1 border rounded-md text-sm ${
                  page === pagination.page
                    ? 'bg-primary-500 text-white border-primary-500'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            )
          )}
          <button
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
