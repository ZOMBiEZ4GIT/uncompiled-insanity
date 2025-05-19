import Link from 'next/link';

export default function NavBar() {
  return (
    <nav className="bg-earth-card border-b border-earth text-earth shadow-card">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/"
            className="text-2xl font-bold text-earth-primary hover:text-earth-accent transition-colors duration-200"
          >
            Insanity Dashboard
          </Link>
        </div>
        <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-1 sm:space-y-0 mt-2 sm:mt-0">
          <Link
            href="/"
            className="text-earth hover:text-earth-primary transition-colors duration-200"
          >
            Net Worth
          </Link>
          <Link
            href="/data-entry"
            className="text-earth hover:text-earth-primary transition-colors duration-200"
          >
            Data Entry
          </Link>
          <Link
            href="/debt-tracker"
            className="text-earth hover:text-earth-primary transition-colors duration-200"
          >
            Debt Tracker
          </Link>
          <Link
            href="/budget"
            className="text-earth hover:text-earth-primary transition-colors duration-200"
          >
            Budget
          </Link>
        </div>
      </div>
    </nav>
  );
}
