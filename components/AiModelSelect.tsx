"use client";

import { MODELS } from "@/lib/prompts";
import Dropdown from "./Dropdown";

export default function AiModelSelect({
  value,
  onChange,
  configured,
}: {
  value: string;
  onChange: (v: string) => void;
  configured: Record<string, boolean>;
}) {
  const provider = MODELS.find((m) => m.id === value)?.provider ?? "";
  const options = MODELS.map((m) => ({
    value: m.id,
    label: m.label,
    group: `${m.providerName}${configured[m.provider] ? "" : " (sin API)"}`,
  }));
  return (
    <>
      <Dropdown value={value} onChange={onChange} options={options} />
      {Object.keys(configured).length > 0 && !configured[provider] && (
        <span className="used" style={{ alignSelf: "center" }}>
          Sin API guardada. <a href="/configuracion" style={{ color: "var(--accent)" }}>Configurar</a>
        </span>
      )}
    </>
  );
}
