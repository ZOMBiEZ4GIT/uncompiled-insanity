import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function AssetLineChart({ data, title, color }) {
  return (
    <>
      <h2 className="text-lg font-semibold mb-4 text-primary dark:text-accent">
        {title}
      </h2>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <XAxis dataKey="date" stroke="#888" className="text-xs" />
          <YAxis stroke="#888" className="text-xs" />
          <Tooltip
            contentStyle={{
              background: 'rgba(36,37,46,0.95)',
              color: '#fff',
              borderRadius: 8,
            }}
            labelStyle={{ color: '#fff' }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="amount"
            stroke={color || '#8884d8'}
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}
