"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function ProfileMenu({ name, email, admin }: { name: string; email: string; admin: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const path = usePathname();
  const shown = name || email.split("@")[0];
  const initial = (shown[0] ?? "?").toUpperCase();

  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", esc); };
  }, [open]);

  return (
    <div className="dd profile" ref={ref}>
      <button className="avatar-btn" onClick={() => setOpen(!open)} aria-label="Perfil" aria-expanded={open}>{initial}</button>
      {open && (
        <div className="menu" style={{ right: 0, left: "auto", width: 260 }}>
          <div className="pm-head">
            <div className="name">{shown}{admin && <span className="tag"> · super admin</span>}</div>
            <div className="used" style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{email}</div>
          </div>
          <Link href="/perfil"><strong>Mi perfil</strong><span>Nombre, correo y contraseña</span></Link>
          <form action="/auth/logout" method="post">
            <button type="submit" className="pm-out">Cerrar sesión</button>
          </form>
        </div>
      )}
    </div>
  );
}
