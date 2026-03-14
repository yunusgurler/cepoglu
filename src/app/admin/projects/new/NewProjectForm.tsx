"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { ProjectItem } from "@/lib/projects";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type UploadKind = "image" | "video";

const PROJECT_TYPE_OPTIONS = ["Konut", "Residence", "Villa", "Ticari", "Karma Yasam"] as const;
const PROJECT_STATUS_OPTIONS = ["Devam Ediyor", "Yeni Proje", "Tamamlandi"] as const;

function slugify(value: string) {
  return value
    .toLocaleLowerCase("tr")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function sanitizeFileName(value: string) {
  return value.replace(/[^a-zA-Z0-9._-]+/g, "-").toLowerCase();
}

async function uploadFiles(
  projectId: string,
  files: File[],
  bucket: "project-images" | "project-videos",
  kind: UploadKind
) {
  const supabase = createSupabaseBrowserClient();
  const mediaRows: { project_id: string; kind: UploadKind; sort_order: number; storage_path: string; public_url: string }[] = [];

  for (const file of files) {
    const fileName = `${Date.now()}-${crypto.randomUUID()}-${sanitizeFileName(file.name)}`;
    const storagePath = `${projectId}/${fileName}`;
    const { error } = await supabase.storage.from(bucket).upload(storagePath, file, {
      upsert: false,
      contentType: file.type,
    });

    if (error) {
      throw new Error(error.message);
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(storagePath);

    mediaRows.push({
      project_id: projectId,
      kind,
      sort_order: mediaRows.length,
      storage_path: storagePath,
      public_url: data.publicUrl,
    });
  }

  return mediaRows;
}

type NewProjectFormProps = {
  project?: ProjectItem;
};

export default function NewProjectForm({ project }: NewProjectFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const isEditMode = Boolean(project);

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      setError("");

      const name = String(formData.get("name") ?? "").trim();
      const slugInput = String(formData.get("slug") ?? "").trim();
      const location = String(formData.get("location") ?? "").trim();
      const type = String(formData.get("type") ?? "").trim();
      const status = String(formData.get("status") ?? "").trim();
      const summary = String(formData.get("summary") ?? "").trim();
      const detailsRaw = String(formData.get("details") ?? "").trim();
      const imageFiles = formData
        .getAll("images")
        .filter((item): item is File => item instanceof File && item.size > 0);
      const videoFiles = formData
        .getAll("videos")
        .filter((item): item is File => item instanceof File && item.size > 0);

      if (!name || !location || !type || !status || !summary) {
        setError("Tum metin alanlari doldurulmalidir.");
        return;
      }

      if (!isEditMode && imageFiles.length === 0) {
        setError("En az bir gorsel yuklemelisiniz.");
        return;
      }

      const normalizedSlug = slugify(slugInput || name);
      const details = detailsRaw
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);

      try {
        const supabase = createSupabaseBrowserClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setError("Oturum bulunamadi. Tekrar giris yapin.");
          return;
        }

        let projectId = project?.id;

        if (isEditMode) {
          const { error: updateError } = await supabase
            .from("projects")
            .update({
              slug: normalizedSlug,
              name,
              location,
              type,
              status,
              summary,
              details,
            })
            .eq("id", project!.id);

          if (updateError) {
            throw new Error(updateError.message);
          }
        } else {
          const { data: projectRow, error: projectError } = await supabase
            .from("projects")
            .select("sort_order")
            .order("sort_order", { ascending: false })
            .limit(1)
            .maybeSingle();

          if (projectError) {
            throw new Error(projectError.message);
          }

          const nextSortOrder = (projectRow?.sort_order ?? -1) + 1;

          const { data: insertedProjectRow, error: insertError } = await supabase
            .from("projects")
            .insert({
              slug: normalizedSlug,
              sort_order: nextSortOrder,
              name,
              location,
              type,
              status,
              summary,
              details,
            })
            .select("id")
            .single();

          if (insertError || !insertedProjectRow) {
            throw new Error(insertError?.message ?? "Proje kaydi olusturulamadi.");
          }

          projectId = insertedProjectRow.id;
        }

        if (!projectId) {
          throw new Error("Proje kaydi bulunamadi.");
        }

        const imageRows = await uploadFiles(projectId, imageFiles, "project-images", "image");
        const videoRows = await uploadFiles(projectId, videoFiles, "project-videos", "video");
        const mediaRows = [...imageRows, ...videoRows];

        if (mediaRows.length > 0) {
          const { error: mediaError } = await supabase.from("project_media").insert(mediaRows);

          if (mediaError) {
            throw new Error(mediaError.message);
          }
        }

        router.push("/admin");
        router.refresh();
      } catch (submitError) {
        setError(submitError instanceof Error ? submitError.message : "Proje kaydedilemedi.");
      }
    });
  };

  return (
    <form action={handleSubmit} className="admin-form admin-form-wide">
      <div className="admin-grid">
        <label className="admin-field">
          <span>Proje Adi</span>
          <input type="text" name="name" defaultValue={project?.name ?? ""} required />
        </label>
        <label className="admin-field">
          <span>Slug</span>
          <input
            type="text"
            name="slug"
            defaultValue={project?.slug ?? ""}
            placeholder="bos birakirsan otomatik uretilir"
          />
        </label>
        <label className="admin-field">
          <span>Konum</span>
          <input type="text" name="location" defaultValue={project?.location ?? ""} required />
        </label>
        <label className="admin-field">
          <span>Tip</span>
          <select name="type" defaultValue={project?.type ?? PROJECT_TYPE_OPTIONS[0]} required>
            {PROJECT_TYPE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label className="admin-field">
          <span>Durum</span>
          <select name="status" defaultValue={project?.status ?? PROJECT_STATUS_OPTIONS[0]} required>
            {PROJECT_STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="admin-field">
        <span>Kisa Aciklama</span>
        <textarea name="summary" rows={4} defaultValue={project?.summary ?? ""} required />
      </label>

      <label className="admin-field">
        <span>Detaylar</span>
        <textarea
          name="details"
          rows={6}
          defaultValue={project?.details.join("\n") ?? ""}
          placeholder="Her satira bir detay maddesi yazin."
        />
      </label>

      <div className="admin-grid">
        <label className="admin-field">
          <span>{isEditMode ? "Yeni Gorseller Ekle" : "Gorseller"}</span>
          <input type="file" name="images" accept="image/*" multiple required={!isEditMode} />
        </label>
        <label className="admin-field">
          <span>{isEditMode ? "Yeni Videolar Ekle" : "Videolar"}</span>
          <input type="file" name="videos" accept="video/mp4,video/quicktime,video/webm" multiple />
        </label>
      </div>

      {error ? <p className="admin-error">{error}</p> : null}

      {isEditMode ? (
        <p className="admin-order-note">
          Mevcut medya dosyalari korunur. Galeri sirasi ve medya duzeni icin proje kartindaki `Galeri` ekranini
          kullanin.
        </p>
      ) : null}

      <div className="admin-form-actions">
        <button type="submit" className="admin-button" disabled={isPending}>
          {isPending ? "Kaydediliyor..." : isEditMode ? "Projeyi Guncelle" : "Projeyi Kaydet"}
        </button>
      </div>
    </form>
  );
}
