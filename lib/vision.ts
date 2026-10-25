import { loadCredentials } from "./store";
import type { Inline } from "./generators";

const ORDER = ["gemini", "anthropic", "openai"] as const;

async function gemini(prompt: string, images: Inline[], key: string) {
  const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent", {
    method: "POST",
    headers: { "x-goog-api-key": key, "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [...images.map((i) => ({ inlineData: { mimeType: i.mimeType, data: i.data } })), { text: prompt }] }],
    }),
    signal: AbortSignal.timeout(90000),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Gemini respondió ${res.status}: ${json?.error?.message ?? "error"}`);
  return json?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? "").join("") as string;
}

async function anthropic(prompt: string, images: Inline[], key: string) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-5-5",
      max_tokens: 2000,
      messages: [{
        role: "user",
        content: [
          ...images.map((i) => ({ type: "image", source: { type: "base64", media_type: i.mimeType, data: i.data } })),
          { type: "text", text: prompt },
        ],
      }],
    }),
    signal: AbortSignal.timeout(90000),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Anthropic respondió ${res.status}: ${json?.error?.message ?? "error"}`);
  return json?.content?.map((c: { text?: string }) => c.text ?? "").join("") as string;
}

async function openai(prompt: string, images: Inline[], key: string) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-5.4-mini",
      max_completion_tokens: 2500,
      messages: [{
        role: "user",
        content: [
          ...images.map((i) => ({ type: "image_url", image_url: { url: `data:${i.mimeType};base64,${i.data}` } })),
          { type: "text", text: prompt },
        ],
      }],
    }),
    signal: AbortSignal.timeout(90000),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`OpenAI respondió ${res.status}: ${json?.error?.message ?? "error"}`);
  return json?.choices?.[0]?.message?.content as string;
}

const impl = { gemini, anthropic, openai };

// Usa el primer proveedor con API guardada que entienda imágenes.
export async function describeImages(userId: string, prompt: string, images: Inline[]): Promise<string> {
  for (const id of ORDER) {
    const creds = await loadCredentials(userId, id);
    if (!creds) continue;
    const text = await impl[id](prompt, images, creds.apiKey);
    if (!text?.trim()) throw new Error("El proveedor no devolvió texto.");
    return text.trim();
  }
  throw new Error("Falta una API de Gemini, Anthropic u OpenAI en Configuración para analizar imágenes.");
}
