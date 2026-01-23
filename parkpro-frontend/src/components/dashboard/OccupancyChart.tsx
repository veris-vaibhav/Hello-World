import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Mock hourly data for the occupancy chart
const generateHourlyData = () => {
  const data = [];
  const now = new Date();
  const currentHour = now.getHours();

  for (let i = 0; i < 24; i++) {
    const hour = (currentHour - 23 + i + 24) % 24;
    const baseOccupancy = hour >= 9 && hour <= 18 ? 300 + Math.random() * 100 : 100 + Math.random() * 50;

    data.push({
      time: `${hour.toString().padStart(2, '0')}:00`,
      occupancy: Math.floor(baseOccupancy),
      capacity: 500,
      fourWheeler: Math.floor(baseOccupancy * 0.8),
      twoWheeler: Math.floor(baseOccupancy * 0.2),
    });
  }

  return data;
};

const data = generateHourlyData();

export function OccupancyChart() {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
            domain={[0, 500]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="occupancy"
            name="Total Occupancy"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="fourWheeler"
            name="Four Wheeler"
            stroke="#10B981"
            strokeWidth={2}
            dot={false}
            strokeDasharray="5 5"
          />
          <Line
            type="monotone"
            dataKey="twoWheeler"
            name="Two Wheeler"
            stroke="#F59E0B"
            strokeWidth={2}
            dot={false}
            strokeDasharray="5 5"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
