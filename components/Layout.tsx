import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-earth-background text-earth">
      {children}
    </div>
  );
}
