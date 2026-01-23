import type { FloorOccupancy } from '../../types';

interface FloorOccupancyGridProps {
  floors: FloorOccupancy[];
}

export function FloorOccupancyGrid({ floors }: FloorOccupancyGridProps) {
  const getOccupancyColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    if (percentage >= 50) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getOccupancyBgColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-50 border-red-200';
    if (percentage >= 70) return 'bg-yellow-50 border-yellow-200';
    if (percentage >= 50) return 'bg-blue-50 border-blue-200';
    return 'bg-green-50 border-green-200';
  };

  return (
    <div className="space-y-4">
      {floors.map((floor) => {
        const percentage = (floor.occupied / floor.capacity) * 100;

        return (
          <div
            key={floor.floorId}
            className={`p-4 rounded-lg border ${getOccupancyBgColor(percentage)}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full ${getOccupancyColor(percentage)} mr-3`}></div>
                <span className="font-medium text-gray-900">{floor.name}</span>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-gray-900">{floor.available}</span>
                <span className="text-sm text-gray-500"> available</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                {floor.occupied} / {floor.capacity} occupied
              </span>
              <span
                className={`font-medium ${
                  percentage >= 90
                    ? 'text-red-600'
                    : percentage >= 70
                    ? 'text-yellow-600'
                    : 'text-green-600'
                }`}
              >
                {percentage.toFixed(0)}%
              </span>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${getOccupancyColor(percentage)}`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        );
      })}

      {floors.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No floor data available
        </div>
      )}
    </div>
  );
}
