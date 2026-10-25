"use client";

import { useEffect, useRef, useState } from "react";

export type Option = { value: string; label: string; group?: string };

// Desplegable propio: la lista se abre siempre debajo del botón (el <select> nativo de macOS se superpone).
export default function Dropdown({
  value,
  onChange,
  options,
  placeholder = "Seleccionar",
  block,
}: {
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  placeholder?: string;
  block?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", esc); };
  }, [open]);

  const current = options.find((o) => o.value === value);
  let lastGroup: string | undefined;
  return (
    <div className={`dropdown ${block ? "block" : ""}`} ref={ref}>
      <button type="button" className="dd-btn" onClick={() => setOpen(!open)} aria-haspopup="listbox" aria-expanded={open}>
        <span>{current?.label ?? placeholder}</span>
        <svg width="12" height="8" viewBox="0 0 12 8" aria-hidden="true">
          <path d="M1 1.5l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="dd-list" role="listbox">
          {options.map((o) => {
            const header = o.group && o.group !== lastGroup ? <div className="dd-group">{o.group}</div> : null;
            lastGroup = o.group;
            return (
              <div key={o.value}>
                {header}
                <button
                  type="button"
                  role="option"
                  aria-selected={o.value === value}
                  className={`dd-item ${o.value === value ? "sel" : ""}`}
                  onClick={() => { onChange(o.value); setOpen(false); }}
                >
                  {o.label}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
