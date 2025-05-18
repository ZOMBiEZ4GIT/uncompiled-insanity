export default function BudgetSummary({ budgetItems, title, withBadges }) {
  // Sort items by amount descending
  const sortedItems = [...budgetItems].sort((a, b) => b.amount - a.amount);

  const categoryColorMap = {
    Housing:
      'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-200 dark:border-blue-800',
    Transportation:
      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-800',
    Food: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 border-purple-200 dark:border-purple-800',
    Utilities:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800',
    Entertainment:
      'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200 border-pink-200 dark:border-pink-800',
    Healthcare:
      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200 dark:border-red-800',
    Savings:
      'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 border-indigo-200 dark:border-indigo-800',
    Other:
      'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 border-gray-200 dark:border-gray-800',
  };

  return (
    <div className="p-6 bg-earth-card rounded-xl w-full shadow-card hover:shadow-card-hover transition-shadow duration-300 border border-earth">
      <h2 className="text-xl font-display font-semibold mb-6 text-earth-primary">
        {title}
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="border-b border-slate-200 dark:border-dark-border">
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-400">
                Item
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-400">
                %
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-400">
                $/pm
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-400">
                Category
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedItems.map((item, idx) => (
              <tr
                key={idx}
                className="border-b border-slate-100 dark:border-dark-border/50 hover:bg-slate-50 dark:hover:bg-dark-card/50 transition-colors"
              >
                <td className="py-3 px-4 text-slate-800 dark:text-slate-200">
                  {item.name}
                </td>
                <td className="py-3 px-4 text-slate-800 dark:text-slate-200">
                  {Number(item.percentage).toFixed(2)}%
                </td>
                <td className="py-3 px-4 font-semibold text-primary dark:text-dark-primary">
                  ${item.amount}
                </td>
                <td className="py-3 px-4">
                  {withBadges ? (
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${categoryColorMap[item.category]}`}
                    >
                      {item.category}
                    </span>
                  ) : (
                    <span className="text-slate-800 dark:text-slate-200">
                      {item.category}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
