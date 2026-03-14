import Link from "next/link";
import { requireAdminUser } from "@/lib/auth";
import { hasSupabasePublicEnv } from "@/lib/supabase/env";
import NewProjectForm from "./NewProjectForm";

export default async function NewProjectPage() {
  if (!hasSupabasePublicEnv()) {
    return (
      <main className="admin-shell">
        <section className="admin-card">
          <p className="admin-kicker">Admin Panel</p>
          <h1>Supabase ayari gerekli</h1>
          <p>Yeni proje eklemek icin once Supabase ortam degiskenlerini tanimlayin.</p>
        </section>
      </main>
    );
  }

  await requireAdminUser();

  return (
    <main className="admin-shell">
      <section className="admin-header">
        <div>
          <p className="admin-kicker">Admin Panel</p>
          <h1>Yeni Proje</h1>
          <p>Proje bilgilerini ve medya dosyalarini ekleyerek yeni kayit olusturun.</p>
        </div>
        <div className="admin-header-actions">
          <Link href="/admin" className="admin-button admin-button-ghost">
            Geri Don
          </Link>
        </div>
      </section>

      <section className="admin-card">
        <NewProjectForm />
      </section>
    </main>
  );
}
