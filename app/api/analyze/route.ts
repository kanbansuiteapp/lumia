import { NextResponse } from "next/server";
import { getUser, ownsInfluencer, unauthorized } from "@/lib/auth";
import { db } from "@/lib/db";
import { toInline } from "@/lib/generate";
import { ANALYSIS_PROMPT } from "@/lib/prompts";
import { describeImages } from "@/lib/vision";

export const runtime = "nodejs";
export const maxDuration = 120;

// Paso 2: analiza la cara de referencia y los ángulos y guarda el prompt del modelo.
export async function POST(req: Request) {
  const user = await getUser();
  if (!user) return unauthorized();
  const { influencerId } = await req.json();
  if (!(await ownsInfluencer(user.id, influencerId))) return NextResponse.json({ ok: false, message: "Modelo no encontrado." }, { status: 404 });
  const { data: inf } = await db().from("influencers").select("face_image_id").eq("id", influencerId).maybeSingle();
  if (!inf?.face_image_id) return NextResponse.json({ ok: false, message: "Primero elige una cara de referencia." }, { status: 400 });

  const { data: face } = await db().from("influencer_images").select("url").eq("id", inf.face_image_id).maybeSingle();
  const { data: angles } = await db().from("influencer_images").select("url").eq("influencer_id", influencerId).eq("kind", "angle").order("created_at", { ascending: false }).limit(3);
  const urls = [face?.url, ...(angles ?? []).map((a) => a.url)].filter(Boolean) as string[];

  try {
    const prompt = await describeImages(user.id, ANALYSIS_PROMPT, await Promise.all(urls.map(toInline)));
    await db().from("influencers").update({ prompt }).eq("id", influencerId);
    return NextResponse.json({ ok: true, prompt });
  } catch (e) {
    return NextResponse.json({ ok: false, message: e instanceof Error ? e.message : "Error al analizar." }, { status: 502 });
  }
}
