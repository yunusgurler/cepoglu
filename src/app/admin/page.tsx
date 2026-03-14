import Link from "next/link";
import { requireAdminUser } from "@/lib/auth";
import { getProjects } from "@/lib/projects";
import { hasSupabasePublicEnv } from "@/lib/supabase/env";
import { deleteProjectAction, logoutAction } from "./actions";
import AdminLogoutButton from "./AdminLogoutButton";
import DeleteProjectButton from "./DeleteProjectButton";

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

      <section className="admin-list">
        {projects.length === 0 ? (
          <article className="admin-card">
            <h2>Henuz proje yok</h2>
            <p>Ilk projeyi eklemek icin yeni proje ekranini kullanin.</p>
          </article>
        ) : (
          projects.map((project) => (
            <article key={project.id} className="admin-card admin-project-card">
              <div
                className={`admin-project-cover ${project.coverImage ? "" : "is-empty"}`}
                style={project.coverImage ? { backgroundImage: `url('${project.coverImage}')` } : undefined}
              />
              <div className="admin-project-body">
                <div className="admin-project-top">
                  <div className="admin-project-badges">
                    <span>{project.type}</span>
                    <span>{project.status}</span>
                  </div>
                  <p className="admin-project-meta">{project.location}</p>
                </div>
                <h2>{project.name}</h2>
                <p className="admin-project-summary">{project.summary}</p>
                <p className="admin-project-count">{project.media.length} medya dosyasi</p>
                <div className="admin-project-actions">
                  <Link href={`/projeler/${project.slug}`} className="admin-button admin-button-ghost">
                    Goruntule
                  </Link>
                  <form action={deleteProjectAction}>
                    <input type="hidden" name="projectId" value={project.id} />
                    <DeleteProjectButton />
                  </form>
                </div>
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
