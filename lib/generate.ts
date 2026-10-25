import { ownsInfluencer } from "./auth";
import { BUCKET, db } from "./db";
import { type Inline, generators } from "./generators";
import { MODELS, REALISM } from "./prompts";
import { loadCredentials } from "./store";

// Solo se aceptan data URLs o imágenes de nuestro propio almacenamiento (evita que el servidor descargue URLs arbitrarias).
const OWN_STORAGE = () => `${process.env.SUPABASE_URL}/storage/v1/object/public/`;

export const IMAGE_MIMES = ["image/jpeg", "image/png", "image/webp"];
const MAX_REF_BYTES = 8 * 1024 * 1024; // por imagen de referencia
const MAX_REFS = 10;

export async function toInline(ref: string): Promise<Inline> {
  if (!ref.startsWith("data:") && !ref.startsWith(OWN_STORAGE())) throw new Error("Imagen de referencia no permitida.");
  if (ref.startsWith("data:")) {
    const [meta, data] = ref.split(",");
    const mimeType = meta.slice(5, meta.indexOf(";"));
    if (!IMAGE_MIMES.includes(mimeType)) throw new Error("Solo se admiten imágenes JPG, PNG o WebP.");
    if (data.length * 0.75 > MAX_REF_BYTES) throw new Error("La imagen supera los 8 MB.");
    return { mimeType, data };
  }
  const res = await fetch(ref);
  if (!res.ok) throw new Error("No se pudo descargar la imagen de referencia.");
  return { mimeType: res.headers.get("content-type") ?? "image/png", data: Buffer.from(await res.arrayBuffer()).toString("base64") };
}

export type GenOpts = {
  influencerId: string;
  kind: "base" | "angle" | "lifestyle";
  prompt: string;
  realism: boolean;
  model: string;
  aspect?: string;
  references?: string[];
  useModel?: boolean; // añade la cara de referencia y el prompt de apariencia del modelo
  collectionId?: string;
  angle?: string;
  mode?: "swap"; // references = escenas a recrear con la cara del modelo
};

export type GenResult =
  | { ok: true; image: { id: string; kind: string; url: string; prompt: string | null; angle: string | null } }
  | { ok: false; message: string; status: number };

export async function runGeneration(userId: string, o: GenOpts): Promise<GenResult> {
  const fail = (message: string, status = 400): GenResult => ({ ok: false, message, status });
  if (!(await ownsInfluencer(userId, o.influencerId))) return fail("Elige o crea un modelo.", 404);
  if (!["base", "angle", "lifestyle"].includes(o.kind)) return fail("Tipo de imagen no válido.");
  if ((o.references?.length ?? 0) > MAX_REFS) return fail(`Máximo ${MAX_REFS} imágenes de referencia.`);
  if (o.collectionId) {
    const { data: col } = await db().from("collections").select("id").eq("id", o.collectionId).eq("influencer_id", o.influencerId).maybeSingle();
    if (!col) return fail("La colección no pertenece a este modelo.", 404);
  }
  if (!o.prompt?.trim()) return fail("Escribe un prompt.");
  const info = MODELS.find((m) => m.id === o.model);
  if (!info) return fail("Modelo de IA no válido.");

  const refs = [...(o.references ?? [])];
  let text = o.prompt.trim();

  if (o.mode === "swap") {
    if (info.singleRef) return fail(`${info.label.replace(" (necesita imagen)", "")} solo admite una imagen. Usa Nano Banana o GPT Image para intercambiar caras.`);
    if (!refs.length) return fail("Falta la imagen de referencia.");
    const { data: inf } = await db().from("influencers").select("prompt, face_image_id").eq("id", o.influencerId).maybeSingle();
    const { data: face } = inf?.face_image_id ? await db().from("influencer_images").select("url").eq("id", inf.face_image_id).maybeSingle() : { data: null };
    if (!face?.url) return fail("Este modelo no tiene cara de referencia.");
    refs.push(face.url);
    text =
      "Image 1 is the scene reference. The last image is the identity reference. Recreate image 1 faithfully (pose, outfit, background, lighting, camera framing, composition) " +
      "but replace the person with the person from the identity reference: exactly the same face, skin details, hair and natural proportions. " +
      (inf?.prompt ? `Character description:\n${inf.prompt}\n\n` : "") +
      text;
  } else if (o.useModel) {
    const { data: inf } = await db().from("influencers").select("prompt, face_image_id").eq("id", o.influencerId).maybeSingle();
    if (inf?.face_image_id) {
      const { data: face } = await db().from("influencer_images").select("url").eq("id", inf.face_image_id).maybeSingle();
      if (face?.url) refs.unshift(face.url);
    }
    if (inf?.prompt) text = `Character description:\n${inf.prompt}\n\nScene: ${text}`;
  }
  if (o.mode !== "swap" && refs.length) text = `Use the attached image(s) as the identity reference: keep the exact same person, face and skin details. ${text}`;
  if (o.realism) text += `\n\nStyle: ${REALISM}`;

  if (info.needsRef && !refs.length) return fail(`${info.label.replace(" (necesita imagen)", "")} necesita una imagen de partida o de referencia.`);
  const creds = await loadCredentials(userId, info.provider);
  if (!creds) return fail(`Falta la API de ${info.providerName}. Configúrala en Configuración.`);

  let img: Inline;
  try {
    img = await generators[info.provider](
      o.model,
      { prompt: text, references: await Promise.all(refs.map(toInline)), aspect: o.aspect ?? "3:4" },
      creds.apiKey,
    );
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Error al generar la imagen.", 502);
  }

  const ext = img.mimeType.split("/")[1] ?? "png";
  const path = `${o.influencerId}/${Date.now()}-${Math.random().toString(36).slice(2, 6)}.${ext}`;
  const up = await db().storage.from(BUCKET).upload(path, Buffer.from(img.data, "base64"), { contentType: img.mimeType });
  if (up.error) return fail(`No se pudo guardar la imagen: ${up.error.message}`, 500);
  const url = db().storage.from(BUCKET).getPublicUrl(path).data.publicUrl;

  const { data, error } = await db()
    .from("influencer_images")
    .insert({
      influencer_id: o.influencerId,
      kind: o.kind,
      url,
      prompt: o.prompt.trim(),
      collection_id: o.collectionId ?? null,
      angle: o.angle ?? null,
    })
    .select("id, kind, url, prompt, angle")
    .single();
  if (error) return fail(error.message, 500);
  return { ok: true, image: data };
}
