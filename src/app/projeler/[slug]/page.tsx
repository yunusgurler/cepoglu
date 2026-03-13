import fs from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";
import PageHero from "../../components/PageHero";
import ProjectDetailGallery from "../../components/ProjectDetailGallery";
import SiteFooter from "../../components/SiteFooter";
import SiteHeader from "../../components/SiteHeader";
import { PROJECTS, getProjectBySlug } from "../../projects-data";

type ProjectDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

function getProjectGalleryImages(slug: string) {
  const galleryDir = path.join(process.cwd(), "public", "images", "projects", "gallery", slug);

  if (!fs.existsSync(galleryDir)) {
    return [];
  }

  return fs
    .readdirSync(galleryDir)
    .filter((fileName) => /\.(jpe?g|png|webp)$/i.test(fileName))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }))
    .map((fileName) => `/images/projects/gallery/${slug}/${fileName}`);
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const galleryImages = getProjectGalleryImages(project.slug);
  const displayGallery = galleryImages.length > 0 ? galleryImages : [project.image];

  return (
    <div id="top" className="site-wrap">
      <SiteHeader />
      <main>
        <PageHero
          eyebrow="Proje Detayı"
          title={project.name}
          summary={`${project.type} • ${project.location} • ${project.status}`}
          imagePath={project.image}
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
            <ProjectDetailGallery images={displayGallery} projectName={project.name} />
          </article>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
