import { notFound } from "next/navigation";
import AdminPanel from "@/components/AdminPanel";
import { getUser, isSuperAdmin } from "@/lib/auth";

export default async function Admin() {
  if (!isSuperAdmin(await getUser())) notFound();
  return <AdminPanel />;
}
