import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdminUser } from "@/lib/auth";
import { getProjectById } from "@/lib/projects";
import GalleryOrderList from "./GalleryOrderList";

type AdminProjectGalleryPageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export default async function AdminProjectGalleryPage({ params }: AdminProjectGalleryPageProps) {
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
          <p className="admin-kicker">Galeri Yonetimi</p>
          <h1>{project.name}</h1>
          <p>Bu ekranda projeye ait gorsel ve videolarin galeri sirasini duzenleyebilirsiniz.</p>
        </div>
        <div className="admin-header-actions">
          <Link href="/admin" className="admin-button admin-button-ghost">
            Geri Don
          </Link>
        </div>
      </section>

      {project.media.length === 0 ? (
        <section className="admin-card">
          <h2>Galeri bos</h2>
          <p>Bu projede henuz siralanacak medya bulunmuyor.</p>
        </section>
      ) : (
        <GalleryOrderList projectId={project.id} media={project.media} />
      )}
    </main>
  );
}
