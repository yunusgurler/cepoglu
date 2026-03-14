"use client";

import { useMemo, useState } from "react";
import type { ProjectMediaItem } from "@/lib/projects";
import { saveProjectMediaOrderAction } from "../../actions";
import GallerySaveOrderButton from "../../GallerySaveOrderButton";

type GalleryOrderListProps = {
  projectId: string;
  media: ProjectMediaItem[];
};

export default function GalleryOrderList({ projectId, media }: GalleryOrderListProps) {
  const [orderedMedia, setOrderedMedia] = useState(media);

  const hasChanges = useMemo(
    () => orderedMedia.some((item, index) => item.id !== media[index]?.id),
    [orderedMedia, media]
  );

  function moveMediaItem(mediaId: string, direction: "up" | "down") {
    setOrderedMedia((current) => {
      const index = current.findIndex((item) => item.id === mediaId);

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

  const mediaOrderJson = JSON.stringify(orderedMedia.map((item) => item.id));

  return (
    <>
      <div className="admin-order-toolbar">
        <p className="admin-order-note">Galeri ogelerini yukari ve asagi ile duzenleyip kaydedin.</p>
        <form action={saveProjectMediaOrderAction}>
          <input type="hidden" name="projectId" value={projectId} />
          <input type="hidden" name="mediaOrder" value={mediaOrderJson} />
          <GallerySaveOrderButton />
        </form>
      </div>

      <section className="admin-media-grid">
        {orderedMedia.map((item, index) => (
          <article key={item.id} className="admin-card admin-media-card">
            <div className="admin-media-preview">
              {item.kind === "image" ? (
                <div className="admin-media-image" style={{ backgroundImage: `url('${item.publicUrl}')` }} />
              ) : (
                <video className="admin-media-video" src={item.publicUrl} muted playsInline preload="metadata" />
              )}
            </div>
            <div className="admin-media-body">
              <div className="admin-project-badges">
                <span>{item.kind === "image" ? "Gorsel" : "Video"}</span>
                <span>#{index + 1}</span>
              </div>
              <p className="admin-media-path">{item.storagePath}</p>
              <div className="admin-project-actions">
                <button
                  type="button"
                  className="admin-button admin-button-ghost"
                  onClick={() => moveMediaItem(item.id, "up")}
                  disabled={index === 0}
                >
                  Yukari
                </button>
                <button
                  type="button"
                  className="admin-button admin-button-ghost"
                  onClick={() => moveMediaItem(item.id, "down")}
                  disabled={index === orderedMedia.length - 1}
                >
                  Asagi
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>

      {hasChanges ? (
        <div className="admin-order-toolbar bottom">
          <p className="admin-order-note">Galeri sirasinda kaydedilmemis degisiklikler var.</p>
          <form action={saveProjectMediaOrderAction}>
            <input type="hidden" name="projectId" value={projectId} />
            <input type="hidden" name="mediaOrder" value={mediaOrderJson} />
            <GallerySaveOrderButton />
          </form>
        </div>
      ) : null}
    </>
  );
}
