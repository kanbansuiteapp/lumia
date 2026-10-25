import { NextResponse } from "next/server";
import { getUser, ownsInfluencer, unauthorized } from "@/lib/auth";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const user = await getUser();
  if (!user) return unauthorized();
  const id = new URL(req.url).searchParams.get("influencerId");
  if (!id || !(await ownsInfluencer(user.id, id))) return NextResponse.json({ ok: true, collections: [] });
  const { data, error } = await db().from("collections").select("id, name").eq("influencer_id", id).order("created_at", { ascending: false });
  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, collections: data });
}

export async function POST(req: Request) {
  const user = await getUser();
  if (!user) return unauthorized();
  const { influencerId, name } = await req.json();
  if (!name?.trim() || !(await ownsInfluencer(user.id, influencerId))) return NextResponse.json({ ok: false, message: "Falta el nombre." }, { status: 400 });
  const { data, error } = await db().from("collections").insert({ influencer_id: influencerId, name: name.trim() }).select("id, name").single();
  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, collection: data });
}
