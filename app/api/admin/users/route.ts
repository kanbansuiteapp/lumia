import { NextResponse } from "next/server";
import { forbidden, getUser, isSuperAdmin, unauthorized } from "@/lib/auth";
import { db } from "@/lib/db";
import { deleteUserCompletely, listAdminUsers } from "@/lib/admin";

export const runtime = "nodejs";

async function guard() {
  const user = await getUser();
  if (!user) return { res: unauthorized() };
  if (!isSuperAdmin(user)) return { res: forbidden() };
  return { user };
}

export async function GET() {
  const g = await guard();
  if (g.res) return g.res;
  return NextResponse.json({ ok: true, ...(await listAdminUsers()), me: g.user!.id });
}

// Suspender / reactivar una cuenta (bloquea el inicio de sesión).
export async function PATCH(req: Request) {
  const g = await guard();
  if (g.res) return g.res;
  const { id, suspended } = await req.json();
  if (id === g.user!.id) return NextResponse.json({ ok: false, message: "No puedes suspender tu propia cuenta." }, { status: 400 });
  const { error } = await db().auth.admin.updateUserById(id, { ban_duration: suspended ? "876000h" : "none" });
  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const g = await guard();
  if (g.res) return g.res;
  const { id } = await req.json();
  if (id === g.user!.id) return NextResponse.json({ ok: false, message: "No puedes eliminar tu propia cuenta." }, { status: 400 });
  const { error } = await deleteUserCompletely(id);
  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
