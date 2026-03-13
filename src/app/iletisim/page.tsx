import PageHero from "../components/PageHero";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";

export default function ContactPage() {
  return (
    <div id="top" className="site-wrap">
      <SiteHeader />
      <main>
        <PageHero
          eyebrow="İletişim"
          title="Merkez ofis bilgilerimiz"
          summary="Aşağıdaki karttan adres ve iletişim bilgilerimize ulaşabilirsiniz."
          imageClass="contact-cover"
        />

        <section className="content-grid">
          <article className="contact-card span-12 office-card">
            <h2>Merkez Ofis</h2>
            <p>
              İçerenköy Mah. Karslı Ahmet Cad. Küçükbakkalköy Yolu Sk. Hicret Apt. No:76/2
              Ataşehir / İstanbul
            </p>
            <p>Telefon: 0216 572 54 53</p>
            <p>E-posta: info@cepoglu.com</p>
          </article>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
