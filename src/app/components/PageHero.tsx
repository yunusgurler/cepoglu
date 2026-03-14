type PageHeroProps = {
  eyebrow: string;
  title: string;
  summary: string;
  imageClass?: string;
  imagePath?: string;
  videoPath?: string;
};

export default function PageHero({ eyebrow, title, summary, imageClass, imagePath, videoPath }: PageHeroProps) {
  const className = ["page-hero", imageClass].filter(Boolean).join(" ");

  return (
    <section className={className} style={imagePath ? { backgroundImage: `url('${imagePath}')` } : undefined}>
      {videoPath ? (
        <video className="page-hero-video" autoPlay muted loop playsInline preload="metadata">
          <source src={videoPath} type="video/mp4" />
        </video>
      ) : null}
      <div className="page-hero-overlay" />
      <div className="page-hero-content">
        <p className="hero-eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{summary}</p>
      </div>
    </section>
  );
}
