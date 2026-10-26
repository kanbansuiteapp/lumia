"use client";

import { useEffect, useState } from "react";
import AdminPanel from "./AdminPanel";
import ApiSettings from "./ApiSettings";

type Tab = "apis" | "usuarios";

// Configuración: APIs para todos; "Usuarios" solo si el servidor confirmó que eres super admin.
export default function SettingsTabs({ admin }: { admin: boolean }) {
  const [tab, setTab] = useState<Tab>("apis");

  useEffect(() => {
    if (admin && location.hash === "#usuarios") setTab("usuarios");
  }, [admin]);

  function pick(t: Tab) {
    setTab(t);
    history.replaceState(null, "", t === "usuarios" ? "#usuarios" : location.pathname);
  }

  return (
    <>
      {admin && (
        <div className="chips" style={{ marginBottom: 16 }}>
          <button className={`chip ${tab === "apis" ? "sel" : ""}`} onClick={() => pick("apis")}>APIs de IA</button>
          <button className={`chip ${tab === "usuarios" ? "sel" : ""}`} onClick={() => pick("usuarios")}>Usuarios y accesos</button>
        </div>
      )}
      {tab === "usuarios" && admin ? <AdminPanel /> : <ApiSettings />}
    </>
  );
}
