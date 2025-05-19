import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-earth-card text-earth border-b border-earth shadow-card">
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-2xl font-bold">
          <Link
            href="/"
            className="text-earth-primary hover:text-earth-accent transition-colors duration-200"
          >
            Uncompiled Insanity
          </Link>
        </h1>
      </div>
    </header>
  );
}
