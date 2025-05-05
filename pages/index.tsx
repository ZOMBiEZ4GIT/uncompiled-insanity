export default function Home() {
  return (
    <div className="container mx-auto p-4">
      {/* Hero Section */}
      <section className="text-center py-16">
        <h1 className="text-5xl font-bold">Welcome to Uncompiled Insanity</h1>
        <p className="mt-4 text-xl text-gray-700">
          Your Next.js + TailwindCSS Starter
        </p>
        <a
          href="#features"
          className="mt-8 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Explore Features
        </a>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16">
        <h2 className="text-3xl font-semibold text-center mb-8">Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="p-6 border rounded-lg hover:shadow-lg transition">
            <h3 className="text-xl font-bold mb-2">⚡️ Fast Setup</h3>
            <p>
              Get up and running quickly with Next.js and TailwindCSS configured
              out of the box.
            </p>
          </div>
          <div className="p-6 border rounded-lg hover:shadow-lg transition">
            <h3 className="text-xl font-bold mb-2">🎨 Utility-First</h3>
            <p>
              Style your components with Tailwind’s intuitive, low-level utility
              classes.
            </p>
          </div>
          <div className="p-6 border rounded-lg hover:shadow-lg transition">
            <h3 className="text-xl font-bold mb-2">🔄 CI Ready</h3>
            <p>
              Integrated GitHub Actions workflow ensures code quality with
              linting and builds.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
