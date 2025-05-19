import Link from 'next/link';

export default function NavBar() {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href="/" className="text-2xl font-bold">
            Net Worth
          </Link>
        </div>
        <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-1 sm:space-y-0 mt-2 sm:mt-0">
          <Link href="/" className="text-gray-700 hover:text-blue-500">
            Net Worth
          </Link>
          <Link
            href="/data-entry"
            className="text-gray-700 hover:text-blue-500"
          >
            Data Entry
          </Link>
          <Link
            href="/debt-tracker"
            className="text-gray-700 hover:text-blue-500"
          >
            Debt Tracker
          </Link>
          <Link href="/budget" className="text-gray-700 hover:text-blue-500">
            Budget
          </Link>
          <Link
            href="/budget-playground"
            className="text-gray-700 hover:text-blue-500"
          >
            Budget Playground
          </Link>
        </div>
      </div>
    </nav>
  );
}
