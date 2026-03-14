import PageHero from "../components/PageHero";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";

export default function AboutPage() {
  const values = [
    "Müşteri Memnuniyeti",
    "Kaliteden Ödün Vermemek",
    "Dürüstlük",
    "Süreklilik",
    "Hesap Verebilirlik",
    "Karşılıklı Saygı ve Sevgi",
    "Yaratıcılık",
    "Verimlilik",
    "Çağdaşlık",
    "Çevrecilik",
  ];

  return (
    <div id="top" className="site-wrap">
      <SiteHeader />
      <main>
        <PageHero
          eyebrow="Hakkımızda"
          title="30 yılı aşkın birikimle insan merkezli yaşam alanları üretiyoruz"
          summary="ÇEPOĞLU YAPI İNŞAAT, Anonim Şirket statüsüyle kurumsal yapısını güçlendirerek yeni nesil projelerini müşterileriyle buluşturmaya devam etmektedir."
          imageClass="about-cover"
          videoPath="/videos/about-us-hero.mp4"
        />

        <section className="content-grid">
          <article className="block span-8 about-intro">
            <h2>Kurumsal Profil</h2>
            <p>
              30 yılı aşkın süredir inşaat sektöründe faaliyet gösteren
              müessesemiz, <strong>ÇEPOĞLU YAPI İNŞAAT</strong> ismiyle Anonim
              Şirket statüsü kazanmıştır. İnsan merkezli yaşam alanları
              geliştiren firmamız, sahip olduğu bilgi birikimi ve uygulama
              disipliniyle yeni projelerini müşterilerine sunmayı
              sürdürmektedir.
            </p>
          </article>

          <article className="block span-4 about-kpi">
            <p className="about-kpi-label">Kurumsal Güç</p>
            <strong>20+ Yıl </strong>
            <span>Tecrübe</span>
            <p className="about-kpi-note">
              Anonim Şirket statüsüyle güçlenen kurumsal yönetim.
            </p>
          </article>

          <article className="photo-block span-12 about-video-block">
            <video
              className="about-video"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            >
              <source src="/videos/cepoglu-yapi.mp4" type="video/mp4" />
            </video>
          </article>

          <article className="block span-6 about-card">
            <h3>Vizyonumuz</h3>
            <p>
              Yeniliklere açık, ileriyi öngörebilen, farklı kesimlerin
              beklentilerini karşılayacak üretim hedefini ilke edinen; sürekli
              büyümeyi esas alan, tekniği, kalitesi ve hizmet anlayışıyla öne
              çıkan bir marka olmak.
            </p>
          </article>

          <article className="block span-6 about-card">
            <h3>Misyonumuz</h3>
        
              <p>
              Müşteri memnuniyetini esas alarak kaliteli üretim ve yaşanabilir
              çevre sunmak. Yeni inşaat teknolojilerini takip ederek sürekli
              yenilenmek. Yasal yükümlülüklerin tamamını eksiksiz yerine
              getirmek. Her yönüyle şeffaf ve hesap verebilir bir yönetim
              yaklaşımı sürdürmek. Kurum kültürünü güçlendirerek sürdürülebilir gelişimi desteklemek. Proje süreçlerinin her aşamasında çevreyi gözetmek; çevre kirliliğini önlemeye yönelik uygulanabilir tedbirler alarak olumsuz etkileri en düşük seviyede tutmak.
            </p>
          </article>

        {/*   <article className="block span-12 about-values">
            <h3>Değerlerimiz</h3>
            <div className="about-values-grid">
              {values.map((value) => (
                <span key={value}>{value}</span>
              ))}
            </div>
          </article> */}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
