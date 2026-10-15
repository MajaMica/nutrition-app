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
    <div className="min-h-screen p-4 sm:p-6 md:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl md:text-3xl font-bold">Recepti</h1>
          <button
            onClick={handleLogout}
            className="border border-border px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-text-secondary hover:text-white text-sm"
          >
            Odjavi se
          </button>
        </div>

        <div className="flex flex-wrap gap-2 md:gap-3">
          <Link
            to="/foods"
            className="flex-1 sm:flex-none text-center border border-border px-4 py-2 rounded-lg text-text-secondary hover:text-white text-sm whitespace-nowrap"
          >
            Namirnice
          </Link>
          <Link
            to="/recipes/new"
            className="flex-1 sm:flex-none text-center bg-primary text-background font-bold px-4 md:px-6 py-2 rounded-lg hover:opacity-90 text-sm whitespace-nowrap"
          >
            + Novi recept
          </Link>
        </div>
      </div>

      {loading && <p className="text-text-secondary">Ucitavanje...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!loading && recipes.length === 0 && (
        <div className="bg-surface border border-border rounded-xl p-8 md:p-12 text-center">
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
            className="bg-surface border border-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4"
          >
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-base md:text-lg break-words">
                {r.title}
              </h3>
              <p className="text-text-secondary text-xs md:text-sm mt-0.5">
                {r.mealType} · {r.calories} kcal
                {r.isPremium && " · Premium"}
                {!r.isPublished && " · Skriveno"}
              </p>
            </div>
            <div className="flex gap-2 sm:shrink-0">
              <Link
                to={`/recipes/${r.id}`}
                className="flex-1 sm:flex-none text-center border border-border px-4 py-2 rounded-lg text-sm hover:border-primary whitespace-nowrap"
              >
                Izmeni
              </Link>
              <button
                onClick={() => handleDelete(r.id)}
                className="flex-1 sm:flex-none border border-red-500/50 text-red-400 px-4 py-2 rounded-lg text-sm hover:bg-red-500/20 whitespace-nowrap"
              >
                Obrisi
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}