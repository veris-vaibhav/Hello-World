import {
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

interface Activity {
  id: string;
  type: 'ENTRY' | 'EXIT' | 'EXCEPTION' | 'BOOKING';
  vehicleNumber: string;
  employeeName?: string;
  timestamp: string;
  gate?: string;
  status?: string;
}

// Mock recent activities
const recentActivities: Activity[] = [
  {
    id: '1',
    type: 'ENTRY',
    vehicleNumber: 'HR26DK1234',
    employeeName: 'Rahul Sharma',
    timestamp: new Date(Date.now() - 120000).toISOString(),
    gate: 'Main Gate',
  },
  {
    id: '2',
    type: 'EXIT',
    vehicleNumber: 'DL01AB5678',
    employeeName: 'Priya Patel',
    timestamp: new Date(Date.now() - 300000).toISOString(),
    gate: 'Exit Gate 2',
  },
  {
    id: '3',
    type: 'EXCEPTION',
    vehicleNumber: 'MH12CD9012',
    timestamp: new Date(Date.now() - 450000).toISOString(),
    status: 'Unknown vehicle',
  },
  {
    id: '4',
    type: 'ENTRY',
    vehicleNumber: 'KA05EF3456',
    employeeName: 'Amit Kumar',
    timestamp: new Date(Date.now() - 600000).toISOString(),
    gate: 'Main Gate',
  },
  {
    id: '5',
    type: 'BOOKING',
    vehicleNumber: 'TN09GH7890',
    employeeName: 'Sara Johnson',
    timestamp: new Date(Date.now() - 900000).toISOString(),
    status: 'Confirmed',
  },
  {
    id: '6',
    type: 'EXIT',
    vehicleNumber: 'HR26IJ2345',
    employeeName: 'Vijay Mehta',
    timestamp: new Date(Date.now() - 1200000).toISOString(),
    gate: 'Exit Gate 1',
  },
];

const getActivityIcon = (type: Activity['type']) => {
  switch (type) {
    case 'ENTRY':
      return <ArrowRightOnRectangleIcon className="h-5 w-5 text-green-500" />;
    case 'EXIT':
      return <ArrowLeftOnRectangleIcon className="h-5 w-5 text-blue-500" />;
    case 'EXCEPTION':
      return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
    case 'BOOKING':
      return <CheckCircleIcon className="h-5 w-5 text-purple-500" />;
    default:
      return null;
  }
};

const getActivityBadge = (type: Activity['type']) => {
  switch (type) {
    case 'ENTRY':
      return <span className="badge-green">Entry</span>;
    case 'EXIT':
      return <span className="badge-blue">Exit</span>;
    case 'EXCEPTION':
      return <span className="badge-red">Exception</span>;
    case 'BOOKING':
      return <span className="badge bg-purple-100 text-purple-800">Booking</span>;
    default:
      return null;
  }
};

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hr ago`;
  return date.toLocaleDateString();
};

export function RecentActivity() {
  return (
    <div className="space-y-4">
      {recentActivities.map((activity) => (
        <div
          key={activity.id}
          className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="flex-shrink-0 mt-0.5">{getActivityIcon(activity.type)}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900 truncate">
                {activity.vehicleNumber}
              </p>
              {getActivityBadge(activity.type)}
            </div>
            <p className="text-sm text-gray-500 truncate">
              {activity.employeeName || activity.status}
              {activity.gate && ` - ${activity.gate}`}
            </p>
          </div>
          <div className="flex-shrink-0 text-xs text-gray-400">
            {formatTime(activity.timestamp)}
          </div>
        </div>
      ))}

      <button className="w-full text-center py-2 text-sm text-primary-600 hover:text-primary-700 font-medium">
        View all activity
      </button>
    </div>
  );
}
