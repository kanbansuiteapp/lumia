import { NextResponse } from "next/server";
import { originOf } from "@/lib/auth";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(request: Request) {
  await (await supabaseServer()).auth.signOut();
  return NextResponse.redirect(new URL("/", originOf(request)), 303);
}
