import { supabase } from "./supabase";

const API_URL = import.meta.env.VITE_API_URL;

export type UploadResult = {
  url: string;
  size: number;
  originalSize: number;
};

export async function uploadRecipeImage(file: File): Promise<UploadResult> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  if (!token) {
    throw new Error("Nisi prijavljen");
  }

  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${API_URL}/upload/recipe-image`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Upload failed: ${res.status}`);
  }

  return res.json();
}
