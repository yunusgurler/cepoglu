import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

function loadEnvFile(fileName) {
  const envPath = path.join(process.cwd(), fileName);

  if (!fs.existsSync(envPath)) {
    return;
  }

  const lines = fs.readFileSync(envPath, "utf8").split("\n");

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, "");

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(".env");
loadEnvFile(".env.local");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.");
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const projectFile = path.join(process.cwd(), "src", "content", "projects.json");
const publicDir = path.join(process.cwd(), "public");
const projects = JSON.parse(fs.readFileSync(projectFile, "utf8"));

const PRIORITY_PROJECT_SLUGS = ["loya-homes", "my-hill-residence", "jasmine-boutiqe"];

function toLocalFilePath(publicPath) {
  return path.join(publicDir, publicPath.replace(/^\//, ""));
}

function sanitizeFileName(value) {
  const extension = path.extname(value).toLowerCase();
  const baseName = path.basename(value, extension);

  const normalized = baseName
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)/g, "")
    .toLowerCase();

  return `${normalized || "file"}${extension}`;
}

function getSortOrder(slug, fallbackIndex) {
  const priorityIndex = PRIORITY_PROJECT_SLUGS.indexOf(slug);
  return priorityIndex === -1 ? fallbackIndex + PRIORITY_PROJECT_SLUGS.length : priorityIndex;
}

async function uploadFile(bucket, storagePath, localFilePath, contentType) {
  const fileBuffer = fs.readFileSync(localFilePath);
  const { error } = await supabase.storage.from(bucket).upload(storagePath, fileBuffer, {
    upsert: true,
    contentType,
  });

  if (error) {
    throw error;
  }

  return supabase.storage.from(bucket).getPublicUrl(storagePath).data.publicUrl;
}

for (const project of projects) {
  const { data: projectRow, error: projectError } = await supabase
    .from("projects")
    .upsert(
      {
        slug: project.slug,
        sort_order: getSortOrder(project.slug, projects.indexOf(project)),
        name: project.name,
        location: project.location,
        type: project.type,
        status: project.status,
        summary: project.summary,
        details: project.details ?? [],
      },
      { onConflict: "slug" }
    )
    .select("id")
    .single();

  if (projectError) {
    throw projectError;
  }

  const { data: existingMediaRows, error: existingMediaError } = await supabase
    .from("project_media")
    .select("storage_path, kind")
    .eq("project_id", projectRow.id);

  if (existingMediaError) {
    throw existingMediaError;
  }

  const existingImagePaths = (existingMediaRows ?? [])
    .filter((item) => item.kind === "image")
    .map((item) => item.storage_path);
  const existingVideoPaths = (existingMediaRows ?? [])
    .filter((item) => item.kind === "video")
    .map((item) => item.storage_path);

  if (existingImagePaths.length > 0) {
    const { error } = await supabase.storage.from("project-images").remove(existingImagePaths);

    if (error) {
      throw error;
    }
  }

  if (existingVideoPaths.length > 0) {
    const { error } = await supabase.storage.from("project-videos").remove(existingVideoPaths);

    if (error) {
      throw error;
    }
  }

  const { error: deleteMediaError } = await supabase.from("project_media").delete().eq("project_id", projectRow.id);

  if (deleteMediaError) {
    throw deleteMediaError;
  }

  const mediaRows = [];
  const coverLocalPath = toLocalFilePath(project.image);

  if (fs.existsSync(coverLocalPath)) {
    const coverStoragePath = `${projectRow.id}/cover-${sanitizeFileName(path.basename(coverLocalPath))}`;
    const publicUrl = await uploadFile("project-images", coverStoragePath, coverLocalPath, "image/jpeg");
    mediaRows.push({
      project_id: projectRow.id,
      kind: "image",
      storage_path: coverStoragePath,
      public_url: publicUrl,
    });
  }

  const galleryDir = path.join(publicDir, "images", "projects", "gallery", project.slug);

  if (fs.existsSync(galleryDir)) {
    const galleryFiles = fs.readdirSync(galleryDir).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    for (const fileName of galleryFiles) {
      const localPath = path.join(galleryDir, fileName);
      const storagePath = `${projectRow.id}/${sanitizeFileName(fileName)}`;
      const publicUrl = await uploadFile("project-images", storagePath, localPath, "image/jpeg");

      mediaRows.push({
        project_id: projectRow.id,
        kind: "image",
        storage_path: storagePath,
        public_url: publicUrl,
      });
    }
  }

  if (mediaRows.length > 0) {
    const { error: mediaError } = await supabase.from("project_media").insert(mediaRows);

    if (mediaError) {
      throw mediaError;
    }
  }

  console.log(`Seeded ${project.slug}`);
}
