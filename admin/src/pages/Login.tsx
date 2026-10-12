import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-surface rounded-2xl p-8 border border-border">
        <h1 className="text-2xl font-bold mb-2 text-center">Admin Panel</h1>
        <p className="text-text-secondary text-sm text-center mb-6">
          Prijavi se za upravljanje receptima
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-text-secondary text-xs block mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white focus:border-primary outline-none"
              required
            />
          </div>

          <div>
            <label className="text-text-secondary text-xs block mb-2">
              Lozinka
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tvoja lozinka"
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white focus:border-primary outline-none"
              required
            />
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-background font-bold py-3 rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Prijava..." : "Prijavi se"}
          </button>
        </form>
      </div>
    </div>
  );
}