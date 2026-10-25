"use client";

import { useCallback, useEffect, useState } from "react";

export type Influencer = {
  id: string;
  name: string;
  description: string | null;
  prompt: string | null;
  face_image_id: string | null;
  face_url: string | null;
};
export type Img = {
  id: string;
  influencer_id?: string;
  kind: string;
  url: string;
  prompt: string | null;
  angle: string | null;
  collection_id?: string | null;
};

export async function api<T = { ok: boolean; message?: string }>(url: string, method = "GET", body?: unknown): Promise<T & { ok: boolean; message?: string }> {
  try {
    const res = await fetch(url, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    return await res.json();
  } catch {
    return { ok: false, message: "Error de red al contactar la app." } as never;
  }
}

export function useInfluencers() {
  const [list, setList] = useState<Influencer[]>([]);
  const [loaded, setLoaded] = useState(false);
  const reload = useCallback(async () => {
    const d = await api<{ influencers: Influencer[] }>("/api/influencers");
    if (d.ok) setList(d.influencers);
    setLoaded(true);
  }, []);
  useEffect(() => { reload(); }, [reload]);
  return { list, loaded, reload };
}

export function useConfigured() {
  const [configured, setConfigured] = useState<Record<string, boolean>>({});
  useEffect(() => {
    api<{ providers: { id: string; savedAt: string | null }[] }>("/api/keys").then((d) =>
      setConfigured(Object.fromEntries((d.providers ?? []).map((p) => [p.id, !!p.savedAt]))),
    );
  }, []);
  return configured;
}

// Reduce fotos grandes (celular) antes de enviarlas: máx. 1536px, JPEG.
export function readImage(f: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!f.type.startsWith("image/")) return reject(new Error("Elige un archivo de imagen."));
    const url = URL.createObjectURL(f);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, 1536 / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * scale);
      c.height = Math.round(img.height * scale);
      c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL("image/jpeg", 0.9));
    };
    img.onerror = () => reject(new Error("No se pudo leer la imagen."));
    img.src = url;
  });
}
