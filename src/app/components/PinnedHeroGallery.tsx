"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
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

type GallerySlideProps = {
  slide: HomeSlide;
  index: number;
  totalSlides: number;
  opacity: number;
  isActive: boolean;
  translateY: string;
  scale: number;
  contentTranslateY: string;
  contentOpacity: number;
  zIndex: number;
};

function GallerySlide({
  slide,
  index,
  totalSlides,
  opacity,
  isActive,
  translateY,
  scale,
  contentTranslateY,
  contentOpacity,
  zIndex,
}: GallerySlideProps) {
  const [typedProgress, setTypedProgress] = useState(slide.typewriter ? 0 : 1);
  const [hasTypedOnce, setHasTypedOnce] = useState(false);

  useEffect(() => {
    if (!slide.typewriter || hasTypedOnce || !isActive) {
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
    return () => {
      cancelAnimationFrame(raf);
    };
  }, [hasTypedOnce, isActive, slide.typewriter]);

  const typedTitle = slide.typewriter ? getTyped(slide.title, typedProgress) : slide.title;
  const typedSubtitle = slide.typewriter ? getTyped(slide.subtitle, typedProgress) : slide.subtitle;

  return (
    <article
      className={`gallery-slide ${slide.imageClass}`}
      style={{
        opacity,
        zIndex,
        transform: `translateY(${translateY}) scale(${scale})`,
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
          className="gallery-content"
          style={{
            transform: `translateY(${contentTranslateY})`,
            opacity: contentOpacity,
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
            <span /> Türkiye'miz İçin, Gururla
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
  const [progress, setProgress] = useState(0);
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const totalSlides = HOME_SLIDES.length;
  const segment = totalSlides > 1 ? 1 / (totalSlides - 1) : 1;

  useEffect(() => {
    let raf = 0;

    const onScroll = () => {
      const node = sectionRef.current;
      if (!node) {
        return;
      }

      const rect = node.getBoundingClientRect();
      const total = node.offsetHeight - window.innerHeight;
      if (total <= 0) {
        targetProgressRef.current = 0;
        return;
      }

      const traveled = clamp(-rect.top, 0, total);
      targetProgressRef.current = traveled / total;
    };

    const tick = () => {
      const target = targetProgressRef.current;
      const current = currentProgressRef.current;
      const next = current + (target - current) * 0.14;

      if (Math.abs(next - current) > 0.0004) {
        currentProgressRef.current = next;
        setProgress(next);
      } else if (current !== target) {
        currentProgressRef.current = target;
        setProgress(target);
      }

      raf = requestAnimationFrame(tick);
    };

    onScroll();
    raf = requestAnimationFrame(tick);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const activeIndex = useMemo(() => {
    if (totalSlides <= 1) {
      return 0;
    }

    return clamp(Math.floor(progress / segment), 0, totalSlides - 1);
  }, [progress, segment, totalSlides]);

  const slideStates = useMemo(
    () => {
      const position = progress * (totalSlides - 1);

      return HOME_SLIDES.map((_, index) => {
        const distance = index - position;
        const absDistance = Math.abs(distance);
        const isCurrent = absDistance < 0.5;
        const isActive = absDistance < 1.1;

        return {
          opacity: isActive ? 1 : 0,
          translateY: `${distance * 10}%`,
          scale: 1.02 + absDistance * 0.05,
          contentTranslateY: `${distance * 34}px`,
          contentOpacity: clamp(1 - absDistance * 1.15, 0, 1),
          zIndex: isCurrent ? 3 : isActive ? 2 : 1,
          isActive,
        };
      });
    },
    [progress, totalSlides]
  );

  return (
    <section ref={sectionRef} className="pinned-gallery" aria-label="Tam ekran proje galerisi">
      <div className="pinned-stage">
        {HOME_SLIDES.map((slide, index) => (
          <GallerySlide
            key={slide.title}
            slide={slide}
            index={index}
            totalSlides={totalSlides}
            opacity={slideStates[index].opacity}
            translateY={slideStates[index].translateY}
            scale={slideStates[index].scale}
            contentTranslateY={slideStates[index].contentTranslateY}
            contentOpacity={slideStates[index].contentOpacity}
            zIndex={slideStates[index].zIndex}
            isActive={slideStates[index].isActive}
          />
        ))}
      </div>
    </section>
  );
}
