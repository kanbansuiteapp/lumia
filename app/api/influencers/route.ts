import { NextResponse } from "next/server";
import { getUser, ownsInfluencer, unauthorized } from "@/lib/auth";
import { db } from "@/lib/db";

export const runtime = "nodejs";

const COLS = "id, name, description, prompt, face_image_id, created_at";
const err = (message: string, status = 500) => NextResponse.json({ ok: false, message }, { status });

export async function GET() {
  const user = await getUser();
  if (!user) return unauthorized();
  const { data, error } = await db().from("influencers").select(COLS).eq("user_id", user.id).order("created_at", { ascending: false });
  if (error) return err(error.message);
  const faceIds = (data ?? []).map((i) => i.face_image_id).filter(Boolean);
  const { data: faces } = faceIds.length ? await db().from("influencer_images").select("id, url").in("id", faceIds) : { data: [] };
  const urls = Object.fromEntries((faces ?? []).map((f) => [f.id, f.url]));
  return NextResponse.json({ ok: true, influencers: (data ?? []).map((i) => ({ ...i, face_url: urls[i.face_image_id] ?? null })) });
}

export async function POST(req: Request) {
  const user = await getUser();
  if (!user) return unauthorized();
  const { name, description } = await req.json();
  if (!name?.trim()) return err("Falta el nombre.", 400);
  const { data, error } = await db()
    .from("influencers")
    .insert({ user_id: user.id, name: name.trim(), description: description?.trim() || null })
    .select(COLS)
    .single();
  if (error) return err(error.message);
  return NextResponse.json({ ok: true, influencer: { ...data, face_url: null } });
}

export async function PATCH(req: Request) {
  const user = await getUser();
  if (!user) return unauthorized();
  const { id, ...fields } = await req.json();
  if (!(await ownsInfluencer(user.id, id))) return err("Modelo no encontrado.", 404);

  const allowed: Record<string, unknown> = {};
  for (const k of ["name", "description", "prompt", "face_image_id"]) if (k in fields) allowed[k] = fields[k];
  if (allowed.face_image_id) {
    const { data: img } = await db().from("influencer_images").select("id").eq("id", allowed.face_image_id as string).eq("influencer_id", id).maybeSingle();
    if (!img) return err("Esa imagen no pertenece al modelo.", 400);
  }
  const { error } = await db().from("influencers").update(allowed).eq("id", id).eq("user_id", user.id);
  if (error) return err(error.message);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const user = await getUser();
  if (!user) return unauthorized();
  const { id } = await req.json();
  const { error } = await db().from("influencers").delete().eq("id", id).eq("user_id", user.id);
  if (error) return err(error.message);
  return NextResponse.json({ ok: true });
}
