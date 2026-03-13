import PageHero from "../components/PageHero";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";

const clients = [
  "AREL HOLDING",
  "NOVA RETAIL",
  "MARMARA LOGISTICS",
  "YURTBAY ENDÜSTRİ",
  "LOTUS GAYRİMENKUL",
  "DENİZEL ENERJİ",
];

export default function ReferencesPage() {
  return (
    <div id="top" className="site-wrap">
      <SiteHeader />
      <main>
        <PageHero
          eyebrow="Referanslar"
          title="Uzun dönemli iş ortaklıkları ile büyüyen bir proje ekosistemi"
          summary="Teslim kalitesi, bütçe disiplini ve iletişim hızı sayesinde farklı sektörlerde güçlü referans ağı oluşturuyoruz."
          imageClass="references-cover"
        />

        <section className="content-grid">
          <article className="block span-8">
            <h2>Birlikte Çalıştığımız Kurumlar</h2>
            <div className="logo-wall">
              {clients.map((client) => (
                <div key={client}>{client}</div>
              ))}
            </div>
          </article>

          <article className="quote-block span-4">
            <strong>
              “Çepoğlu ekibi bütçe disiplini, kalite standardı ve iletişim hızında beklentimizi
              aştı.”
            </strong>
            <p>Operasyon Direktörü, Arel Holding</p>
          </article>

          <article className="photo-block span-12 references-cover" />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
