import { NextResponse } from "next/server";
import { forbidden, getUser, isSuperAdmin, unauthorized } from "@/lib/auth";
import { db } from "@/lib/db";

export const runtime = "nodejs";

// Asigna a la cuenta del super admin los modelos y claves creados antes de existir el login.
export async function POST() {
  const user = await getUser();
  if (!user) return unauthorized();
  if (!isSuperAdmin(user)) return forbidden();
  const m = await db().from("influencers").update({ user_id: user.id }).is("user_id", null).select("id");
  const k = await db().from("provider_credentials").update({ user_id: user.id }).is("user_id", null).select("id");
  if (m.error || k.error) return NextResponse.json({ ok: false, message: (m.error ?? k.error)!.message }, { status: 500 });
  return NextResponse.json({ ok: true, models: m.data?.length ?? 0, keys: k.data?.length ?? 0 });
}
