"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ProjectItem } from "@/lib/projects";
import { deleteProjectAction, saveProjectOrderAction } from "./actions";
import DeleteProjectButton from "./DeleteProjectButton";
import SaveOrderButton from "./SaveOrderButton";

type AdminProjectListProps = {
  projects: ProjectItem[];
};

export default function AdminProjectList({ projects }: AdminProjectListProps) {
  const [orderedProjects, setOrderedProjects] = useState(projects);

  const hasChanges = useMemo(
    () => orderedProjects.some((project, index) => project.id !== projects[index]?.id),
    [orderedProjects, projects]
  );

  function moveProject(projectId: string, direction: "up" | "down") {
    setOrderedProjects((current) => {
      const index = current.findIndex((project) => project.id === projectId);

      if (index === -1) {
        return current;
      }

      const targetIndex = direction === "up" ? index - 1 : index + 1;

      if (targetIndex < 0 || targetIndex >= current.length) {
        return current;
      }

      const next = [...current];
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next;
    });
  }

  const orderedIdsJson = JSON.stringify(orderedProjects.map((project) => project.id));

  return (
    <>
      <div className="admin-order-toolbar">
        <p className="admin-order-note">Yukari ve asagi ile sirayi duzenleyip sonra kaydedin.</p>
        <form action={saveProjectOrderAction}>
          <input type="hidden" name="order" value={orderedIdsJson} />
          <SaveOrderButton />
        </form>
      </div>

      <section className="admin-list">
        {orderedProjects.map((project, index) => (
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
                  <span>#{index + 1}</span>
                </div>
                <p className="admin-project-meta">{project.location}</p>
              </div>
              <h2>{project.name}</h2>
              <p className="admin-project-summary">{project.summary}</p>
              <p className="admin-project-count">{project.media.length} medya dosyasi</p>
              <div className="admin-project-actions">
                <button
                  type="button"
                  className="admin-button admin-button-ghost"
                  onClick={() => moveProject(project.id, "up")}
                  disabled={index === 0}
                >
                  Yukari
                </button>
                <button
                  type="button"
                  className="admin-button admin-button-ghost"
                  onClick={() => moveProject(project.id, "down")}
                  disabled={index === orderedProjects.length - 1}
                >
                  Asagi
                </button>
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
        ))}
      </section>

      {hasChanges ? (
        <div className="admin-order-toolbar bottom">
          <p className="admin-order-note">Siralamada kaydedilmemis degisiklikler var.</p>
          <form action={saveProjectOrderAction}>
            <input type="hidden" name="order" value={orderedIdsJson} />
            <SaveOrderButton />
          </form>
        </div>
      ) : null}
    </>
  );
}
