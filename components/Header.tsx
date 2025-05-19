import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-earth-card text-earth py-4 shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-2xl font-extrabold text-earth-primary">
          <Link href="/">Uncompiled Insanity</Link>
        </h1>
      </div>
    </header>
  );
}
