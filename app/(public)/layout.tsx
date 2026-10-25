import Link from "next/link";
import type { ReactNode } from "react";
import Logo from "@/components/Logo";
import { getUser } from "@/lib/auth";

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const user = await getUser();
  return (
    <div className="page">
      <header className="top">
        <div className="top-in">
          <Logo href="/" />
          <Link href="/#como-funciona">Cómo funciona</Link>
          <Link href="/#funciones">Funciones</Link>
          <Link href="/#precios">Precios</Link>
          <span className="spacer" />
          {user ? (
            <Link href="/modelos" className="btn-link primary">Ir a la app</Link>
          ) : (
            <>
              <Link href="/login">Entrar</Link>
              <Link href="/registro" className="btn-link primary">Crear cuenta</Link>
            </>
          )}
        </div>
      </header>
      <div className="page-body">{children}</div>
      <footer className="foot">
        <div>© {new Date().getFullYear()} Lumia · Crea tu influencer con IA</div>
        <div className="used">Sube solo imágenes propias, de personajes ficticios o con permiso de la persona retratada.</div>
      </footer>
    </div>
  );
}
