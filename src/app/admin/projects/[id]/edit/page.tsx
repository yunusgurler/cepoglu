import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdminUser } from "@/lib/auth";
import { getProjectById } from "@/lib/projects";
import NewProjectForm from "../../new/NewProjectForm";

type AdminProjectEditPageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export default async function AdminProjectEditPage({ params }: AdminProjectEditPageProps) {
  await requireAdminUser();
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <main className="admin-shell">
      <section className="admin-header">
        <div>
          <p className="admin-kicker">Admin Panel</p>
          <h1>Projeyi Duzenle</h1>
          <p>{project.name} projesinin metin alanlarini ve yeni medya eklemelerini bu ekrandan yonetebilirsiniz.</p>
        </div>
        <div className="admin-header-actions">
          <Link href="/admin" className="admin-button admin-button-ghost">
            Geri Don
          </Link>
        </div>
      </section>

      <section className="admin-card">
        <NewProjectForm project={project} />
      </section>
    </main>
  );
}
