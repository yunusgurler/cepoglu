"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { HOME_SLIDES, type HomeSlide } from "../home-content";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function formatSlideNumber(value: number) {
  return String(value).padStart(2, "0");
}

function subscribeToReducedMotion(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

type GallerySlideProps = {
  slide: HomeSlide;
  index: number;
  totalSlides: number;
  isActive: boolean;
  prefersReducedMotion: boolean;
  slideRef: (node: HTMLElement | null) => void;
  contentRef: (node: HTMLDivElement | null) => void;
};

function GallerySlide({
  slide,
  index,
  totalSlides,
  isActive,
  prefersReducedMotion,
  slideRef,
  contentRef,
}: GallerySlideProps) {
  const [hasEntered, setHasEntered] = useState(index === 0);
  const isExternalCta = slide.ctaHref.startsWith("http");

  useEffect(() => {
    if (isActive) {
      setHasEntered(true);
    }
  }, [isActive]);

  return (
    <article
      ref={slideRef}
      className={`gallery-slide ${slide.imageClass}`}
      style={{
        opacity: 1,
        transform: `translate3d(0, ${index === 0 ? 0 : 100}%, 0) scale(1)`,
        zIndex: index + 1,
      }}
      aria-hidden={!isActive}
    >
      {slide.video ? (
        <video
          className="gallery-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden
        >
          <source src={slide.video} type="video/mp4" />
        </video>
      ) : null}
      <div className="gallery-overlay" />
      <div className="hero-grid-mark" />

      <div className="gallery-content-wrap">
        <div
          ref={contentRef}
          className="gallery-content"
          style={{
            opacity: 1,
            transform: "translate3d(0, 0, 0)",
          }}
          data-active={isActive ? "true" : "false"}
          data-entered={hasEntered ? "true" : "false"}
        >
          <p className="gallery-kicker">{slide.kicker}</p>
          <h1>
            {slide.title}
          </h1>
          <p>{slide.subtitle}</p>
          {isExternalCta ? (
            <a href={slide.ctaHref} className="btn-ghost" target="_blank" rel="noreferrer">
              {slide.ctaLabel}
            </a>
          ) : (
            <Link href={slide.ctaHref} className="btn-ghost">
              {slide.ctaLabel}
            </Link>
          )}
        </div>

        <div className="gallery-bottom">
          <p>
            <span /> T&#252;rkiye&apos;miz I&#231;in, Gururla
          </p>
          <span>
            {formatSlideNumber(index + 1)} / {formatSlideNumber(totalSlides)}
          </span>
        </div>
      </div>
    </article>
  );
}

export default function PinnedHeroGallery() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const slideRefs = useRef<(HTMLElement | null)[]>([]);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const frameRef = useRef<number | null>(null);
  const boundsRef = useRef({ start: 0, end: 1 });
  const lastActiveIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const totalSlides = HOME_SLIDES.length;
  const prefersReducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    () => false
  );

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }

    const measure = () => {
      const start = section.getBoundingClientRect().top + window.scrollY;
      const distance = Math.max(section.offsetHeight - window.innerHeight, 1);
      boundsRef.current = {
        start,
        end: start + distance,
      };
    };

    const applyProgress = () => {
      frameRef.current = null;

      const { start, end } = boundsRef.current;
      const progress = clamp((window.scrollY - start) / Math.max(end - start, 1), 0, 1);
      const position = progress * Math.max(totalSlides - 1, 0);
      const nextActiveIndex = totalSlides <= 1 ? 0 : clamp(Math.round(position), 0, totalSlides - 1);
      const reducedMotion = prefersReducedMotion;

      for (let index = 0; index < totalSlides; index += 1) {
        const slide = slideRefs.current[index];
        const content = contentRefs.current[index];

        if (!slide || !content) {
          continue;
        }

        const distance = index - position;
        const clampedOffset = clamp(distance * 100, 0, 100);
        const isCurrent = distance <= 0 && distance > -1;

        slide.style.opacity = "1";
        slide.style.zIndex = String(index + 1);
        slide.style.pointerEvents = isCurrent ? "auto" : "none";
        slide.style.transform = reducedMotion
          ? "translate3d(0, 0, 0) scale(1)"
          : `translate3d(0, ${clampedOffset}%, 0) scale(1)`;

        content.style.opacity = "1";
        content.style.transform = "translate3d(0, 0, 0)";
      }

      if (nextActiveIndex !== lastActiveIndexRef.current) {
        lastActiveIndexRef.current = nextActiveIndex;
        setActiveIndex(nextActiveIndex);
      }
    };

    const requestUpdate = () => {
      if (frameRef.current !== null) {
        return;
      }

      frameRef.current = requestAnimationFrame(applyProgress);
    };

    const handleResize = () => {
      measure();
      requestUpdate();
    };

    measure();
    applyProgress();

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", handleResize);
    };
  }, [prefersReducedMotion, totalSlides]);

  return (
    <section ref={sectionRef} className="pinned-gallery" aria-label="Tam ekran proje galerisi">
      <div className="pinned-stage">
        {HOME_SLIDES.map((slide, index) => (
          <GallerySlide
            key={slide.title}
            slide={slide}
            index={index}
            totalSlides={totalSlides}
            isActive={index === activeIndex}
            prefersReducedMotion={prefersReducedMotion}
            slideRef={(node) => {
              slideRefs.current[index] = node;
            }}
            contentRef={(node) => {
              contentRefs.current[index] = node;
            }}
          />
        ))}
      </div>
    </section>
  );
}
