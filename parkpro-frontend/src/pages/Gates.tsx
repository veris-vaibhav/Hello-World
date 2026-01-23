import { useState, useEffect } from 'react';
import {
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  SignalIcon,
  SignalSlashIcon,
} from '@heroicons/react/24/outline';
import type { Gate, EntryExitEvent } from '../types';

// Mock gate data
const mockGates: Gate[] = [
  {
    id: 'gate-001',
    parkingLocationId: 'pl-001',
    name: 'Main Entry Gate',
    gateType: 'ENTRY_EXIT',
    vehicleTypes: ['FOUR_WHEELER', 'TWO_WHEELER'],
    hardware: {
      anprCamera: { enabled: true, vendor: 'HIKVISION', ipAddress: '192.168.1.101', protocol: 'ONVIF' },
      barrier: { enabled: true, type: 'BOOM_BARRIER', controllerIp: '192.168.1.102', protocol: 'RELAY' },
      display: { enabled: true, type: 'LED_MATRIX', ipAddress: '192.168.1.103' },
      qrScanner: { enabled: true, deviceId: 'QR-001' },
      rfidReaderEnabled: false,
    },
    fallbackSequence: ['ANPR', 'QR', 'MANUAL'],
    antiPassback: { enabled: true, mode: 'STRICT' },
    status: 'ONLINE',
  },
  {
    id: 'gate-002',
    parkingLocationId: 'pl-001',
    name: 'Exit Gate 1',
    gateType: 'EXIT_ONLY',
    vehicleTypes: ['FOUR_WHEELER'],
    hardware: {
      anprCamera: { enabled: true, vendor: 'HIKVISION', ipAddress: '192.168.1.111', protocol: 'ONVIF' },
      barrier: { enabled: true, type: 'BOOM_BARRIER', controllerIp: '192.168.1.112', protocol: 'RELAY' },
      display: { enabled: true, type: 'LED_MATRIX', ipAddress: '192.168.1.113' },
      qrScanner: { enabled: false, deviceId: '' },
      rfidReaderEnabled: false,
    },
    fallbackSequence: ['ANPR', 'MANUAL'],
    antiPassback: { enabled: true, mode: 'STRICT' },
    status: 'ONLINE',
  },
  {
    id: 'gate-003',
    parkingLocationId: 'pl-001',
    name: 'Two-Wheeler Gate',
    gateType: 'ENTRY_EXIT',
    vehicleTypes: ['TWO_WHEELER'],
    hardware: {
      anprCamera: { enabled: true, vendor: 'HIKVISION', ipAddress: '192.168.1.121', protocol: 'ONVIF' },
      barrier: { enabled: true, type: 'FLAP_BARRIER', controllerIp: '192.168.1.122', protocol: 'RELAY' },
      display: { enabled: false, type: '', ipAddress: '' },
      qrScanner: { enabled: true, deviceId: 'QR-003' },
      rfidReaderEnabled: true,
    },
    fallbackSequence: ['RFID', 'ANPR', 'MANUAL'],
    antiPassback: { enabled: true, mode: 'SOFT' },
    status: 'MAINTENANCE',
  },
];

// Mock recent events
const generateMockEvents = (): EntryExitEvent[] => {
  const events: EntryExitEvent[] = [];
  const vehicles = ['HR26DK1234', 'DL01AB5678', 'MH12CD9012', 'KA05EF3456', 'TN09GH7890'];
  const gates = ['gate-001', 'gate-002'];

  for (let i = 0; i < 20; i++) {
    events.push({
      id: `evt-${String(i + 1).padStart(3, '0')}`,
      eventType: i % 3 === 0 ? 'EXIT' : 'ENTRY',
      vehicleNumber: vehicles[i % vehicles.length],
      vehicleId: `veh-${String((i % 5) + 1).padStart(3, '0')}`,
      gateId: gates[i % gates.length],
      captureMethod: i % 4 === 0 ? 'MANUAL' : 'ANPR',
      captureConfidence: i % 4 === 0 ? undefined : 0.85 + Math.random() * 0.14,
      timestamp: new Date(Date.now() - i * 300000).toISOString(),
      employeeId: `emp-${String((i % 5) + 1).padStart(3, '0')}`,
      tenantId: `tenant-00${(i % 3) + 1}`,
      isException: i % 7 === 0,
      exceptionType: i % 7 === 0 ? 'UNKNOWN_VEHICLE' : undefined,
    });
  }

  return events;
};

const mockEvents = generateMockEvents();

