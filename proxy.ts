import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { accessState } from "./lib/access";

const PUBLIC = ["/", "/login", "/registro", "/acceso"];
const isPublic = (p: string) => PUBLIC.includes(p) || p.startsWith("/auth/");

// Refresca la sesión y bloquea lo que requiere login (comprobación optimista; cada ruta de API vuelve a validar).
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(list) {
        list.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  const { data } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;

  if (!data.user && !isPublic(path)) {
    if (path.startsWith("/api/")) return NextResponse.json({ ok: false, message: "Inicia sesión para continuar." }, { status: 401 });
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = `?next=${encodeURIComponent(path)}`;
    return NextResponse.redirect(url);
  }
  // Cuentas pendientes de activación o con el periodo vencido: solo pueden ver /acceso y cerrar sesión.
  if (data.user && !isPublic(path) && accessState(data.user) !== "ok") {
    if (path.startsWith("/api/")) return NextResponse.json({ ok: false, message: "Tu acceso no está activo. Contacta al administrador." }, { status: 403 });
    const url = request.nextUrl.clone();
    url.pathname = "/acceso";
    url.search = "";
    return NextResponse.redirect(url);
  }
  if (data.user && (path === "/login" || path === "/registro")) {
    const url = request.nextUrl.clone();
    url.pathname = "/modelos";
    url.search = "";
    return NextResponse.redirect(url);
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
