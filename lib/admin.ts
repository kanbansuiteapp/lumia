import { accessState, accessUntil, type Access } from "./access";
import { BUCKET, db } from "./db";

export type AdminUser = {
  id: string;
  email: string;
  name: string;
  phone: string;
  access: Access;
  access_until: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  confirmed: boolean;
  admin: boolean;
  suspended: boolean;
  models: number;
  images: number;
  keys: number;
};

export async function listAdminUsers(): Promise<{ users: AdminUser[]; orphans: { models: number; keys: number } }> {
  const admin = db().auth.admin;
  const { data } = await admin.listUsers({ page: 1, perPage: 1000 });
  const [{ data: infs }, { data: imgs }, { data: keys }] = await Promise.all([
    db().from("influencers").select("id, user_id"),
    db().from("influencer_images").select("influencer_id"),
    db().from("provider_credentials").select("user_id"),
  ]);
  const owner = new Map((infs ?? []).map((i) => [i.id, i.user_id as string | null]));
  const count = (m: Map<string, number>, k: string | null | undefined) => k && m.set(k, (m.get(k) ?? 0) + 1);
  const models = new Map<string, number>(), images = new Map<string, number>(), keyCount = new Map<string, number>();
  (infs ?? []).forEach((i) => count(models, i.user_id));
  (imgs ?? []).forEach((i) => count(images, owner.get(i.influencer_id)));
  (keys ?? []).forEach((k) => count(keyCount, k.user_id));

  const users = (data?.users ?? []).map((u) => ({
    id: u.id,
    email: u.email ?? "(sin correo)",
    name: (u.user_metadata?.full_name as string) ?? "",
    phone: (u.user_metadata?.phone as string) ?? "",
    access: accessState(u),
    access_until: accessUntil(u),
    created_at: u.created_at,
    last_sign_in_at: u.last_sign_in_at ?? null,
    confirmed: !!u.email_confirmed_at,
    admin: u.app_metadata?.role === "superadmin",
    suspended: !!u.banned_until && new Date(u.banned_until) > new Date(),
    models: models.get(u.id) ?? 0,
    images: images.get(u.id) ?? 0,
    keys: keyCount.get(u.id) ?? 0,
  }));
  return {
    users: users.sort((a, b) => b.created_at.localeCompare(a.created_at)),
    orphans: {
      models: (infs ?? []).filter((i) => !i.user_id).length,
      keys: (keys ?? []).filter((k) => !k.user_id).length,
    },
  };
}

// Borra archivos del almacenamiento y luego la cuenta (la base de datos se limpia en cascada).
export async function deleteUserCompletely(userId: string) {
  const { data: infs } = await db().from("influencers").select("id").eq("user_id", userId);
  const ids = (infs ?? []).map((i) => i.id);
  if (ids.length) {
    const { data: imgs } = await db().from("influencer_images").select("url").in("influencer_id", ids);
    const paths = (imgs ?? []).map((i) => i.url.split(`/${BUCKET}/`)[1]).filter(Boolean);
    for (let i = 0; i < paths.length; i += 100) await db().storage.from(BUCKET).remove(paths.slice(i, i + 100));
  }
  return db().auth.admin.deleteUser(userId);
}
