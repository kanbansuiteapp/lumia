"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

type Options = { title: string; message?: string; confirmLabel?: string; danger?: boolean };

// Sustituye a window.confirm: ventana centrada con el estilo de la app. Uso:
//   const { ask, dialog } = useConfirm();  ...  if (!(await ask({ title: "…" }))) return;  ...  {dialog}
export function useConfirm() {
  const [opts, setOpts] = useState<Options | null>(null);
  const resolver = useRef<((v: boolean) => void) | null>(null);

  const ask = useCallback((o: Options) => {
    setOpts(o);
    return new Promise<boolean>((resolve) => { resolver.current = resolve; });
  }, []);

  const close = useCallback((v: boolean) => {
    resolver.current?.(v);
    resolver.current = null;
    setOpts(null);
  }, []);

  useEffect(() => {
    if (!opts) return;
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") close(false); };
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [opts, close]);

  const dialog: ReactNode = opts && (
    <div className="overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) close(false); }}>
      <div className="modal confirm" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title">
        <div className="name" id="confirm-title" style={{ fontSize: 18 }}>{opts.title}</div>
        {opts.message && <p className="used" style={{ marginTop: 8, fontSize: 14 }}>{opts.message}</p>}
        <div className="row" style={{ justifyContent: "flex-end" }}>
          <button autoFocus onClick={() => close(false)}>Cancelar</button>
          <button className={opts.danger === false ? "primary" : "danger"} onClick={() => close(true)}>{opts.confirmLabel ?? "Confirmar"}</button>
        </div>
      </div>
    </div>
  );

  return { ask, dialog };
}
