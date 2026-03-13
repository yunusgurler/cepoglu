"use client";

import { useEffect, useState } from "react";

type ProjectDetailGalleryProps = {
  images: string[];
  projectName: string;
};

export default function ProjectDetailGallery({ images, projectName }: ProjectDetailGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const total = images.length;

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
        showPrev();
      }
      if (event.key === "ArrowRight") {
        showNext();
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
        {images.map((image, index) => (
          <button
            key={image}
            type="button"
            className="project-detail-gallery-item"
            style={{ backgroundImage: `url('${image}')` }}
            aria-label={`${projectName} galeri görseli ${index + 1}`}
            onClick={() => setActiveIndex(index)}
          />
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
            <figure
              className="project-lightbox-image"
              style={{ backgroundImage: `url('${images[activeIndex]}')` }}
              aria-label={`${projectName} tam ekran görsel ${activeIndex + 1}`}
            />
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
