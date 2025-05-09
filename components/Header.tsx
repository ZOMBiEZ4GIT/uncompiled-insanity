﻿import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold">
          <Link href="/">Uncompiled Insanity</Link>
        </h1>
      </div>
    </header>
  );
}
