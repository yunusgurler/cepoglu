"use client";

import { useEffect, useRef, useState } from "react";
import { HOME_STATS } from "../home-content";

export default function HomeStatsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="home-stats-wrap">
      <section className={`section-shell stats-intro ${isVisible ? "is-visible" : ""}`}>
        <p>Çepoğlu Sayılarla</p>
        <h2>Ölçek, deneyim ve teslim gücümüz</h2>
        <span>Her projede ölçülebilir performans, net planlama ve güvenilir uygulama.</span>
      </section>

      <section className={`section-shell stats-strip ${isVisible ? "is-visible" : ""}`}>
        {HOME_STATS.map((stat, index) => (
          <article
            key={stat.label}
            className="stat-card"
            style={{ transitionDelay: `${120 + index * 90}ms` }}
          >
            <strong>{stat.value}</strong>
            <span className="stat-label">{stat.label}</span>
            <p>{stat.detail}</p>
            <em>{stat.badge}</em>
          </article>
        ))}
      </section>
    </section>
  );
}
