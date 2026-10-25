import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { db } from "./db";

const key = () => Buffer.from(process.env.APP_SECRET!, "hex");

export async function saveCredentials(userId: string, provider: string, values: Record<string, string>) {
  const iv = randomBytes(12);
  const c = createCipheriv("aes-256-gcm", key(), iv);
  const data = Buffer.concat([c.update(JSON.stringify(values), "utf8"), c.final()]);
  const { error } = await db()
    .from("provider_credentials")
    .upsert(
      {
        user_id: userId,
        provider,
        encrypted: { iv: iv.toString("hex"), tag: c.getAuthTag().toString("hex"), data: data.toString("hex") },
        saved_at: new Date().toISOString(),
      },
      { onConflict: "user_id,provider" },
    );
  if (error) throw new Error(error.message);
}

export async function loadCredentials(userId: string, provider: string): Promise<Record<string, string> | null> {
  const { data: row } = await db().from("provider_credentials").select("encrypted").eq("user_id", userId).eq("provider", provider).maybeSingle();
  if (!row) return null;
  const e = row.encrypted as { iv: string; tag: string; data: string };
  const d = createDecipheriv("aes-256-gcm", key(), Buffer.from(e.iv, "hex"));
  d.setAuthTag(Buffer.from(e.tag, "hex"));
  const out = Buffer.concat([d.update(Buffer.from(e.data, "hex")), d.final()]);
  return JSON.parse(out.toString("utf8"));
}

export async function listSaved(userId: string): Promise<Record<string, string>> {
  const { data } = await db().from("provider_credentials").select("provider, saved_at").eq("user_id", userId);
  return Object.fromEntries((data ?? []).map((r) => [r.provider, r.saved_at as string]));
}

export async function removeCredentials(userId: string, provider: string) {
  await db().from("provider_credentials").delete().eq("user_id", userId).eq("provider", provider);
}
