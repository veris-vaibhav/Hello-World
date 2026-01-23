import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, CheckIcon, XMarkIcon, EyeIcon } from '@heroicons/react/24/outline';
import { useExceptionStore } from '../store';
import type { ExceptionStatus, ExceptionSeverity, ExceptionType } from '../types';

export function Exceptions() {
  const { exceptions, fetchExceptions, resolveException, dismissException, isLoading } = useExceptionStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ExceptionStatus | ''>('');
  const [severityFilter, setSeverityFilter] = useState<ExceptionSeverity | ''>('');
  const [typeFilter, setTypeFilter] = useState<ExceptionType | ''>('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [resolution, setResolution] = useState('');

  useEffect(() => {
    fetchExceptions();
  }, []);

  const filteredExceptions = exceptions.filter((e) => {
    if (search) {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        e.vehicleNumber?.toLowerCase().includes(searchLower) ||
        e.description.toLowerCase().includes(searchLower) ||
        e.type.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }
    if (statusFilter && e.status !== statusFilter) return false;
    if (severityFilter && e.severity !== severityFilter) return false;
    if (typeFilter && e.type !== typeFilter) return false;
    return true;
  });

  const getSeverityBadge = (severity: ExceptionSeverity) => {
    const styles: Record<ExceptionSeverity, string> = {
      LOW: 'bg-blue-100 text-blue-800',
      MEDIUM: 'bg-yellow-100 text-yellow-800',
      HIGH: 'bg-orange-100 text-orange-800',
      CRITICAL: 'bg-red-100 text-red-800',
    };
    return <span className={`badge ${styles[severity]}`}>{severity}</span>;
  };

  const getStatusBadge = (status: ExceptionStatus) => {
    const styles: Record<ExceptionStatus, string> = {
      OPEN: 'badge-red',
      IN_PROGRESS: 'badge-yellow',
      RESOLVED: 'badge-green',
      DISMISSED: 'badge-gray',
    };
    return <span className={styles[status]}>{status.replace('_', ' ')}</span>;
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`;
    return date.toLocaleDateString();
  };

  const handleResolve = async (id: string) => {
    if (!resolution.trim()) {
      alert('Please enter a resolution');
      return;
    }
    await resolveException(id, resolution);
    setSelectedId(null);
    setResolution('');
  };

  const stats = {
    open: exceptions.filter((e) => e.status === 'OPEN').length,
    inProgress: exceptions.filter((e) => e.status === 'IN_PROGRESS').length,
    critical: exceptions.filter((e) => e.severity === 'CRITICAL' && e.status === 'OPEN').length,
    resolved: exceptions.filter((e) => e.status === 'RESOLVED').length,
  };

  const exceptionTypes: ExceptionType[] = [
    'UNKNOWN_VEHICLE',
    'EXIT_WITHOUT_ENTRY',
    'ENTRY_WITHOUT_EXIT',
    'ANTI_PASSBACK_VIOLATION',
    'VEHICLE_MISMATCH',
    'CAPACITY_BREACH',
    'BOOKING_NO_SHOW',
    'OVERSTAY',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Exception Management</h1>
          <p className="text-gray-500 mt-1">Monitor and resolve parking exceptions</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-red-500">
          <p className="text-2xl font-bold text-red-600">{stats.open}</p>
          <p className="text-sm text-gray-500">Open</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-yellow-500">
          <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
          <p className="text-sm text-gray-500">In Progress</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-orange-500">
          <p className="text-2xl font-bold text-orange-600">{stats.critical}</p>
          <p className="text-sm text-gray-500">Critical</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
          <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
          <p className="text-sm text-gray-500">Resolved Today</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px] relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by vehicle number or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ExceptionStatus | '')}
          className="input w-36"
        >
          <option value="">All Status</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="DISMISSED">Dismissed</option>
        </select>
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value as ExceptionSeverity | '')}
          className="input w-36"
        >
          <option value="">All Severity</option>
          <option value="CRITICAL">Critical</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as ExceptionType | '')}
          className="input w-48"
        >
          <option value="">All Types</option>
          {exceptionTypes.map((type) => (
            <option key={type} value={type}>
              {type.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
      </div>

      {/* Exceptions List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-500">Loading exceptions...</p>
          </div>
        ) : filteredExceptions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No exceptions found</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredExceptions.map((exception) => (
              <div key={exception.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getSeverityBadge(exception.severity)}
                      {getStatusBadge(exception.status)}
                      <span className="text-sm text-gray-500">{exception.id}</span>
                    </div>
                    <h4 className="font-semibold text-gray-900">
                      {exception.type.replace(/_/g, ' ')}
                      {exception.vehicleNumber && (
                        <span className="ml-2 font-mono text-sm bg-gray-100 px-2 py-0.5 rounded">
                          {exception.vehicleNumber}
                        </span>
                      )}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">{exception.description}</p>
                    {exception.autoAction && (
                      <p className="text-xs text-gray-400 mt-1">
                        Auto action: {exception.autoAction}
                      </p>
                    )}
                    {exception.resolution && (
                      <p className="text-sm text-green-600 mt-2">
                        Resolution: {exception.resolution}
                      </p>
                    )}
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-sm text-gray-500">{formatTime(exception.createdAt)}</p>
                    {(exception.status === 'OPEN' || exception.status === 'IN_PROGRESS') && (
                      <div className="mt-2 flex space-x-2">
                        <button
                          onClick={() => setSelectedId(exception.id)}
                          className="p-1 text-green-500 hover:text-green-700"
                          title="Resolve"
                        >
                          <CheckIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => dismissException(exception.id)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                          title="Dismiss"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                        <button
                          className="p-1 text-gray-400 hover:text-gray-600"
                          title="View Details"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Resolution Form */}
                {selectedId === exception.id && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <label className="label mb-2">Resolution</label>
                    <textarea
                      value={resolution}
                      onChange={(e) => setResolution(e.target.value)}
                      placeholder="Enter resolution details..."
                      className="input w-full h-20"
                    />
                    <div className="mt-2 flex space-x-2">
                      <button
                        onClick={() => handleResolve(exception.id)}
                        className="btn-primary text-sm"
                      >
                        Resolve
                      </button>
                      <button
                        onClick={() => {
                          setSelectedId(null);
                          setResolution('');
                        }}
                        className="btn-secondary text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
