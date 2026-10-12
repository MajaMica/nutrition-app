import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { apiDelete, apiGet } from "../lib/api";

type Recipe = {
  id: string;
  title: string;
  description: string | null;
  mealType: string;
  calories: number;
  isPremium: boolean;
  isPublished: boolean;
};

export default function Dashboard() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadRecipes();
  }, []);

  async function loadRecipes() {
    try {
      setLoading(true);
      const data = await apiGet<Recipe[]>("/recipes");
      setRecipes(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Obrisati recept?")) return;
    try {
      await apiDelete(`/recipes/${id}`);
      loadRecipes();
    } catch (e: any) {
      alert(e.message);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  return (
    <div className="min-h-screen p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Recepti</h1>
        <div className="flex gap-3">
          <Link
            to="/foods"
            className="border border-border px-4 py-2 rounded-lg text-text-secondary hover:text-white"
          >
            Namirnice
          </Link>
          <Link
            to="/recipes/new"
            className="bg-primary text-background font-bold px-6 py-2 rounded-lg hover:opacity-90"
          >
            + Novi recept
          </Link>
          <button
            onClick={handleLogout}
            className="border border-border px-4 py-2 rounded-lg text-text-secondary hover:text-white"
          >
            Odjavi se
          </button>
        </div>
      </div>

      {loading && <p className="text-text-secondary">Ucitavanje...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!loading && recipes.length === 0 && (
        <div className="bg-surface border border-border rounded-xl p-12 text-center">
          <p className="text-text-secondary mb-4">Jos nema recepata.</p>
          <Link
            to="/recipes/new"
            className="inline-block bg-primary text-background font-bold px-6 py-2 rounded-lg"
          >
            Dodaj prvi recept
          </Link>
        </div>
      )}

      <div className="space-y-3">
        {recipes.map((r) => (
          <div
            key={r.id}
            className="bg-surface border border-border rounded-xl p-4 flex items-center gap-4"
          >
            <div className="flex-1">
              <h3 className="font-bold text-lg">{r.title}</h3>
              <p className="text-text-secondary text-sm">
                {r.mealType} · {r.calories} kcal
                {r.isPremium && " · Premium"}
                {!r.isPublished && " · Skriveno"}
              </p>
            </div>
            <Link
              to={`/recipes/${r.id}`}
              className="border border-border px-4 py-2 rounded-lg text-sm hover:border-primary"
            >
              Izmeni
            </Link>
            <button
              onClick={() => handleDelete(r.id)}
              className="border border-red-500/50 text-red-400 px-4 py-2 rounded-lg text-sm hover:bg-red-500/20"
            >
              Obrisi
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}