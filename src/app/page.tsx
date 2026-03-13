import PinnedHeroGallery from "./components/PinnedHeroGallery";
import HomeStatsSection from "./components/HomeStatsSection";
import SiteFooter from "./components/SiteFooter";
import SiteHeader from "./components/SiteHeader";

export default function Home() {
  return (
    <div id="top" className="site-wrap">
      <SiteHeader />

      <main>
        <PinnedHeroGallery />
        <HomeStatsSection />
      </main>

      <SiteFooter />
    </div>
  );
}
