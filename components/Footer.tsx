export default function Footer() {
  return (
    <footer className="bg-earth-card text-earth border-t border-earth p-4 mt-8">
      <div className="max-w-7xl mx-auto text-center text-sm">
        &copy; {new Date().getFullYear()} Uncompiled Insanity. All rights reserved.
      </div>
    </footer>
  );
}
