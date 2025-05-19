import React from 'react';
import Header from './Header';
import NavBar from './NavBar';
import Footer from './Footer';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex flex-col bg-earth-background text-earth dark:bg-[#111827]">
      <Header />
      <NavBar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
