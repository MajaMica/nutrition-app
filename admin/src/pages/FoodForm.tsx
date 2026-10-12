import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { apiGet, apiPost, apiPut } from "../lib/api";

type FoodData = {
  name: string;
  nameEn: string;
  category: string;
  calories: number | "";
  protein: number | "";
  carbs: number | "";
  fat: number | "";
  fiber: number | "";
  sugar: number | "";
  icon: string;
};

const CATEGORIES = [
  "dairy",
  "meat",
  "veggies",
  "fruits",
  "grains",
  "legumes",
  "oils",
];

export default function FoodForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<FoodData>({
    name: "",
    nameEn: "",
    category: "dairy",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    fiber: "",
    sugar: "",
    icon: "",
  });

  useEffect(() => {
    if (isEdit) loadFood();
  }, [id]);

  async function loadFood() {
    try {
      setLoading(true);
      const data: any = await apiGet(`/foods/${id}`);
      setForm({
        name: data.name || "",
        nameEn: data.nameEn || "",
        category: data.category || "dairy",
        calories: data.calories ?? "",
        protein: data.protein ?? "",
        carbs: data.carbs ?? "",
        fat: data.fat ?? "",
        fiber: data.fiber ?? "",
        sugar: data.sugar ?? "",
        icon: data.icon || "",
      });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        name: form.name,
        nameEn: form.nameEn || null,
        category: form.category,
        calories: Number(form.calories) || 0,
        protein: Number(form.protein) || 0,
        carbs: Number(form.carbs) || 0,
        fat: Number(form.fat) || 0,
        fiber: form.fiber === "" ? null : Number(form.fiber),
        sugar: form.sugar === "" ? null : Number(form.sugar),
        icon: form.icon || null,
      };

      if (isEdit) {
        await apiPut(`/foods/${id}`, payload);
      } else {
        await apiPost("/foods", payload);
      }

      navigate("/foods");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen p-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">
          {isEdit ? "Izmeni namirnicu" : "Nova namirnica"}
        </h1>
        <Link
          to="/foods"
          className="border border-border px-4 py-2 rounded-lg text-text-secondary hover:text-white"
        >
          Nazad
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-text-secondary text-xs block mb-2">
                Naziv (SR)
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white outline-none focus:border-primary"
                required
              />
            </div>
            <div>
              <label className="text-text-secondary text-xs block mb-2">
                Naziv (EN)
              </label>
              <input
                type="text"
                value={form.nameEn}
                onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-text-secondary text-xs block mb-2">
                Kategorija
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white outline-none focus:border-primary"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-text-secondary text-xs block mb-2">
                Ikonica (emoji)
              </label>
              <input
                type="text"
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                placeholder="🧀"
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-6">
          <h2 className="text-lg font-bold mb-4">Nutritivne vrednosti (na 100g)</h2>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-text-secondary text-xs block mb-2">
                Kalorije
              </label>
              <input
                type="number"
                step="0.1"
                value={form.calories}
                onChange={(e) =>
                  setForm({
                    ...form,
                    calories: e.target.value === "" ? "" : Number(e.target.value),
                  })
                }
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white outline-none focus:border-primary"
                required
              />
            </div>
            <div>
              <label className="text-text-secondary text-xs block mb-2">
                Proteini (g)
              </label>
              <input
                type="number"
                step="0.1"
                value={form.protein}
                onChange={(e) =>
                  setForm({
                    ...form,
                    protein: e.target.value === "" ? "" : Number(e.target.value),
                  })
                }
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-text-secondary text-xs block mb-2">
                Ugljeni hidrati (g)
              </label>
              <input
                type="number"
                step="0.1"
                value={form.carbs}
                onChange={(e) =>
                  setForm({
                    ...form,
                    carbs: e.target.value === "" ? "" : Number(e.target.value),
                  })
                }
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-text-secondary text-xs block mb-2">
                Masti (g)
              </label>
              <input
                type="number"
                step="0.1"
                value={form.fat}
                onChange={(e) =>
                  setForm({
                    ...form,
                    fat: e.target.value === "" ? "" : Number(e.target.value),
                  })
                }
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-text-secondary text-xs block mb-2">
                Vlakna (g)
              </label>
              <input
                type="number"
                step="0.1"
                value={form.fiber}
                onChange={(e) =>
                  setForm({
                    ...form,
                    fiber: e.target.value === "" ? "" : Number(e.target.value),
                  })
                }
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-text-secondary text-xs block mb-2">
                Seceri (g)
              </label>
              <input
                type="number"
                step="0.1"
                value={form.sugar}
                onChange={(e) =>
                  setForm({
                    ...form,
                    sugar: e.target.value === "" ? "" : Number(e.target.value),
                  })
                }
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-primary text-background font-bold py-4 rounded-xl hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Cuvanje..." : isEdit ? "Sacuvaj izmene" : "Kreiraj namirnicu"}
          </button>
          <Link
            to="/foods"
            className="border border-border px-8 py-4 rounded-xl text-text-secondary hover:text-white"
          >
            Otkazi
          </Link>
        </div>
      </form>
    </div>
  );
}