import { NextResponse } from "next/server";
import { getProvider, providers } from "@/lib/providers";
import { listSaved, loadCredentials, removeCredentials, saveCredentials } from "@/lib/store";

export const runtime = "nodejs";

export async function GET() {
  const saved = await listSaved();
  return NextResponse.json({
    providers: providers.map((p) => ({
      id: p.id,
      name: p.name,
      usedFor: p.usedFor,
      fields: p.fields,
      savedAt: saved[p.id] ?? null,
    })),
  });
}

// Valida contra el proveedor y solo guarda si la clave funciona.
export async function POST(req: Request) {
  const { provider: id, values, testOnly } = await req.json();
  const provider = getProvider(id);
  if (!provider) return NextResponse.json({ ok: false, message: "Proveedor desconocido." }, { status: 400 });

  // testOnly: re-verifica la credencial ya guardada
  const creds: Record<string, string> | null = testOnly ? await loadCredentials(id) : values;
  if (!creds) return NextResponse.json({ ok: false, message: "No hay credenciales guardadas." }, { status: 404 });

  const missing = provider.fields.filter((f) => !creds[f.name]?.trim());
  if (missing.length)
    return NextResponse.json({ ok: false, message: `Falta: ${missing.map((f) => f.label).join(", ")}.` }, { status: 400 });

  const clean = Object.fromEntries(provider.fields.map((f) => [f.name, creds[f.name].trim()]));
  const result = await provider.test(clean);
  if (!result.ok) return NextResponse.json({ ...result, saved: false });

  if (!testOnly) await saveCredentials(id, clean);
  return NextResponse.json({
    ok: true,
    saved: !testOnly,
    message: testOnly ? result.message : `${result.message} Guardada correctamente.`,
    savedAt: (await listSaved())[id],
  });
}

export async function DELETE(req: Request) {
  const { provider } = await req.json();
  await removeCredentials(provider);
  return NextResponse.json({ ok: true, message: "Credenciales eliminadas." });
}
