"use client";

import { useEffect, useState } from "react";
import type { ProjectMediaItem } from "../projects-data";

type ProjectDetailGalleryProps = {
  media: Pick<ProjectMediaItem, "id" | "kind" | "publicUrl">[];
  projectName: string;
};

export default function ProjectDetailGallery({ media, projectName }: ProjectDetailGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const total = media.length;

  const close = () => setActiveIndex(null);
  const showPrev = () => setActiveIndex((prev) => (prev === null ? 0 : (prev - 1 + total) % total));
  const showNext = () => setActiveIndex((prev) => (prev === null ? 0 : (prev + 1) % total));

  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
      if (event.key === "ArrowLeft") {
        setActiveIndex((prev) => (prev === null ? 0 : (prev - 1 + total) % total));
      }
      if (event.key === "ArrowRight") {
        setActiveIndex((prev) => (prev === null ? 0 : (prev + 1) % total));
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, total]);

  return (
    <>
      <div className="project-detail-gallery">
        {media.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className={`project-detail-gallery-item ${item.kind === "video" ? "is-video" : ""}`}
            style={item.kind === "image" ? { backgroundImage: `url('${item.publicUrl}')` } : undefined}
            aria-label={`${projectName} galeri ogesi ${index + 1}`}
            onClick={() => setActiveIndex(index)}
          >
            {item.kind === "video" ? (
              <video className="project-detail-gallery-video" muted playsInline preload="metadata">
                <source src={item.publicUrl} />
              </video>
            ) : null}
          </button>
        ))}
      </div>

      {activeIndex !== null ? (
        <div className="project-lightbox" role="dialog" aria-modal="true">
          <button type="button" className="project-lightbox-backdrop" onClick={close} aria-label="Kapat" />
          <div className="project-lightbox-stage">
            <button type="button" className="project-lightbox-close" onClick={close} aria-label="Kapat">
              ×
            </button>
            {total > 1 ? (
              <button type="button" className="project-lightbox-nav prev" onClick={showPrev} aria-label="Önceki">
                ‹
              </button>
            ) : null}
            {media[activeIndex].kind === "image" ? (
              <figure
                className="project-lightbox-image"
                style={{ backgroundImage: `url('${media[activeIndex].publicUrl}')` }}
                aria-label={`${projectName} tam ekran gorsel ${activeIndex + 1}`}
              />
            ) : (
              <video
                className="project-lightbox-video"
                src={media[activeIndex].publicUrl}
                controls
                autoPlay
                playsInline
              />
            )}
            {total > 1 ? (
              <button type="button" className="project-lightbox-nav next" onClick={showNext} aria-label="Sonraki">
                ›
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
