import { NextResponse } from "next/server";
import { getUser, unauthorized } from "@/lib/auth";
import { getProvider, providers } from "@/lib/providers";
import { listSaved, loadCredentials, removeCredentials, saveCredentials } from "@/lib/store";

export const runtime = "nodejs";

export async function GET() {
  const user = await getUser();
  if (!user) return unauthorized();
  const saved = await listSaved(user.id);
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
  const user = await getUser();
  if (!user) return unauthorized();
  const { provider: id, values, testOnly } = await req.json();
  const provider = getProvider(id);
  if (!provider) return NextResponse.json({ ok: false, message: "Proveedor desconocido." }, { status: 400 });

  // testOnly: re-verifica la credencial ya guardada
  const creds: Record<string, string> | null = testOnly ? await loadCredentials(user.id, id) : values;
  if (!creds) return NextResponse.json({ ok: false, message: "No hay credenciales guardadas." }, { status: 404 });

  const missing = provider.fields.filter((f) => !creds[f.name]?.trim());
  if (missing.length)
    return NextResponse.json({ ok: false, message: `Falta: ${missing.map((f) => f.label).join(", ")}.` }, { status: 400 });

  const clean = Object.fromEntries(provider.fields.map((f) => [f.name, creds[f.name].trim()]));
  const result = await provider.test(clean);
  if (!result.ok) return NextResponse.json({ ...result, saved: false });

  if (!testOnly) await saveCredentials(user.id, id, clean);
  return NextResponse.json({
    ok: true,
    saved: !testOnly,
    message: testOnly ? result.message : `${result.message} Guardada correctamente.`,
    savedAt: (await listSaved(user.id))[id],
  });
}

export async function DELETE(req: Request) {
  const user = await getUser();
  if (!user) return unauthorized();
  const { provider } = await req.json();
  await removeCredentials(user.id, provider);
  return NextResponse.json({ ok: true, message: "Credenciales eliminadas." });
}
