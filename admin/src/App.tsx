import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RecipeForm from "./pages/RecipeForm";
import FoodsList from "./pages/FoodsList";
import FoodForm from "./pages/FoodForm";

function App() {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuth(!!session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setIsAuth(!!session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-secondary">Ucitavanje...</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={isAuth ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/"
          element={isAuth ? <Dashboard /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/recipes/new"
          element={isAuth ? <RecipeForm /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/recipes/:id"
          element={isAuth ? <RecipeForm /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/foods"
          element={isAuth ? <FoodsList /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/foods/new"
          element={isAuth ? <FoodForm /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/foods/:id"
          element={isAuth ? <FoodForm /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;