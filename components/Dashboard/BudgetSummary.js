const badgeColors = [
  'bg-primary text-white border-primary shadow',
  'bg-accent text-white border-accent shadow',
  'bg-neon text-white border-neon shadow',
  'bg-blue-700 text-white border-blue-700 shadow',
  'bg-pink-700 text-white border-pink-700 shadow',
  'bg-green-700 text-white border-green-700 shadow',
  'bg-purple-800 text-white border-purple-800 shadow',
  'bg-orange-700 text-white border-orange-700 shadow',
  'bg-gray-900 text-white border-gray-900 shadow',
];

export default function BudgetSummary({ budgetItems, title, withBadges }) {
  // Sort items by amount descending
  const sortedItems = [...budgetItems].sort((a, b) => b.amount - a.amount);
  // Assign a color to each unique category
  const categoryColorMap = {};
  let colorIdx = 0;
  sortedItems.forEach((item) => {
    if (!categoryColorMap[item.category]) {
      categoryColorMap[item.category] =
        badgeColors[colorIdx % badgeColors.length];
      colorIdx++;
    }
  });
  return (
    <div className="p-4 bg-white dark:bg-[#23234b] rounded-xl w-full shadow border border-slate-200 dark:border-zinc-700">
      <h2 className="text-lg font-semibold mb-4 text-primary dark:text-accent">
        {title}
      </h2>
      <table className="w-full table-auto">
        <thead>
          <tr>
            <th className="text-left">Item</th>
            <th className="text-left">%</th>
            <th className="text-left">$/pm</th>
            <th className="text-left">Category</th>
          </tr>
        </thead>
        <tbody>
          {sortedItems.map((item, idx) => (
            <tr key={idx}>
              <td>{item.name}</td>
              <td>{Number(item.percentage).toFixed(2)}%</td>
              <td className="font-bold text-neon dark:text-accent">
                ${item.amount}
              </td>
              <td>
                {withBadges ? (
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${categoryColorMap[item.category]}`}
                  >
                    {item.category}
                  </span>
                ) : (
                  item.category
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