export function Gates() {
  const [gates, setGates] = useState<Gate[]>([]);
  const [events, setEvents] = useState<EntryExitEvent[]>([]);
  const [selectedGate, setSelectedGate] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [manualEntry, setManualEntry] = useState({ vehicleNumber: '', isEntry: true });

  useEffect(() => {
    setTimeout(() => {
      setGates(mockGates);
      setEvents(mockEvents);
      setIsLoading(false);
    }, 300);
  }, []);

  const filteredEvents = selectedGate
    ? events.filter((e) => e.gateId === selectedGate)
    : events;

  const getGateStatusBadge = (status: Gate['status']) => {
    switch (status) {
      case 'ONLINE':
        return (
          <span className="flex items-center text-green-600">
            <SignalIcon className="h-4 w-4 mr-1" />
            Online
          </span>
        );
      case 'OFFLINE':
        return (
          <span className="flex items-center text-red-600">
            <SignalSlashIcon className="h-4 w-4 mr-1" />
            Offline
          </span>
        );
      case 'MAINTENANCE':
        return (
          <span className="flex items-center text-yellow-600">
            <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
            Maintenance
          </span>
        );
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const handleManualEntry = () => {
    if (!manualEntry.vehicleNumber) return;
    // In real app, this would call an API
    alert(`Manual ${manualEntry.isEntry ? 'entry' : 'exit'} recorded for ${manualEntry.vehicleNumber}`);
    setManualEntry({ vehicleNumber: '', isEntry: true });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gate Operations</h1>
          <p className="text-gray-500 mt-1">Monitor gates and manage entry/exit events</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span>Live Monitoring</span>
        </div>
      </div>

      {/* Gate Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {gates.map((gate) => (
          <div
            key={gate.id}
            className={`bg-white rounded-xl shadow-sm p-4 border-2 cursor-pointer transition-colors ${
              selectedGate === gate.id ? 'border-primary-500' : 'border-transparent hover:border-gray-200'
            }`}
            onClick={() => setSelectedGate(selectedGate === gate.id ? '' : gate.id)}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">{gate.name}</h3>
              {getGateStatusBadge(gate.status)}
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Type:</span>
                <span className="text-gray-900">{gate.gateType.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">ANPR:</span>
                <span className={gate.hardware.anprCamera.enabled ? 'text-green-600' : 'text-gray-400'}>
                  {gate.hardware.anprCamera.enabled ? 'Active' : 'Disabled'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Anti-passback:</span>
                <span className="text-gray-900">{gate.antiPassback.mode}</span>
              </div>
            </div>
            {gate.status === 'ONLINE' && (
              <div className="mt-4 flex space-x-2">
                <button className="flex-1 btn-secondary text-xs py-1">Open Barrier</button>
                <button className="flex-1 btn-secondary text-xs py-1">Test Display</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Manual Entry Form */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Manual Entry/Exit</h3>
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <label className="label mb-1">Vehicle Number</label>
            <input
              type="text"
              value={manualEntry.vehicleNumber}
              onChange={(e) => setManualEntry({ ...manualEntry, vehicleNumber: e.target.value.toUpperCase() })}
              placeholder="Enter vehicle number"
              className="input font-mono"
            />
          </div>
          <div className="w-40">
            <label className="label mb-1">Action</label>
            <select
              value={manualEntry.isEntry ? 'entry' : 'exit'}
              onChange={(e) => setManualEntry({ ...manualEntry, isEntry: e.target.value === 'entry' })}
              className="input"
            >
              <option value="entry">Entry</option>
              <option value="exit">Exit</option>
            </select>
          </div>
          <div className="w-40">
            <label className="label mb-1">Gate</label>
            <select className="input">
              {gates.filter((g) => g.status === 'ONLINE').map((gate) => (
                <option key={gate.id} value={gate.id}>
                  {gate.name}
                </option>
              ))}
            </select>
          </div>
          <button onClick={handleManualEntry} className="btn-primary">
            Record {manualEntry.isEntry ? 'Entry' : 'Exit'}
          </button>
        </div>
      </div>

      {/* Event Feed */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Events
            {selectedGate && (
              <span className="ml-2 text-sm font-normal text-gray-500">
                - {gates.find((g) => g.id === selectedGate)?.name}
              </span>
            )}
          </h3>
          {selectedGate && (
            <button
              onClick={() => setSelectedGate('')}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Show all gates
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
            {filteredEvents.slice(0, 15).map((event) => (
              <div
                key={event.id}
                className={`px-6 py-3 flex items-center justify-between hover:bg-gray-50 ${
                  event.isException ? 'bg-red-50' : ''
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`p-2 rounded-full ${
                      event.eventType === 'ENTRY' ? 'bg-green-100' : 'bg-blue-100'
                    }`}
                  >
                    {event.eventType === 'ENTRY' ? (
                      <ArrowRightOnRectangleIcon className="h-5 w-5 text-green-600" />
                    ) : (
                      <ArrowLeftOnRectangleIcon className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-semibold text-gray-900">
                        {event.vehicleNumber}
                      </span>
                      {event.isException && (
                        <span className="badge-red text-xs">Exception</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {event.captureMethod} capture
                      {event.captureConfidence && ` (${(event.captureConfidence * 100).toFixed(0)}%)`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{formatTime(event.timestamp)}</p>
                  <p className="text-xs text-gray-500">
                    {gates.find((g) => g.id === event.gateId)?.name}
                  </p>
                </div>
                <div className="ml-4">
                  {event.isException ? (
                    <XCircleIcon className="h-5 w-5 text-red-500" />
                  ) : (
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
