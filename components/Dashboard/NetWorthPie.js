import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// To animate a pie slice and show the value inside on hover:
// 1. Use the 'activeIndex' and 'onMouseEnter' props on <Pie> to track the hovered slice.
// 2. Use the 'activeShape' prop to render a custom shape for the active slice (e.g., make it larger and display the value inside).
// 3. See Recharts docs: https://recharts.org/en-US/examples/CustomizedActiveShapePieChart

// Tableau 10 color palette for better distinction
const COLORS = [
  '#4E79A7',
  '#F28E2B',
  '#E15759',
  '#76B7B2',
  '#59A14F',
  '#EDC948',
  '#B07AA1',
  '#FF9DA7',
  '#9C755F',
  '#BAB0AC',
];

export default function NetWorthPie({ data, title }) {
  const hasData = Array.isArray(data) && data.some((d) => d.value > 0);

  return (
    <>
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      {hasData ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-gray-400 text-center py-20">
          No data to display
        </div>
      )}
    </>
  );
}
