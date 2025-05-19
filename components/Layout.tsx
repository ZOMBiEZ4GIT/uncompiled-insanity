import Header from './Header';
import Footer from './Footer';
import NavBar from './NavBar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-earth-background text-earth animate-fade-in">
      <Header />
      <NavBar />
      <main className="flex-1 container mx-auto px-4 py-8 animate-slide-up">
        {children}
      </main>
      <Footer />
    </div>
  );
}