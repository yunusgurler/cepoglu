import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import { createSupabaseServerClient } from "./supabase/server";
import { hasSupabasePublicEnv } from "./supabase/env";
import fallbackProjects from "../content/projects.json";

export type ProjectMediaItem = {
  id: string;
  kind: "image" | "video";
  storagePath: string;
  publicUrl: string;
  createdAt: string;
};

export type ProjectItem = {
  id: string;
  slug: string;
  name: string;
  location: string;
  type: string;
  status: string;
  summary: string;
  details: string[];
  createdAt: string;
  media: ProjectMediaItem[];
  coverImage: string | null;
};

type ProjectRow = {
  id: string;
  slug: string;
  name: string;
  location: string;
  type: string;
  status: string;
  summary: string;
  details: string[] | null;
  created_at: string;
  project_media:
    | {
        id: string;
        kind: "image" | "video";
        storage_path: string;
        public_url: string;
        created_at: string;
      }[]
    | null;
};

type FallbackProjectRow = {
  slug: string;
  name: string;
  image: string;
  location: string;
  type: string;
  status: string;
  summary: string;
  details: string[];
};

const PRIORITY_PROJECT_SLUGS = ["loya-homes", "my-hill-residence", "jasmine-boutiqe"] as const;

function mapProject(row: ProjectRow): ProjectItem {
  const media = (row.project_media ?? []).map((item) => ({
    id: item.id,
    kind: item.kind,
    storagePath: item.storage_path,
    publicUrl: item.public_url,
    createdAt: item.created_at,
  }));

  const coverImage = media.find((item) => item.kind === "image")?.publicUrl ?? null;

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    location: row.location,
    type: row.type,
    status: row.status,
    summary: row.summary,
    details: row.details ?? [],
    createdAt: row.created_at,
    media,
    coverImage,
  };
}

function getFallbackProjectMedia(project: FallbackProjectRow, index: number): ProjectMediaItem[] {
  const media: ProjectMediaItem[] = [];

  media.push({
    id: `${project.slug}-cover`,
    kind: "image",
    storagePath: project.image,
    publicUrl: project.image,
    createdAt: new Date(index).toISOString(),
  });

  const galleryDir = path.join(process.cwd(), "public", "images", "projects", "gallery", project.slug);

  if (!fs.existsSync(galleryDir)) {
    return media;
  }

  const galleryFiles = fs
    .readdirSync(galleryDir)
    .filter((fileName) => /\.(jpe?g|png|webp|mp4|mov|webm)$/i.test(fileName))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

  for (const fileName of galleryFiles) {
    const extension = path.extname(fileName).toLowerCase();
    const kind = /\.(mp4|mov|webm)$/i.test(extension) ? "video" : "image";

    media.push({
      id: `${project.slug}-${fileName}`,
      kind,
      storagePath: `/images/projects/gallery/${project.slug}/${fileName}`,
      publicUrl: `/images/projects/gallery/${project.slug}/${fileName}`,
      createdAt: new Date(index).toISOString(),
    });
  }

  return media;
}

function getFallbackProjects() {
  return sortProjects((fallbackProjects as FallbackProjectRow[]).map((project, index) => {
    const media = getFallbackProjectMedia(project, index);

    return {
      id: project.slug,
      slug: project.slug,
      name: project.name,
      location: project.location,
      type: project.type,
      status: project.status,
      summary: project.summary,
      details: project.details ?? [],
      createdAt: new Date(index).toISOString(),
      media,
      coverImage: media.find((item) => item.kind === "image")?.publicUrl ?? project.image,
    };
  }));
}

function sortProjects(projects: ProjectItem[]) {
  return [...projects].sort((left, right) => {
    const leftPriority = PRIORITY_PROJECT_SLUGS.indexOf(left.slug as (typeof PRIORITY_PROJECT_SLUGS)[number]);
    const rightPriority = PRIORITY_PROJECT_SLUGS.indexOf(right.slug as (typeof PRIORITY_PROJECT_SLUGS)[number]);

    const normalizedLeftPriority = leftPriority === -1 ? Number.MAX_SAFE_INTEGER : leftPriority;
    const normalizedRightPriority = rightPriority === -1 ? Number.MAX_SAFE_INTEGER : rightPriority;

    if (normalizedLeftPriority !== normalizedRightPriority) {
      return normalizedLeftPriority - normalizedRightPriority;
    }

    return 0;
  });
}

export const getProjects = cache(async () => {
  if (!hasSupabasePublicEnv()) {
    return getFallbackProjects();
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("projects")
    .select(
      "id, slug, name, location, type, status, summary, details, created_at, project_media(id, kind, storage_path, public_url, created_at)"
    )
    .order("created_at", { ascending: false })
    .order("created_at", { foreignTable: "project_media", ascending: true });

  if (error) {
    throw new Error(`Failed to fetch projects: ${error.message}`);
  }

  return sortProjects((data as ProjectRow[]).map(mapProject));
});

export async function getProjectBySlug(slug: string) {
  if (!hasSupabasePublicEnv()) {
    return getFallbackProjects().find((project) => project.slug === slug) ?? null;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("projects")
    .select(
      "id, slug, name, location, type, status, summary, details, created_at, project_media(id, kind, storage_path, public_url, created_at)"
    )
    .eq("slug", slug)
    .order("created_at", { foreignTable: "project_media", ascending: true })
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch project: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  return mapProject(data as ProjectRow);
}
