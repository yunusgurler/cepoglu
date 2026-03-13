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

function getTyped(text: string, progress: number) {
  if (progress >= 1) {
    return text;
  }
  if (progress <= 0) {
    return "";
  }
  const chars = Array.from(text);
  const visible = Math.max(1, Math.floor(chars.length * progress));
  return chars.slice(0, visible).join("");
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
  const [typedProgress, setTypedProgress] = useState(
    slide.typewriter && !prefersReducedMotion ? 0 : 1
  );
  const [hasTypedOnce, setHasTypedOnce] = useState(prefersReducedMotion);

  useEffect(() => {
    if (!slide.typewriter || prefersReducedMotion || hasTypedOnce || !isActive) {
      return;
    }

    let raf = 0;
    let start: number | null = null;
    const duration = 1400;

    const animate = (time: number) => {
      if (start === null) {
        start = time;
      }

      const progress = Math.min(1, (time - start) / duration);
      setTypedProgress(progress);

      if (progress < 1) {
        raf = requestAnimationFrame(animate);
      } else {
        setHasTypedOnce(true);
      }
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [hasTypedOnce, isActive, prefersReducedMotion, slide.typewriter]);

  const typedTitle = slide.typewriter ? getTyped(slide.title, typedProgress) : slide.title;
  const typedSubtitle = slide.typewriter ? getTyped(slide.subtitle, typedProgress) : slide.subtitle;

  return (
    <article
      ref={slideRef}
      className={`gallery-slide ${slide.imageClass}`}
      style={{
        opacity: index === 0 ? 1 : 0,
        transform: "translate3d(0, 0, 0) scale(1.02)",
        zIndex: index === 0 ? 3 : 1,
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
          preload="metadata"
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
            opacity: index === 0 ? 1 : 0,
            transform: "translate3d(0, 0, 0)",
          }}
        >
          <p className="gallery-kicker">{slide.kicker}</p>
          <h1>
            {typedTitle}
            {slide.typewriter && typedProgress < 1 ? <span className="typewriter-cursor">|</span> : null}
          </h1>
          <p>{typedSubtitle}</p>
          <Link href={slide.ctaHref} className="btn-ghost">
            {slide.ctaLabel}
          </Link>
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
        const absDistance = Math.abs(distance);
        const isCurrent = absDistance < 0.5;
        const isActive = absDistance < 1.1;

        slide.style.opacity = isActive ? "1" : "0";
        slide.style.zIndex = isCurrent ? "3" : isActive ? "2" : "1";
        slide.style.pointerEvents = isCurrent ? "auto" : "none";
        slide.style.transform = reducedMotion
          ? "translate3d(0, 0, 0) scale(1)"
          : `translate3d(0, ${distance * 10}%, 0) scale(${1.02 + absDistance * 0.05})`;

        content.style.opacity = reducedMotion ? (isCurrent ? "1" : "0") : String(clamp(1 - absDistance * 1.15, 0, 1));
        content.style.transform = reducedMotion
          ? "translate3d(0, 0, 0)"
          : `translate3d(0, ${distance * 34}px, 0)`;
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
