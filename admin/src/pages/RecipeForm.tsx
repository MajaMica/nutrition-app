import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { apiGet, apiPost, apiPut } from "../lib/api";
import { uploadRecipeImage } from "../lib/uploadImage";

type Food = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar: number | null;
  fiber: number | null;
  salt: number | null;
  saturatedFat: number | null;
  icon: string | null;
};

type Ingredient = {
  foodId: string;
  amount: number;
  unit: string;
};

type Step = {
  text: string;
  textEn: string;
};

type RecipeData = {
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  image: string;
  mealTypes: string[];
  dietTypes: string[];
  difficulty: string;
  prepTime: number | "";
  servings: number;
  isPremium: boolean;
  isPublished: boolean;
  ingredients: Ingredient[];
  steps: Step[];
};

const MEAL_TYPES = ["dorucak", "rucak", "vecera", "uzina"];

const DIET_TYPES = [
  "vegetarian",
  "vegan",
  "gluten-free",
  "lactose-free",
  "noSugar",
  "noPork",
  "fasting",
];

const DIFFICULTIES = ["", "lako", "srednje", "tesko"];
const UNITS = ["g", "tbsp", "tsp", "cup"];

export default function RecipeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<RecipeData>({
    title: "",
    titleEn: "",
    description: "",
    descriptionEn: "",
    image: "",
    mealTypes: [],
    dietTypes: [],
    difficulty: "",
    prepTime: "",
    servings: 1,
    isPremium: false,
    isPublished: true,
    ingredients: [],
    steps: [{ text: "", textEn: "" }],
  });

  useEffect(() => {
    loadFoods();
    if (isEdit) loadRecipe();
  }, [id]);

  async function loadFoods() {
    try {
      const data = await apiGet<Food[]>("/foods");
      setFoods(data);
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function loadRecipe() {
    try {
      setLoading(true);
      const data: any = await apiGet(`/recipes/${id}`);

      let mealTypes: string[] = [];
      if (Array.isArray(data.mealTypes) && data.mealTypes.length > 0) {
        mealTypes = data.mealTypes;
      } else if (data.mealType) {
        mealTypes = [data.mealType];
      }

      let dietTypes: string[] = [];
      if (Array.isArray(data.dietTypes) && data.dietTypes.length > 0) {
        dietTypes = data.dietTypes;
      } else if (data.dietType) {
        dietTypes = [data.dietType];
      }

      setForm({
        title: data.title || "",
        titleEn: data.titleEn || "",
        description: data.description || "",
        descriptionEn: data.descriptionEn || "",
        image: data.image || "",
        mealTypes,
        dietTypes,
        difficulty: data.difficulty || "",
        prepTime: data.prepTime ?? "",
        servings: data.servings || 1,
        isPremium: data.isPremium || false,
        isPublished: data.isPublished !== false,
        ingredients: (data.ingredients || []).map((i: any) => ({
          foodId: i.foodId,
          amount: i.amount,
          unit: i.unit || "g",
        })),
        steps: (data.steps || []).map((s: any) => ({
          text: s.text,
          textEn: s.textEn || "",
        })),
      });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const result = await uploadRecipeImage(file);
      setForm((f) => ({ ...f, image: result.url }));
    } catch (e: any) {
      setError(`Upload greska: ${e.message}`);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function removeImage() {
    setForm((f) => ({ ...f, image: "" }));
  }

  function toggleMealType(value: string) {
    setForm((f) => ({
      ...f,
      mealTypes: f.mealTypes.includes(value)
        ? f.mealTypes.filter((v) => v !== value)
        : [...f.mealTypes, value],
    }));
  }

  function toggleDietType(value: string) {
    setForm((f) => ({
      ...f,
      dietTypes: f.dietTypes.includes(value)
        ? f.dietTypes.filter((v) => v !== value)
        : [...f.dietTypes, value],
    }));
  }

  function addIngredient() {
    setForm((f) => ({
      ...f,
      ingredients: [...f.ingredients, { foodId: "", amount: 100, unit: "g" }],
    }));
  }

  function updateIngredient(index: number, patch: Partial<Ingredient>) {
    setForm((f) => ({
      ...f,
      ingredients: f.ingredients.map((ing, i) =>
        i === index ? { ...ing, ...patch } : ing
      ),
    }));
  }

  function removeIngredient(index: number) {
    setForm((f) => ({
      ...f,
      ingredients: f.ingredients.filter((_, i) => i !== index),
    }));
  }

  function addStep() {
    setForm((f) => ({
      ...f,
      steps: [...f.steps, { text: "", textEn: "" }],
    }));
  }

  function updateStep(index: number, patch: Partial<Step>) {
    setForm((f) => ({
      ...f,
      steps: f.steps.map((s, i) => (i === index ? { ...s, ...patch } : s)),
    }));
  }

  function removeStep(index: number) {
    setForm((f) => ({
      ...f,
      steps: f.steps.filter((_, i) => i !== index),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.mealTypes.length === 0) {
      setError("Izaberi bar jedan tip obroka");
      return;
    }

    setLoading(true);

    try {
      const primaryMealType = form.mealTypes[0];
      const primaryDietType = form.dietTypes[0] || "";

      const payload = {
        ...form,
        mealType: primaryMealType,
        dietType: primaryDietType,
        prepTime: form.prepTime === "" ? null : Number(form.prepTime),
        ingredients: form.ingredients.filter((i) => i.foodId),
        steps: form.steps.filter((s) => s.text.trim() || s.textEn.trim()),
      };

      if (isEdit) {
        await apiPut(`/recipes/${id}`, payload);
      } else {
        await apiPost("/recipes", payload);
      }

      navigate("/");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const totalNutrition = form.ingredients.reduce(
    (acc, ing) => {
      const food = foods.find((f) => f.id === ing.foodId);
      if (!food) return acc;

      let grams = ing.amount;
      if (ing.unit === "tbsp") grams = ing.amount * 15;
      else if (ing.unit === "tsp") grams = ing.amount * 5;
      else if (ing.unit === "cup") grams = ing.amount * 240;

      const factor = grams / 100;
      acc.calories += food.calories * factor;
      acc.protein += food.protein * factor;
      acc.carbs += food.carbs * factor;
      acc.fat += food.fat * factor;
      acc.fiber += (food.fiber || 0) * factor;
      acc.salt += (food.salt || 0) * factor;
      acc.saturatedFat += (food.saturatedFat || 0) * factor;
      acc.sugar += (food.sugar || 0) * factor;
      return acc;
    },
        { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, salt: 0, saturatedFat: 0, sugar: 0 }
  );

  if (loading && isEdit && !form.title) {
    return <div className="p-8 text-text-secondary">Ucitavanje...</div>;
  }

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">
          {isEdit ? "Izmeni recept" : "Novi recept"}
        </h1>
        <Link
          to="/"
          className="border border-border px-4 py-2 rounded-lg text-text-secondary hover:text-white"
        >
          Nazad
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="bg-surface border border-border rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-bold mb-2">Osnovno</h2>

          <div>
            <label className="text-textSecondary text-xs block mb-2">
              Naslov (SR)
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white outline-none focus:border-primary"
              required
            />
          </div>

          <div>
            <label className="text-textSecondary text-xs block mb-2">
              Naslov (EN)
            </label>
            <input
              type="text"
              value={form.titleEn}
              onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
              placeholder="Recipe title in English"
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-textSecondary text-xs block mb-2">
              Opis (SR)
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white outline-none focus:border-primary resize-none"
            />
          </div>

          <div>
            <label className="text-textSecondary text-xs block mb-2">
              Opis (EN)
            </label>
            <textarea
              value={form.descriptionEn}
              onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })}
              rows={3}
              placeholder="Recipe description in English"
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white outline-none focus:border-primary resize-none"
            />
          </div>

          <div>
            <label className="text-textSecondary text-xs block mb-2">
              Slika recepta
            </label>

            {form.image ? (
              <div className="space-y-3">
                <div className="relative w-full max-w-sm">
                  <img
                    src={form.image}
                    alt="Recipe"
                    className="w-full h-48 object-cover rounded-lg border border-border"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="px-4 py-2 bg-surface border border-border rounded-lg text-text text-sm hover:border-primary disabled:opacity-50"
                  >
                    {uploading ? "Upload..." : "Promeni sliku"}
                  </button>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="px-4 py-2 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm hover:bg-red-500/30"
                  >
                    Ukloni sliku
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full border-2 border-dashed border-border rounded-lg py-8 flex flex-col items-center justify-center hover:border-primary transition-colors disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <div className="text-4xl mb-2">⏳</div>
                      <span className="text-textSecondary text-sm">
                        Uploadujem...
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="text-4xl mb-2">📷</div>
                      <span className="text-text text-sm font-medium">
                        Klikni da izabereš sliku
                      </span>
                      <span className="text-textSecondary text-xs mt-1">
                        PNG, JPG ili WebP (max 10 MB)
                      </span>
                    </>
                  )}
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div>
            <label className="text-textSecondary text-xs block mb-2">
              Tip obroka <span className="text-primary">(može više)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {MEAL_TYPES.map((m) => {
                const isActive = form.mealTypes.includes(m);
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => toggleMealType(m)}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium capitalize ${
                      isActive
                        ? "bg-primary border-primary text-background"
                        : "bg-background border-border text-text"
                    }`}
                  >
                    {isActive && "✓ "}
                    {m}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-textSecondary text-xs block mb-2">
              Tip ishrane <span className="text-primary">(može više, opciono)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {DIET_TYPES.map((d) => {
                const isActive = form.dietTypes.includes(d);
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggleDietType(d)}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium ${
                      isActive
                        ? "bg-primary border-primary text-background"
                        : "bg-background border-border text-text"
                    }`}
                  >
                    {isActive && "✓ "}
                    {d}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-textSecondary text-xs block mb-2">
                Tezina
              </label>
              <select
                value={form.difficulty}
                onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white outline-none focus:border-primary"
              >
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d}>
                    {d || "-"}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-textSecondary text-xs block mb-2">
                Vreme pripreme (min)
              </label>
              <input
                type="number"
                value={form.prepTime}
                onChange={(e) =>
                  setForm({
                    ...form,
                    prepTime: e.target.value === "" ? "" : Number(e.target.value),
                  })
                }
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-textSecondary text-xs block mb-2">
                Broj porcija
              </label>
              <input
                type="number"
                value={form.servings}
                onChange={(e) =>
                  setForm({ ...form, servings: Number(e.target.value) })
                }
                min={1}
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="flex gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isPremium}
                onChange={(e) => setForm({ ...form, isPremium: e.target.checked })}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm">Premium recept</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(e) =>
                  setForm({ ...form, isPublished: e.target.checked })
                }
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm">Objavljen</span>
            </label>
          </div>
        </section>

        <section className="bg-surface border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Sastojci</h2>
            <button
              type="button"
              onClick={addIngredient}
              className="bg-primary text-background text-sm font-bold px-4 py-2 rounded-lg"
            >
              + Dodaj sastojak
            </button>
          </div>

          {form.ingredients.length === 0 && (
            <p className="text-text-secondary text-sm">
              Nema sastojaka. Klikni "Dodaj sastojak".
            </p>
          )}

          <div className="space-y-3">
            {form.ingredients.map((ing, idx) => {
              return (
                <div key={idx} className="flex gap-2 items-center">
                  <select
                    value={ing.foodId}
                    onChange={(e) =>
                      updateIngredient(idx, { foodId: e.target.value })
                    }
                    className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-white outline-none focus:border-primary"
                  >
                    <option value="">-- izaberi namirnicu --</option>
                    {foods.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.icon ? f.icon + " " : ""}
                        {f.name}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    value={ing.amount}
                    onChange={(e) =>
                      updateIngredient(idx, { amount: Number(e.target.value) })
                    }
                    className="w-24 bg-background border border-border rounded-lg px-3 py-2 text-white outline-none focus:border-primary"
                  />

                  <select
                    value={ing.unit}
                    onChange={(e) =>
                      updateIngredient(idx, { unit: e.target.value })
                    }
                    className="w-24 bg-background border border-border rounded-lg px-3 py-2 text-white outline-none focus:border-primary"
                  >
                    {UNITS.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => removeIngredient(idx)}
                    className="text-red-400 px-3 py-2 hover:bg-red-500/20 rounded-lg"
                  >
                    X
                  </button>
                </div>
              );
            })}
          </div>

          {form.ingredients.length > 0 && (
            <div className="mt-6 pt-4 border-t border-border">
              <p className="text-textSecondary text-xs mb-2">
                Ukupno (automatski):
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <span>
                  <span className="text-primary font-bold">
                    {Math.round(totalNutrition.calories)}
                  </span>{" "}
                  kcal
                </span>
                <span>P: {Math.round(totalNutrition.protein)}g</span>
                <span>UH: {Math.round(totalNutrition.carbs)}g</span>
                <span>M: {Math.round(totalNutrition.fat)}g</span>
                <span>Vlakna: {totalNutrition.fiber.toFixed(1)}g</span>
                <span>So: {totalNutrition.salt.toFixed(1)}g</span>
                <span>Zasić. masti: {totalNutrition.saturatedFat.toFixed(1)}g</span>
                <span>Šećeri: {totalNutrition.sugar.toFixed(1)}g</span>
              </div>
            </div>
          )}
        </section>

        <section className="bg-surface border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Priprema</h2>
            <button
              type="button"
              onClick={addStep}
              className="bg-primary text-background text-sm font-bold px-4 py-2 rounded-lg"
            >
              + Dodaj korak
            </button>
          </div>

          <div className="space-y-3">
            {form.steps.map((step, idx) => (
              <div key={idx} className="flex gap-2 items-start">
                <span className="w-8 h-8 flex items-center justify-center bg-background border border-border rounded-full text-sm mt-1">
                  {idx + 1}
                </span>
                <div className="flex-1 gap-2 flex flex-col">
                  <textarea
                    value={step.text}
                    onChange={(e) => updateStep(idx, { text: e.target.value })}
                    rows={2}
                    placeholder="Korak (SR)"
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-white outline-none focus:border-primary resize-none"
                  />
                  <textarea
                    value={step.textEn}
                    onChange={(e) => updateStep(idx, { textEn: e.target.value })}
                    rows={2}
                    placeholder="Step (EN)"
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-white outline-none focus:border-primary resize-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeStep(idx)}
                  className="text-red-400 px-3 py-2 hover:bg-red-500/20 rounded-lg"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </section>

        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading || uploading}
            className="flex-1 bg-primary text-background font-bold py-4 rounded-xl hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Cuvanje..." : isEdit ? "Sacuvaj izmene" : "Kreiraj recept"}
          </button>
          <Link
            to="/"
            className="border border-border px-8 py-4 rounded-xl text-text-secondary hover:text-white"
          >
            Otkazi
          </Link>
        </div>
      </form>
    </div>
  );
}