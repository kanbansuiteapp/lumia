import type { ReactNode } from "react";
import TopNav from "@/components/TopNav";
import { getUser, isSuperAdmin } from "@/lib/auth";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const user = await getUser();
  return (
    <>
      <TopNav email={user?.email ?? ""} name={(user?.user_metadata?.full_name as string) ?? ""} admin={isSuperAdmin(user)} />
      {children}
    </>
  );
}
