import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { Booking } from '../../types';

interface BookingModalProps {
  onClose: () => void;
  onSubmit: (booking: Partial<Booking>) => Promise<void>;
  initialData?: Booking;
}

export function BookingModal({ onClose, onSubmit, initialData }: BookingModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: initialData?.employeeId || '',
    vehicleId: initialData?.vehicleId || '',
    date: initialData?.timing.date || new Date().toISOString().split('T')[0],
    shift: initialData?.timing.shift || 'Day Shift',
    startTime: initialData?.timing.startTime || '09:00',
    endTime: initialData?.timing.endTime || '18:00',
    poolId: initialData?.allocation.poolId || '',
    zonePreference: initialData?.allocation.zonePreference || '',
    bookingType: initialData?.bookingType || 'SINGLE_DAY',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit({
        employeeId: formData.employeeId,
        vehicleId: formData.vehicleId,
        bookingType: formData.bookingType as Booking['bookingType'],
        timing: {
          date: formData.date,
          shift: formData.shift,
          startTime: formData.startTime,
          endTime: formData.endTime,
        },
        allocation: {
          poolId: formData.poolId,
          zonePreference: formData.zonePreference || undefined,
          assignmentType: 'AT_ENTRY',
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mock data for dropdowns
  const employees = [
    { id: 'emp-001', name: 'Rahul Sharma', department: 'Engineering' },
    { id: 'emp-002', name: 'Priya Patel', department: 'Sales' },
    { id: 'emp-003', name: 'Amit Kumar', department: 'Marketing' },
    { id: 'emp-004', name: 'Sara Johnson', department: 'HR' },
    { id: 'emp-005', name: 'Vijay Mehta', department: 'Finance' },
  ];

  const vehicles = [
    { id: 'veh-001', number: 'HR26DK1234', type: 'Car' },
    { id: 'veh-002', number: 'DL01AB5678', type: 'SUV' },
    { id: 'veh-003', number: 'MH12CD9012', type: 'Car' },
    { id: 'veh-004', number: 'KA05EF3456', type: 'Bike' },
    { id: 'veh-005', number: 'TN09GH7890', type: 'Car' },
  ];

  const pools = [
    { id: 'pool-001', name: 'Employee Reserved', available: 25 },
    { id: 'pool-002', name: 'Employee Walk-in', available: 12 },
    { id: 'pool-003', name: 'Visitor Parking', available: 8 },
  ];

  const zones = [
    { id: 'zone-001', name: 'Zone A - Reserved' },
    { id: 'zone-002', name: 'Zone B - FCFS' },
    { id: 'zone-003', name: 'Zone C - Visitor' },
  ];

  const shifts = [
    { name: 'Day Shift', start: '09:00', end: '18:00' },
    { name: 'Night Shift', start: '18:00', end: '06:00' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        {/* Modal */}
        <div className="relative inline-block bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              {initialData ? 'Edit Booking' : 'New Booking'}
            </h3>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="px-6 py-4 space-y-4">
              {/* Employee */}
              <div>
                <label className="label mb-1">Employee</label>
                <select
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  className="input"
                  required
                >
                  <option value="">Select employee</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} - {emp.department}
                    </option>
                  ))}
                </select>
              </div>

              {/* Vehicle */}
              <div>
                <label className="label mb-1">Vehicle</label>
                <select
                  value={formData.vehicleId}
                  onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                  className="input"
                  required
                >
                  <option value="">Select vehicle</option>
                  {vehicles.map((veh) => (
                    <option key={veh.id} value={veh.id}>
                      {veh.number} ({veh.type})
                    </option>
                  ))}
                </select>
              </div>

              {/* Booking Type */}
              <div>
                <label className="label mb-1">Booking Type</label>
                <div className="flex space-x-4">
                  {['SINGLE_DAY', 'MULTI_DAY'].map((type) => (
                    <label key={type} className="flex items-center">
                      <input
                        type="radio"
                        name="bookingType"
                        value={type}
                        checked={formData.bookingType === type}
                        onChange={(e) => setFormData({ ...formData, bookingType: e.target.value as 'SINGLE_DAY' | 'MULTI_DAY' })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">
                        {type === 'SINGLE_DAY' ? 'Single Day' : 'Multi Day'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="label mb-1">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="input"
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Shift */}
              <div>
                <label className="label mb-1">Shift</label>
                <select
                  value={formData.shift}
                  onChange={(e) => {
                    const shift = shifts.find((s) => s.name === e.target.value);
                    setFormData({
                      ...formData,
                      shift: e.target.value,
                      startTime: shift?.start || formData.startTime,
                      endTime: shift?.end || formData.endTime,
                    });
                  }}
                  className="input"
                >
                  {shifts.map((shift) => (
                    <option key={shift.name} value={shift.name}>
                      {shift.name} ({shift.start} - {shift.end})
                    </option>
                  ))}
                </select>
              </div>

              {/* Pool */}
              <div>
                <label className="label mb-1">Parking Pool</label>
                <select
                  value={formData.poolId}
                  onChange={(e) => setFormData({ ...formData, poolId: e.target.value })}
                  className="input"
                  required
                >
                  <option value="">Select pool</option>
                  {pools.map((pool) => (
                    <option key={pool.id} value={pool.id}>
                      {pool.name} ({pool.available} available)
                    </option>
                  ))}
                </select>
              </div>

              {/* Zone Preference */}
              <div>
                <label className="label mb-1">Zone Preference (Optional)</label>
                <select
                  value={formData.zonePreference}
                  onChange={(e) => setFormData({ ...formData, zonePreference: e.target.value })}
                  className="input"
                >
                  <option value="">No preference</option>
                  {zones.map((zone) => (
                    <option key={zone.id} value={zone.id}>
                      {zone.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : initialData ? 'Update Booking' : 'Create Booking'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
