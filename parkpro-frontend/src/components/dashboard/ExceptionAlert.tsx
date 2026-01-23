import { XMarkIcon } from '@heroicons/react/24/outline';
import type { Exception } from '../../types';

interface ExceptionAlertProps {
  exception: Exception;
  onDismiss?: () => void;
}

export function ExceptionAlert({ exception, onDismiss }: ExceptionAlertProps) {
  const getSeverityStyles = () => {
    switch (exception.severity) {
      case 'CRITICAL':
        return 'bg-red-50 border-red-400 text-red-800';
      case 'HIGH':
        return 'bg-orange-50 border-orange-400 text-orange-800';
      case 'MEDIUM':
        return 'bg-yellow-50 border-yellow-400 text-yellow-800';
      case 'LOW':
        return 'bg-blue-50 border-blue-400 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-400 text-gray-800';
    }
  };

  const getSeverityIcon = () => {
    switch (exception.severity) {
      case 'CRITICAL':
        return '🚨';
      case 'HIGH':
        return '⚠️';
      case 'MEDIUM':
        return '⚡';
      case 'LOW':
        return 'ℹ️';
      default:
        return '📌';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className={`flex items-start p-4 border-l-4 rounded-r-lg ${getSeverityStyles()}`}>
      <span className="text-xl mr-3">{getSeverityIcon()}</span>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold">
            {exception.type.replace(/_/g, ' ')}
            {exception.vehicleNumber && (
              <span className="font-mono ml-2">[{exception.vehicleNumber}]</span>
            )}
          </h4>
          <span className="text-sm opacity-75">{formatTime(exception.createdAt)}</span>
        </div>
        <p className="mt-1 text-sm opacity-90">{exception.description}</p>
        <div className="mt-2 flex items-center space-x-3">
          <button className="text-sm font-medium hover:underline">View Details</button>
          <span className="text-gray-300">|</span>
          <button className="text-sm font-medium hover:underline">Resolve</button>
          {exception.autoAction && (
            <>
              <span className="text-gray-300">|</span>
              <span className="text-xs opacity-75">Auto: {exception.autoAction}</span>
            </>
          )}
        </div>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="ml-4 p-1 hover:bg-black/10 rounded-full transition-colors"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
