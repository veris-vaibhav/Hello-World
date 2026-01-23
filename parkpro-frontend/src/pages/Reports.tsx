import { useState } from 'react';
import {
  ChartBarIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
  DocumentArrowDownIcon,
} from '@heroicons/react/24/outline';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';

// Mock data for charts
const weeklyOccupancy = [
  { day: 'Mon', occupancy: 420, capacity: 500 },
  { day: 'Tue', occupancy: 380, capacity: 500 },
  { day: 'Wed', occupancy: 450, capacity: 500 },
  { day: 'Thu', occupancy: 410, capacity: 500 },
  { day: 'Fri', occupancy: 390, capacity: 500 },
  { day: 'Sat', occupancy: 150, capacity: 500 },
  { day: 'Sun', occupancy: 80, capacity: 500 },
];

const tenantUtilization = [
  { name: 'TechCorp Inc.', value: 98, color: '#3B82F6' },
  { name: 'FinanceHub Ltd.', value: 72, color: '#10B981' },
  { name: 'DesignStudio', value: 65, color: '#F59E0B' },
  { name: 'Shared Pool', value: 45, color: '#8B5CF6' },
];

const hourlyTrend = [
  { hour: '06:00', entries: 5, exits: 2 },
  { hour: '07:00', entries: 25, exits: 5 },
  { hour: '08:00', entries: 80, exits: 10 },
  { hour: '09:00', entries: 120, exits: 15 },
  { hour: '10:00', entries: 45, exits: 20 },
  { hour: '11:00', entries: 20, exits: 25 },
  { hour: '12:00', entries: 15, exits: 40 },
  { hour: '13:00', entries: 30, exits: 35 },
  { hour: '14:00', entries: 25, exits: 30 },
  { hour: '15:00', entries: 15, exits: 35 },
  { hour: '16:00', entries: 10, exits: 50 },
  { hour: '17:00', entries: 5, exits: 90 },
  { hour: '18:00', entries: 8, exits: 100 },
  { hour: '19:00', entries: 5, exits: 40 },
  { hour: '20:00', entries: 3, exits: 20 },
];

const exceptionStats = [
  { type: 'Unknown Vehicle', count: 45 },
  { type: 'Overstay', count: 32 },
  { type: 'No Show', count: 28 },
  { type: 'Anti-passback', count: 12 },
  { type: 'Vehicle Mismatch', count: 8 },
];

const reportTypes = [
  { id: 'daily-occupancy', name: 'Daily Occupancy Report', description: 'Detailed occupancy metrics for a specific day', icon: ChartBarIcon },
  { id: 'weekly-utilization', name: 'Weekly Utilization Report', description: 'Weekly booking vs actual usage analysis', icon: ChartBarIcon },
  { id: 'tenant-usage', name: 'Tenant Usage Report', description: 'Tenant-wise parking consumption', icon: ChartBarIcon },
  { id: 'exception-summary', name: 'Exception Summary', description: 'Summary of all exceptions and resolutions', icon: ChartBarIcon },
  { id: 'no-show-report', name: 'No-Show Report', description: 'Analysis of booking no-shows', icon: ChartBarIcon },
  { id: 'compliance', name: 'Compliance Report', description: 'Parking policy compliance metrics', icon: ChartBarIcon },
];

export function Reports() {
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedReport, setSelectedReport] = useState('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-500 mt-1">Analyze parking operations and generate reports</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5 text-gray-400" />
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="input text-sm"
            />
            <span className="text-gray-400">to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="input text-sm"
            />
          </div>
          <button className="btn-primary">
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-500">Avg. Daily Occupancy</p>
          <p className="text-2xl font-bold text-gray-900">78%</p>
          <p className="text-xs text-green-600 mt-1">+5% from last week</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-500">Total Entries (Week)</p>
          <p className="text-2xl font-bold text-gray-900">2,847</p>
          <p className="text-xs text-gray-500 mt-1">Avg 407/day</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-500">Booking Utilization</p>
          <p className="text-2xl font-bold text-gray-900">92%</p>
          <p className="text-xs text-green-600 mt-1">+2% from last week</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-500">No-Show Rate</p>
          <p className="text-2xl font-bold text-gray-900">4.2%</p>
          <p className="text-xs text-red-600 mt-1">+0.5% from last week</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Occupancy */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Occupancy</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyOccupancy}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} domain={[0, 500]} />
                <Tooltip />
                <Bar dataKey="occupancy" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tenant Utilization Pie */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tenant Utilization (%)</h3>
          <div className="h-64 flex items-center">
            <ResponsiveContainer width="60%" height="100%">
              <PieChart>
                <Pie
                  data={tenantUtilization}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ value }) => `${value}%`}
                >
                  {tenantUtilization.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {tenantUtilization.map((tenant) => (
                <div key={tenant.name} className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: tenant.color }}
                  ></div>
                  <span className="text-sm text-gray-600">{tenant.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hourly Entry/Exit Trend */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hourly Entry/Exit Pattern</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="entries"
                  name="Entries"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="exits"
                  name="Exits"
                  stroke="#EF4444"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Exception Stats */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Exception Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={exceptionStats} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="type" type="category" tick={{ fontSize: 11 }} width={100} />
                <Tooltip />
                <Bar dataKey="count" fill="#F59E0B" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Report Templates */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Generate Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reportTypes.map((report) => (
            <div
              key={report.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedReport === report.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-primary-300'
              }`}
              onClick={() => setSelectedReport(report.id)}
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <DocumentArrowDownIcon className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{report.name}</p>
                  <p className="text-sm text-gray-500">{report.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {selectedReport && (
          <div className="mt-4 flex justify-end">
            <button className="btn-primary">
              <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
              Generate Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
