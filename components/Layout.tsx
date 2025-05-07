import React from 'react';
import Link from 'next/link';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/data-entry', label: 'Data Entry' },
  { href: '/debt-tracker', label: 'Debt Tracker' },
  { href: '/budget', label: 'Budget' },
  { href: '/budget-playground', label: 'Budget Playground' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#111827]">
      <nav className="sticky top-0 z-50 w-full bg-[#111827] text-white border-b border-zinc-800 shadow flex items-center justify-between px-8 py-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-extrabold text-white tracking-tight select-none">
            💸 Insanity
          </span>
        </div>
        <div className="flex gap-2 md:gap-4 items-center">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} legacyBehavior>
              <a className="px-3 py-1 rounded-lg font-bold text-white hover:bg-zinc-800 transition">
                {link.label}
              </a>
            </Link>
          ))}
        </div>
      </nav>
      <main className="flex-1 flex flex-col items-center justify-center px-2 py-8 md:py-12">
        <div className="w-full max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
