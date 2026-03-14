import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/auth";
import { hasSupabasePublicEnv } from "@/lib/supabase/env";
import AdminLoginForm from "./AdminLoginForm";

export default async function AdminLoginPage() {
  const isConfigured = hasSupabasePublicEnv();
  const user = await getAdminUser();

  if (user) {
    redirect("/admin");
  }

  return (
    <main className="admin-auth-shell">
      <section className="admin-auth-card">
        <p className="admin-kicker">Admin</p>
        <h1>Proje yonetimi girisi</h1>
        <p>Yalnizca yetkili kullanici proje ekleme ve silme islemlerine erisebilir.</p>
        {isConfigured ? (
          <AdminLoginForm />
        ) : (
          <p className="admin-error">Supabase ortam degiskenleri tanimlanmadan admin paneli kullanilamaz.</p>
        )}
      </section>
    </main>
  );
}
