import { useEffect, useState } from 'react';
import { PlusIcon, FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useBookingStore } from '../store';
import type { BookingStatus } from '../types';
import { BookingTable } from '../components/booking/BookingTable';
import { BookingModal } from '../components/booking/BookingModal';
import { BookingFilters } from '../components/booking/BookingFilters';

export function Bookings() {
  const { bookings, pagination, isLoading, fetchBookings } = useBookingStore();
  const [showModal, setShowModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<BookingStatus | ''>('');
  const [dateFilter, setDateFilter] = useState<{ start: string; end: string }>({
    start: '',
    end: '',
  });

  useEffect(() => {
    fetchBookings({
      page: 1,
      pageSize: 10,
      search: search || undefined,
      status: statusFilter || undefined,
      startDate: dateFilter.start || undefined,
      endDate: dateFilter.end || undefined,
    });
  }, [search, statusFilter, dateFilter]);

  const handlePageChange = (page: number) => {
    fetchBookings({
      page,
      pageSize: pagination.pageSize,
      search: search || undefined,
      status: statusFilter || undefined,
      startDate: dateFilter.start || undefined,
      endDate: dateFilter.end || undefined,
    });
  };

  const statusCounts = {
    all: pagination.totalItems,
    confirmed: bookings.filter((b) => b.status === 'CONFIRMED').length,
    checkedIn: bookings.filter((b) => b.status === 'CHECKED_IN').length,
    completed: bookings.filter((b) => b.status === 'COMPLETED').length,
    cancelled: bookings.filter((b) => b.status === 'CANCELLED').length,
    noShow: bookings.filter((b) => b.status === 'NO_SHOW').length,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
          <p className="text-gray-500 mt-1">Manage parking reservations and allocations</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <PlusIcon className="h-5 w-5 mr-2" />
          New Booking
        </button>
      </div>

      {/* Status Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { key: '', label: 'All', count: statusCounts.all },
            { key: 'CONFIRMED', label: 'Confirmed', count: statusCounts.confirmed },
            { key: 'CHECKED_IN', label: 'Checked In', count: statusCounts.checkedIn },
            { key: 'COMPLETED', label: 'Completed', count: statusCounts.completed },
            { key: 'CANCELLED', label: 'Cancelled', count: statusCounts.cancelled },
            { key: 'NO_SHOW', label: 'No Show', count: statusCounts.noShow },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key as BookingStatus | '')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                statusFilter === tab.key
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              <span
                className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                  statusFilter === tab.key
                    ? 'bg-primary-100 text-primary-600'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by booking ID, employee, vehicle..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`btn-secondary ${showFilters ? 'bg-gray-100' : ''}`}
        >
          <FunnelIcon className="h-5 w-5 mr-2" />
          Filters
        </button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <BookingFilters
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
          onReset={() => {
            setDateFilter({ start: '', end: '' });
            setStatusFilter('');
            setSearch('');
          }}
        />
      )}

      {/* Bookings Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <BookingTable
          bookings={bookings}
          isLoading={isLoading}
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Create Booking Modal */}
      {showModal && (
        <BookingModal
          onClose={() => setShowModal(false)}
          onSubmit={async (_booking) => {
            // Handle booking creation
            setShowModal(false);
            fetchBookings({ page: 1, pageSize: 10 });
          }}
        />
      )}
    </div>
  );
}
