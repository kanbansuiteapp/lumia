import SettingsTabs from "@/components/SettingsTabs";
import { getUser, isSuperAdmin } from "@/lib/auth";

export default async function Configuracion() {
  const admin = isSuperAdmin(await getUser());
  return (
    <main>
      <h1>Configuración</h1>
      <SettingsTabs admin={admin} />
    </main>
  );
}
