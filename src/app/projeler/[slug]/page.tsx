import { notFound } from "next/navigation";
import PageHero from "../../components/PageHero";
import ProjectDetailGallery from "../../components/ProjectDetailGallery";
import SiteFooter from "../../components/SiteFooter";
import SiteHeader from "../../components/SiteHeader";
import { getProjectBySlug } from "../../projects-data";

type ProjectDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const galleryMedia = project.media.length > 0
    ? project.media
    : project.coverImage
      ? [
          {
            id: `${project.id}-cover`,
            kind: "image" as const,
            publicUrl: project.coverImage,
          },
        ]
      : [];

  return (
    <div id="top" className="site-wrap">
      <SiteHeader />
      <main>
        <PageHero
          eyebrow="Proje Detayı"
          title={project.name}
          summary={`${project.type} • ${project.location} • ${project.status}`}
          imagePath={project.coverImage ?? undefined}
        />

        <section className="content-grid">
          <article className="block span-12">
            <h2>{project.name}</h2>
            <p>{project.summary}</p>
          </article>

          <article className="block span-12">
            <h3>Detaylar</h3>
            <ul>
              {project.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
          </article>

          <article className="block span-12 project-detail-gallery-wrap">
            <h3>Proje Galerisi</h3>
            <ProjectDetailGallery media={galleryMedia} projectName={project.name} />
          </article>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
