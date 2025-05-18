import Link from 'next/link';

export default function NavBar() {
  return (
    <nav className="bg-earth-card border-b border-earth text-earth">
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href="/" className="text-2xl font-bold text-earth-primary">
            Net Worth
          </Link>
        </div>
        <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-1 sm:space-y-0 mt-2 sm:mt-0">
          <Link href="/" className="hover:text-earth-primary">
            Net Worth
          </Link>
          <Link href="/data-entry" className="hover:text-earth-primary">
            Data Entry
          </Link>
          <Link href="/debt-tracker" className="hover:text-earth-primary">
            Debt Tracker
          </Link>
          <Link href="/budget" className="hover:text-earth-primary">
            Budget
          </Link>
          <Link href="/budget-playground" className="hover:text-earth-primary">
            Budget Playground
          </Link>
        </div>
      </div>
    </nav>
  );
}
