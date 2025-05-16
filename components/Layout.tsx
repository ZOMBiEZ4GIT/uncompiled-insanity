import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-[#f8fafc] dark:bg-[#111827]">
      {children}
    </div>
  );
}
