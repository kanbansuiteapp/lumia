export type Inline = { mimeType: string; data: string };
type Input = { prompt: string; references: Inline[]; aspect: string };

const OPENAI_SIZE: Record<string, string> = { auto: "auto", "3:4": "1024x1536", "9:16": "1024x1536", "1:1": "1024x1024", "16:9": "1536x1024" };

const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

async function gemini(model: string, { prompt, references, aspect }: Input, key: string): Promise<Inline> {
  const parts: unknown[] = [];
  for (const r of references) parts.push({ inlineData: { mimeType: r.mimeType, data: r.data } });
  parts.push({ text: prompt });
  const res = await fetch(`${GEMINI_BASE}/${model}:generateContent`, {
    method: "POST",
    headers: { "x-goog-api-key": key, "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts }], generationConfig: { responseModalities: ["TEXT", "IMAGE"], ...(aspect === "auto" ? {} : { imageConfig: { aspectRatio: aspect } }) } }),
    signal: AbortSignal.timeout(110000),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Gemini respondió ${res.status}: ${json?.error?.message ?? "error desconocido"}`);
  const img = json?.candidates?.[0]?.content?.parts?.find((p: { inlineData?: unknown }) => p.inlineData)?.inlineData;
  if (!img) {
    const why = json?.candidates?.[0]?.finishReason ?? json?.promptFeedback?.blockReason ?? "sin imagen en la respuesta";
    throw new Error(`Gemini no devolvió imagen (${why}).`);
  }
  return { mimeType: img.mimeType, data: img.data };
}

async function openai(model: string, { prompt, references, aspect }: Input, key: string): Promise<Inline> {
  const headers: Record<string, string> = { Authorization: `Bearer ${key}` };
  let res: Response;
  const size = OPENAI_SIZE[aspect] ?? "1024x1536";
  if (references.length) {
    const form = new FormData();
    form.set("model", model);
    form.set("prompt", prompt);
    form.set("size", size);
    references.forEach((r, i) => {
      const ext = r.mimeType.split("/")[1] ?? "png";
      form.append("image[]", new Blob([Buffer.from(r.data, "base64")], { type: r.mimeType }), `ref${i}.${ext}`);
    });
    res = await fetch("https://api.openai.com/v1/images/edits", { method: "POST", headers, body: form, signal: AbortSignal.timeout(170000) });
  } else {
    res = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ model, prompt, size }),
      signal: AbortSignal.timeout(170000),
    });
  }
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`OpenAI respondió ${res.status}: ${json?.error?.message ?? "error desconocido"}`);
  const b64 = json?.data?.[0]?.b64_json;
  if (!b64) throw new Error("OpenAI no devolvió imagen.");
  return { mimeType: "image/png", data: b64 };
}

async function replicate(model: string, { prompt, references, aspect }: Input, key: string): Promise<Inline> {
  const input: Record<string, unknown> = { prompt, output_format: "jpg" };
  if (model.includes("kontext")) {
    const reference = references[0];
    if (!reference) throw new Error("Flux Kontext Pro necesita una imagen de partida o de referencia.");
    input.input_image = `data:${reference.mimeType};base64,${reference.data}`;
    input.aspect_ratio = "match_input_image";
  } else {
    input.aspect_ratio = aspect === "auto" ? "3:4" : aspect;
  }
  const headers = { Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
  const res = await fetch(`https://api.replicate.com/v1/models/${model}/predictions`, {
    method: "POST",
    headers: { ...headers, Prefer: "wait=60" },
    body: JSON.stringify({ input }),
    signal: AbortSignal.timeout(90000),
  });
  let pred = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Replicate respondió ${res.status}: ${pred?.detail ?? "error desconocido"}`);

  const deadline = Date.now() + 100000;
  while (pred.status === "starting" || pred.status === "processing") {
    if (Date.now() > deadline) throw new Error("Replicate tardó demasiado.");
    await new Promise((r) => setTimeout(r, 2000));
    pred = await (await fetch(pred.urls.get, { headers })).json();
  }
  if (pred.status !== "succeeded") throw new Error(`Replicate falló: ${pred.error ?? pred.status}`);

  const url = Array.isArray(pred.output) ? pred.output[0] : pred.output;
  const img = await fetch(url);
  if (!img.ok) throw new Error("No se pudo descargar la imagen de Replicate.");
  return { mimeType: img.headers.get("content-type") ?? "image/jpeg", data: Buffer.from(await img.arrayBuffer()).toString("base64") };
}

export const generators: Record<string, (model: string, input: Input, key: string) => Promise<Inline>> = {
  gemini,
  openai,
  replicate,
};
