import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiDelete, apiGet } from "../lib/api";

type Food = {
  id: string;
  name: string;
  nameEn: string | null;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  icon: string | null;
};

export default function FoodsList() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadFoods();
  }, []);

  async function loadFoods() {
    try {
      setLoading(true);
      const data = await apiGet<Food[]>("/foods");
      setFoods(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Obrisati namirnicu "${name}"?`)) return;
    try {
      await apiDelete(`/foods/${id}`);
      loadFoods();
    } catch (e: any) {
      alert(e.message);
    }
  }

  const filtered = foods.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      (f.nameEn || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Namirnice</h1>
        <div className="flex gap-3">
          <Link
            to="/foods/new"
            className="bg-primary text-background font-bold px-6 py-2 rounded-lg hover:opacity-90"
          >
            + Nova namirnica
          </Link>
          <Link
            to="/"
            className="border border-border px-4 py-2 rounded-lg text-text-secondary hover:text-white"
          >
            Nazad
          </Link>
        </div>
      </div>

      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Pretrazi namirnice..."
          className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-white outline-none focus:border-primary"
        />
      </div>

      {loading && <p className="text-text-secondary">Ucitavanje...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!loading && filtered.length === 0 && (
        <div className="bg-surface border border-border rounded-xl p-12 text-center">
          <p className="text-text-secondary">Nema namirnica.</p>
        </div>
      )}

      <div className="space-y-2">
        {filtered.map((f) => (
          <div
            key={f.id}
            className="bg-surface border border-border rounded-xl p-4 flex items-center gap-4"
          >
            <div className="w-12 h-12 flex items-center justify-center bg-background rounded-lg text-2xl">
              {f.icon || "🍽️"}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg">{f.name}</h3>
              <p className="text-text-secondary text-sm">
                {f.nameEn || "-"} · {f.category} · {f.calories} kcal/100g
              </p>
            </div>
            <div className="text-text-secondary text-xs">
              P: {f.protein}g · UH: {f.carbs}g · M: {f.fat}g
            </div>
            <Link
              to={`/foods/${f.id}`}
              className="border border-border px-4 py-2 rounded-lg text-sm hover:border-primary"
            >
              Izmeni
            </Link>
            <button
              onClick={() => handleDelete(f.id, f.name)}
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