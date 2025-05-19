export default function Footer() {
  return (
    <footer className="bg-earth-card text-earth p-4 mt-8 border-t border-earth">
      <div className="max-w-7xl mx-auto text-center text-sm">
        &copy; {new Date().getFullYear()} Uncompiled Insanity. All rights
        reserved.
      </div>
    </footer>
  );
}
