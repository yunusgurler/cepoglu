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
          <article className="contact-card span-5 office-card">
            <h2>Merkez Ofis</h2>
            <p>
              İçerenköy Mah. Karslı Ahmet Cad. Küçükbakkalköy Yolu Sk. Hicret Apt. No:76/2
              Ataşehir / İstanbul
            </p>
            <p>Telefon: 0216 572 54 53</p>
            <p>E-posta: info@cepoglu.com</p>
          </article>

          <article className="contact-card span-7 map-card">
            <iframe
              className="contact-map"
              title="Çepoğlu Yapı konum haritası"
              src="https://www.google.com/maps?q=%C4%B0%C3%A7erenk%C3%B6y%20Mah.%20Karsl%C4%B1%20Ahmet%20Cad.%20K%C3%BC%C3%A7%C3%BCkbakkalk%C3%B6y%20Yolu%20Sk.%20Hicret%20Apt.%20No%3A76%2F2%20Ata%C5%9Fehir%20%C4%B0stanbul&z=16&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </article>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
