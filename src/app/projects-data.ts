import projects from "../content/projects.json";

export type ProjectItem = {
  slug: string;
  name: string;
  image: string;
  location: string;
  type: string;
  status: string;
  summary: string;
  details: string[];
};

export const PROJECTS = projects as ProjectItem[];

export function getProjectBySlug(slug: string) {
  return PROJECTS.find((project) => project.slug === slug);
}
