import Link from "next/link";
import { requireAdminUser } from "@/lib/auth";
import { getProjects } from "@/lib/projects";
import { hasSupabasePublicEnv } from "@/lib/supabase/env";
import { logoutAction } from "./actions";
import AdminProjectList from "./AdminProjectList";
import AdminLogoutButton from "./AdminLogoutButton";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  if (!hasSupabasePublicEnv()) {
    return (
      <main className="admin-shell">
        <section className="admin-card">
          <p className="admin-kicker">Admin Panel</p>
          <h1>Supabase ayari gerekli</h1>
          <p>`.env` icinde Supabase degiskenleri tanimlanmadan admin paneli kullanilamaz.</p>
        </section>
      </main>
    );
  }

  await requireAdminUser();
  const projects = await getProjects();

  return (
    <main className="admin-shell">
      <section className="admin-header">
        <div>
          <p className="admin-kicker">Admin Panel</p>
          <h1>Projeler</h1>
          <p>Bu panelden yeni proje ekleyebilir ve mevcut projeleri silebilirsiniz.</p>
        </div>
        <div className="admin-header-actions">
          <Link href="/admin/projects/new" className="admin-button">
            Yeni Proje
          </Link>
          <form action={logoutAction}>
            <AdminLogoutButton />
          </form>
        </div>
      </section>

      <section>
        {projects.length === 0 ? (
          <article className="admin-card">
            <h2>Henuz proje yok</h2>
            <p>Ilk projeyi eklemek icin yeni proje ekranini kullanin.</p>
          </article>
        ) : (
          <AdminProjectList projects={projects} />
        )}
      </section>
    </main>
  );
}
