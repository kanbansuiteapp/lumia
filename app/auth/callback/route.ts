import { NextResponse } from "next/server";
import { originOf } from "@/lib/auth";
import { supabaseServer } from "@/lib/supabase/server";

// Destino del enlace de confirmación de correo.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (code) {
    const { error } = await (await supabaseServer()).auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL("/modelos", originOf(request)));
  }
  return NextResponse.redirect(new URL("/login?error=confirmacion", originOf(request)));
}
