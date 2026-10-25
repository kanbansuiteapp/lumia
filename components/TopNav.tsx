"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const GENERAR = [
  { href: "/imagen", label: "Imagen", sub: "Generar imagen de IA" },
  { href: "/lifestyle", label: "Lifestyle", sub: "Tandas de escenas por colección" },
  { href: "/intercambiar", label: "Intercambiar", sub: "Aplicar la cara de tu modelo" },
  { href: "/animar", label: "Animar", sub: "Vídeo con frame inicial y final" },
  { href: "/video", label: "Vídeo", sub: "Generar vídeo de IA" },
];

export default function TopNav({ email, admin }: { email: string; admin: boolean }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    const close = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const inGenerar = GENERAR.some((g) => path.startsWith(g.href));
  return (
    <header className="top">
      <div className="top-in">
        <Link href="/modelos" className="logo">Lumia</Link>
        <div className="dd" ref={ref}>
          <button className={`navbtn ${inGenerar ? "active" : ""}`} onClick={() => setOpen(!open)}>Generar ▾</button>
          {open && (
            <div className="menu">
              {GENERAR.map((g) => (
                <Link key={g.href} href={g.href}>
                  <strong>{g.label}</strong>
                  <span>{g.sub}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
        <Link href="/modelos" className={path.startsWith("/modelos") ? "active" : ""}>Mis modelos</Link>
        <Link href="/galeria" className={path.startsWith("/galeria") ? "active" : ""}>Galería</Link>
        <span className="spacer" />
        {admin && <Link href="/admin" className={path.startsWith("/admin") ? "active" : ""}>Admin</Link>}
        <Link href="/configuracion" className={path.startsWith("/configuracion") ? "active" : ""}>Configuración</Link>
        <form action="/auth/logout" method="post" className="userbox">
          <span className="used" title={email}>{email}</span>
          <button type="submit" className="navbtn">Cerrar sesión</button>
        </form>
      </div>
    </header>
  );
}
