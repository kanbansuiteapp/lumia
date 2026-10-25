import { createHmac } from "node:crypto";

export type Field = { name: string; label: string };
export type TestResult = { ok: boolean; message: string };
export type Provider = {
  id: string;
  name: string;
  usedFor: string;
  fields: Field[];
  test: (v: Record<string, string>) => Promise<TestResult>;
};

async function check(
  url: string,
  headers: Record<string, string>,
  okMessage: string,
): Promise<TestResult> {
  try {
    const res = await fetch(url, { headers, signal: AbortSignal.timeout(15000) });
    if (res.ok) return { ok: true, message: okMessage };
    if (res.status === 401 || res.status === 403)
      return { ok: false, message: "Clave rechazada por el proveedor (inválida o sin permisos)." };
    return { ok: false, message: `El proveedor respondió con error ${res.status}.` };
  } catch {
    return { ok: false, message: "No se pudo conectar con el proveedor." };
  }
}

function klingJwt(accessKey: string, secret: string) {
  const b64 = (o: object) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const now = Math.floor(Date.now() / 1000);
  const head = b64({ alg: "HS256", typ: "JWT" });
  const body = b64({ iss: accessKey, exp: now + 1800, nbf: now - 5 });
  const sig = createHmac("sha256", secret).update(`${head}.${body}`).digest("base64url");
  return `${head}.${body}.${sig}`;
}

export const providers: Provider[] = [
  {
    id: "gemini",
    name: "Google Gemini",
    usedFor: "Nano Banana Pro (imágenes) y Veo 3.1 (video)",
    fields: [{ name: "apiKey", label: "API Key" }],
    test: (v) =>
      check(
        "https://generativelanguage.googleapis.com/v1beta/models?pageSize=1",
        { "x-goog-api-key": v.apiKey },
        "Clave de Gemini válida.",
      ),
  },
  {
    id: "kling",
    name: "Kling AI",
    usedFor: "Animación de video (Kling 2.6)",
    fields: [
      { name: "accessKey", label: "Access Key" },
      { name: "secretKey", label: "Secret Key" },
    ],
    test: (v) =>
      check(
        "https://api.klingai.com/v1/videos/text2video?pageNum=1&pageSize=1",
        { Authorization: `Bearer ${klingJwt(v.accessKey, v.secretKey)}` },
        "Credenciales de Kling válidas.",
      ),
  },
  {
    id: "openai",
    name: "OpenAI",
    usedFor: "Asistente / análisis visual",
    fields: [{ name: "apiKey", label: "API Key" }],
    test: (v) =>
      check(
        "https://api.openai.com/v1/models",
        { Authorization: `Bearer ${v.apiKey}` },
        "Clave de OpenAI válida.",
      ),
  },
  {
    id: "anthropic",
    name: "Anthropic",
    usedFor: "Asistente / análisis visual",
    fields: [{ name: "apiKey", label: "API Key" }],
    test: (v) =>
      check(
        "https://api.anthropic.com/v1/models?limit=1",
        { "x-api-key": v.apiKey, "anthropic-version": "2023-06-01" },
        "Clave de Anthropic válida.",
      ),
  },
  {
    id: "replicate",
    name: "Replicate",
    usedFor: "Modelos alternativos de imagen y video",
    fields: [{ name: "apiKey", label: "API Token" }],
    test: (v) =>
      check(
        "https://api.replicate.com/v1/account",
        { Authorization: `Bearer ${v.apiKey}` },
        "Token de Replicate válido.",
      ),
  },
  {
    id: "elevenlabs",
    name: "ElevenLabs",
    usedFor: "Voz del influencer",
    fields: [{ name: "apiKey", label: "API Key" }],
    test: (v) =>
      check(
        "https://api.elevenlabs.io/v1/user",
        { "xi-api-key": v.apiKey },
        "Clave de ElevenLabs válida.",
      ),
  },
];

export const getProvider = (id: string) => providers.find((p) => p.id === id);
