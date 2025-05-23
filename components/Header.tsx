import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Header() {
  const router = useRouter();
  return (
    <header className="bg-earth-card text-earth border-b border-earth shadow-card">
      <div className="max-w-7xl mx-auto p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          <Link
            href="/"
            className="text-earth-primary hover:text-earth-accent transition-colors duration-200"
          >
            Uncompiled Insanity
          </Link>
        </h1>
        <nav className="flex gap-4">
          <Link
            href="/"
            className={`px-3 py-1 rounded transition-colors duration-200 ${router.pathname === '/' ? 'bg-earth-accent text-earth' : 'hover:bg-earth-accent2'}`}
          >
            Dashboard
          </Link>
          <Link
            href="/budget"
            className={`px-3 py-1 rounded transition-colors duration-200 ${router.pathname === '/budget' ? 'bg-earth-accent text-earth' : 'hover:bg-earth-accent2'}`}
          >
            Budget
          </Link>
        </nav>
      </div>
    </header>
  );
}
