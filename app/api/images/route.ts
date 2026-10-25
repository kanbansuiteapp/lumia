import { NextResponse } from "next/server";
import { getUser, influencerIds, ownsInfluencer, unauthorized } from "@/lib/auth";
import { BUCKET, db } from "@/lib/db";
import { toInline } from "@/lib/generate";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const user = await getUser();
  if (!user) return unauthorized();
  const q = new URL(req.url).searchParams;
  const mine = await influencerIds(user.id);
  const wanted = q.get("influencerId");
  if (wanted && !mine.includes(wanted)) return NextResponse.json({ ok: true, images: [] });

  let query = db()
    .from("influencer_images")
    .select("id, influencer_id, kind, url, prompt, angle, collection_id, created_at")
    .in("influencer_id", wanted ? [wanted] : mine)
    .order("created_at", { ascending: false })
    .limit(200);
  if (q.get("kind")) query = query.eq("kind", q.get("kind")!);
  if (q.get("collectionId")) query = query.eq("collection_id", q.get("collectionId")!);
  const { data, error } = await query;
  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, images: data });
}

export async function DELETE(req: Request) {
  const user = await getUser();
  if (!user) return unauthorized();
  const { id } = await req.json();
  const { data } = await db().from("influencer_images").select("url, influencer_id").eq("id", id).maybeSingle();
  if (!data || !(await ownsInfluencer(user.id, data.influencer_id))) return NextResponse.json({ ok: false, message: "No encontrada." }, { status: 404 });
  const path = data.url.split(`/${BUCKET}/`)[1];
  if (path) await db().storage.from(BUCKET).remove([path]);
  await db().from("influencer_images").delete().eq("id", id);
  return NextResponse.json({ ok: true });
}

// Guarda una imagen subida por el usuario (foto de referencia) sin pasar por la IA.
export async function POST(req: Request) {
  const user = await getUser();
  if (!user) return unauthorized();
  const { influencerId, kind, angle, image } = await req.json();
  if (!(await ownsInfluencer(user.id, influencerId)) || !image?.startsWith("data:"))
    return NextResponse.json({ ok: false, message: "Falta la imagen o el modelo." }, { status: 400 });
  if (!["base", "angle", "lifestyle"].includes(kind)) return NextResponse.json({ ok: false, message: "Tipo no válido." }, { status: 400 });

  const img = await toInline(image);
  const ext = img.mimeType.split("/")[1] ?? "jpeg";
  const path = `${influencerId}/${Date.now()}-${Math.random().toString(36).slice(2, 6)}.${ext}`;
  const up = await db().storage.from(BUCKET).upload(path, Buffer.from(img.data, "base64"), { contentType: img.mimeType });
  if (up.error) return NextResponse.json({ ok: false, message: `No se pudo guardar la imagen: ${up.error.message}` }, { status: 500 });
  const url = db().storage.from(BUCKET).getPublicUrl(path).data.publicUrl;

  const { data, error } = await db()
    .from("influencer_images")
    .insert({ influencer_id: influencerId, kind, url, angle: angle ?? null, prompt: "Referencia subida" })
    .select("id, kind, url, prompt, angle")
    .single();
  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, image: data });
}
