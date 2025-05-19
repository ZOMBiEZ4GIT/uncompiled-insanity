import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

export default function AssetLineChart({ data, title, color }) {
  return (
    <div className="p-6 bg-earth-card rounded-xl w-full shadow-card hover:shadow-card-hover transition-shadow duration-300 border border-earth">
      <h2 className="text-xl font-display font-semibold mb-6 text-earth-primary">
        {title}
      </h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
          <XAxis
            dataKey="date"
            stroke="#6B7280"
            className="text-xs"
            tick={{ fill: '#6B7280' }}
          />
          <YAxis
            stroke="#6B7280"
            className="text-xs"
            tick={{ fill: '#6B7280' }}
          />
          <Tooltip
            contentStyle={{
              background: 'rgba(31, 41, 55, 0.95)',
              color: '#fff',
              borderRadius: 8,
              border: 'none',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
            labelStyle={{ color: '#fff', fontWeight: 500 }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="amount"
            stroke={color || '#6366F1'}
            strokeWidth={2.5}
            dot={{ r: 3, fill: color || '#6366F1' }}
            activeDot={{ r: 6, fill: color || '#6366F1' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
