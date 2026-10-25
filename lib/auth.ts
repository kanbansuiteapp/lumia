import { NextResponse } from "next/server";
import { db } from "./db";
import { supabaseServer } from "./supabase/server";

export async function getUser() {
  const { data } = await (await supabaseServer()).auth.getUser();
  return data.user;
}

export const unauthorized = () => NextResponse.json({ ok: false, message: "Inicia sesión para continuar." }, { status: 401 });

// ¿El modelo pertenece al usuario?
export async function ownsInfluencer(userId: string, influencerId: string) {
  if (!influencerId) return false;
  const { data } = await db().from("influencers").select("id").eq("id", influencerId).eq("user_id", userId).maybeSingle();
  return !!data;
}

export async function influencerIds(userId: string): Promise<string[]> {
  const { data } = await db().from("influencers").select("id").eq("user_id", userId);
  return (data ?? []).map((r) => r.id);
}

// Origen real de la petición (con `next dev -H 0.0.0.0`, request.url trae 0.0.0.0).
export function originOf(req: Request) {
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  const proto = req.headers.get("x-forwarded-proto") ?? (host?.startsWith("localhost") || host?.startsWith("127.") ? "http" : "https");
  return host ? `${proto}://${host}` : new URL(req.url).origin;
}

// Super admin = correo verificado incluido en SUPERADMIN_EMAILS (por defecto, el del creador).
const ADMINS = () =>
  (process.env.SUPERADMIN_EMAILS ?? "kanbansuite@gmail.com")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

export function isSuperAdmin(user: { email?: string | null; email_confirmed_at?: string | null } | null | undefined) {
  return !!user?.email && !!user.email_confirmed_at && ADMINS().includes(user.email.toLowerCase());
}

export const forbidden = () => NextResponse.json({ ok: false, message: "Solo el super admin puede hacer esto." }, { status: 403 });
