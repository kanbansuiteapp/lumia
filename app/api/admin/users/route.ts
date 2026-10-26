import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { type AccessSpec, resolveAccess } from "@/lib/access";
import { deleteUserCompletely, listAdminUsers } from "@/lib/admin";
import { forbidden, getUser, isSuperAdmin, unauthorized } from "@/lib/auth";
import { db } from "@/lib/db";

export const runtime = "nodejs";

async function guard() {
  const user = await getUser();
  if (!user) return { res: unauthorized() };
  if (!isSuperAdmin(user)) return { res: forbidden() };
  return { user };
}

const bad = (message: string, status = 400) => NextResponse.json({ ok: false, message }, { status });

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^[+\d][\d\s().-]{5,19}$/;

// Contraseña temporal legible (sin caracteres ambiguos).
function tempPassword() {
  const abc = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from(randomBytes(12), (b) => abc[b % abc.length]).join("");
}

function clean(body: { name?: unknown; phone?: unknown }) {
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  if (name.length < 2 || name.length > 80) return { error: "El nombre debe tener entre 2 y 80 caracteres." };
  if (phone && !PHONE.test(phone)) return { error: "El teléfono no es válido." };
  return { name, phone };
}

export async function GET() {
  const g = await guard();
  if (g.res) return g.res;
  return NextResponse.json({ ok: true, ...(await listAdminUsers()), me: g.user!.id });
}

// Crear una cuenta independiente con su periodo de acceso.
export async function POST(req: Request) {
  const g = await guard();
  if (g.res) return g.res;
  const body = await req.json();
  const c = clean(body);
  if ("error" in c) return bad(c.error!);
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!EMAIL.test(email)) return bad("El correo no es válido.");
  const until = resolveAccess(body.access as AccessSpec);
  if (!until) return bad("Elige un periodo de acceso válido.");
  let password = typeof body.password === "string" ? body.password : "";
  if (password && password.length < 8) return bad("La contraseña debe tener al menos 8 caracteres.");
  const generated = !password;
  if (generated) password = tempPassword();

  const { data, error } = await db().auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: c.name, phone: c.phone },
    app_metadata: { access_until: until },
  });
  if (error) return bad(/already|registered|exists/i.test(error.message) ? "Ese correo ya tiene una cuenta." : error.message, 400);
  return NextResponse.json({ ok: true, id: data.user.id, email, password, generated, access_until: until });
}

// Suspender/reactivar ({ id, suspended }) o editar datos y acceso ({ id, name, phone, access, password }).
export async function PATCH(req: Request) {
  const g = await guard();
  if (g.res) return g.res;
  const body = await req.json();
  const { id } = body;

  if ("suspended" in body) {
    if (id === g.user!.id) return bad("No puedes suspender tu propia cuenta.");
    const { error } = await db().auth.admin.updateUserById(id, { ban_duration: body.suspended ? "876000h" : "none" });
    if (error) return bad(error.message, 500);
    return NextResponse.json({ ok: true });
  }

  const { data: existing } = await db().auth.admin.getUserById(id);
  if (!existing?.user) return bad("Usuario no encontrado.", 404);

  const attrs: Record<string, unknown> = {};
  if ("name" in body || "phone" in body) {
    const c = clean({ name: body.name ?? existing.user.user_metadata?.full_name, phone: body.phone ?? existing.user.user_metadata?.phone ?? "" });
    if ("error" in c) return bad(c.error!);
    attrs.user_metadata = { ...existing.user.user_metadata, full_name: c.name, phone: c.phone };
  }
  if (body.access) {
    const until = resolveAccess(body.access as AccessSpec);
    if (!until) return bad("Elige un periodo de acceso válido.");
    attrs.app_metadata = { ...existing.user.app_metadata, access_until: until };
  }
  if (body.password) {
    if (typeof body.password !== "string" || body.password.length < 8) return bad("La contraseña debe tener al menos 8 caracteres.");
    attrs.password = body.password;
  }
  if (!Object.keys(attrs).length) return bad("No hay cambios.");
  const { error } = await db().auth.admin.updateUserById(id, attrs);
  if (error) return bad(error.message, 500);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const g = await guard();
  if (g.res) return g.res;
  const { id } = await req.json();
  if (id === g.user!.id) return bad("No puedes eliminar tu propia cuenta.");
  const { error } = await deleteUserCompletely(id);
  if (error) return bad(error.message, 500);
  return NextResponse.json({ ok: true });
}
