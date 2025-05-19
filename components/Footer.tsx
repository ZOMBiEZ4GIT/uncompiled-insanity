export default function Footer() {
  return (
    <footer className="bg-earth-card text-earth-muted mt-8 border-t border-earth shadow-card">
      <div className="max-w-7xl mx-auto text-center text-sm p-4">
        <p className="animate-fade-in">
          &copy; {new Date().getFullYear()} Uncompiled Insanity. All rights reserved.
        </p>
      </div>
    </footer>
  );
}