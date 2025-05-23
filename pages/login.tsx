import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.push('/');
    } else {
      const data = await res.json();
      setError(data.error || 'Invalid password');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-earth-background text-earth">
      <form
        onSubmit={handleSubmit}
        className="bg-earth-card p-6 rounded-xl shadow-card flex flex-col gap-4 border border-earth"
      >
        <h1 className="text-2xl font-bold text-center text-earth-primary">Login</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-64 px-3 py-2 rounded border border-earth bg-earth-background focus:outline-none focus:ring-2 focus:ring-earth-accent"
          placeholder="Password"
        />
        <button
          type="submit"
          className="py-2 px-4 rounded bg-earth-accent text-earth font-bold hover:bg-earth-accent2 transition"
        >
          Enter
        </button>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      </form>
    </main>
  );
}
