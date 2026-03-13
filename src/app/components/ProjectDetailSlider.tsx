"use client";

import { useState } from "react";

type ProjectDetailSliderProps = {
  images: string[];
  projectName: string;
};

export default function ProjectDetailSlider({ images, projectName }: ProjectDetailSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const total = images.length;

  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  return (
    <div className="project-slider">
      <div className="project-slider-stage">
        <div className="project-slider-track" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
          {images.map((image, index) => (
            <figure
              key={image}
              className="project-slider-slide"
              style={{ backgroundImage: `url('${image}')` }}
              aria-label={`${projectName} görsel ${index + 1}`}
            />
          ))}
        </div>

        {total > 1 ? (
          <>
            <button type="button" className="project-slider-nav prev" onClick={goPrev} aria-label="Önceki görsel">
              ‹
            </button>
            <button type="button" className="project-slider-nav next" onClick={goNext} aria-label="Sonraki görsel">
              ›
            </button>
          </>
        ) : null}
      </div>

      {total > 1 ? (
        <div className="project-slider-dots" aria-hidden>
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              className={`project-slider-dot ${index === activeIndex ? "is-active" : ""}`}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
