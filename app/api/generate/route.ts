import { NextResponse } from "next/server";
import { getUser, unauthorized } from "@/lib/auth";
import { type GenOpts, runGeneration } from "@/lib/generate";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(req: Request) {
  const user = await getUser();
  if (!user) return unauthorized();
  const r = await runGeneration(user.id, (await req.json()) as GenOpts);
  if (!r.ok) return NextResponse.json({ ok: false, message: r.message }, { status: r.status });
  return NextResponse.json({ ok: true, image: r.image });
}
