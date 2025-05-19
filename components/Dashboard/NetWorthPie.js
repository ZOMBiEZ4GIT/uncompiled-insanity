import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Modern color palette with better contrast and accessibility
const COLORS = [
  '#6366F1', // Indigo
  '#10B981', // Emerald
  '#EC4899', // Pink
  '#F59E0B', // Amber
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#14B8A6', // Teal
  '#F43F5E', // Rose
  '#84CC16', // Lime
  '#06B6D4', // Cyan
];

export default function NetWorthPie({ data, title }) {
  const hasData = Array.isArray(data) && data.some((d) => d.value > 0);

  return (
    <div className="p-6 bg-earth-card rounded-xl w-full shadow-card hover:shadow-card-hover transition-shadow duration-300 border border-earth">
      <h2 className="text-xl font-display font-semibold mb-6 text-earth-primary">
        {title}
      </h2>
      {hasData ? (
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              innerRadius={60}
              paddingAngle={2}
            >
              {data.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                  stroke="white"
                  strokeWidth={2}
                />
              ))}
            </Pie>
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
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{
                paddingTop: '20px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-gray-400 text-center py-20 font-medium">
          No data to display
        </div>
      )}
    </div>
  );
}
