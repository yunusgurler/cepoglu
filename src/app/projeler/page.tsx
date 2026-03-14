import Link from "next/link";
import PageHero from "../components/PageHero";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { getProjects } from "../projects-data";
import { getSiteMediaUrl } from "@/lib/site-media";

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div id="top" className="site-wrap">
      <SiteHeader />
      <main>
        <PageHero
          eyebrow="Projeler"
          title="Tamamlanan ve devam eden proje portföyümüz"
          summary="Tüm projeler görsel kartlarla listelenmiştir. Kartlara tıklayarak detay sayfasına gidebilirsin."
          videoPath={getSiteMediaUrl("projects-hero.mp4", "/videos/projects-hero.mp4")}
        />

        <section className="content-grid">
          <article className="block span-12">
            <h2>Projeler</h2>
            <p>Her proje için fotoğraf ve detay sayfası bağlantısı aşağıda yer alır.</p>
          </article>

          <article className="span-12 project-gallery-grid">
            {projects.map((project) => (
              <Link key={project.slug} href={`/projeler/${project.slug}`} className="project-gallery-card">
                <div
                  className={`project-gallery-image ${project.coverImage ? "" : "is-empty"}`}
                  style={project.coverImage ? { backgroundImage: `url('${project.coverImage}')` } : undefined}
                />
                <div className="project-gallery-content">
                  <p className="project-meta">
                    {project.type} • {project.location} • {project.status}
                  </p>
                  <h3>{project.name}</h3>
                  <p>{project.summary}</p>
                </div>
              </Link>
            ))}
          </article>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
