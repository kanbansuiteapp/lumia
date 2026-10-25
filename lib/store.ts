import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const DIR = path.join(process.cwd(), ".data");
const KEYS_FILE = path.join(DIR, "keys.json");
const SECRET_FILE = path.join(DIR, "secret.key");

type Stored = Record<string, { iv: string; tag: string; data: string; savedAt: string }>;

async function secret(): Promise<Buffer> {
  await mkdir(DIR, { recursive: true });
  try {
    return Buffer.from(await readFile(SECRET_FILE, "utf8"), "hex");
  } catch {
    const k = randomBytes(32);
    await writeFile(SECRET_FILE, k.toString("hex"), { mode: 0o600 });
    return k;
  }
}

async function readAll(): Promise<Stored> {
  try {
    return JSON.parse(await readFile(KEYS_FILE, "utf8"));
  } catch {
    return {};
  }
}

export async function saveCredentials(id: string, values: Record<string, string>) {
  const key = await secret();
  const iv = randomBytes(12);
  const c = createCipheriv("aes-256-gcm", key, iv);
  const data = Buffer.concat([c.update(JSON.stringify(values), "utf8"), c.final()]);
  const all = await readAll();
  all[id] = {
    iv: iv.toString("hex"),
    tag: c.getAuthTag().toString("hex"),
    data: data.toString("hex"),
    savedAt: new Date().toISOString(),
  };
  await writeFile(KEYS_FILE, JSON.stringify(all, null, 2), { mode: 0o600 });
}

export async function loadCredentials(id: string): Promise<Record<string, string> | null> {
  const entry = (await readAll())[id];
  if (!entry) return null;
  const d = createDecipheriv("aes-256-gcm", await secret(), Buffer.from(entry.iv, "hex"));
  d.setAuthTag(Buffer.from(entry.tag, "hex"));
  const out = Buffer.concat([d.update(Buffer.from(entry.data, "hex")), d.final()]);
  return JSON.parse(out.toString("utf8"));
}

export async function listSaved(): Promise<Record<string, string>> {
  const all = await readAll();
  return Object.fromEntries(Object.entries(all).map(([id, e]) => [id, e.savedAt]));
}

export async function removeCredentials(id: string) {
  const all = await readAll();
  delete all[id];
  await writeFile(KEYS_FILE, JSON.stringify(all, null, 2), { mode: 0o600 });
}
