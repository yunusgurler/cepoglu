import Link from "next/link";

const primaryLinks = [
  { href: "/projeler", label: "Projeler" },
  { href: "/hakkimizda", label: "Hakkımızda" },
/*   { href: "/referanslar", label: "Referanslar" },
 */  { href: "/iletisim", label: "İletişim" },
];

/* const secondaryLinks = [
  { href: "/hakkimizda", label: "Sürdürülebilirlik" },
  { href: "/referanslar", label: "Çepoğlu Teknoloji" },
  { href: "/projeler", label: "Çepoğlu Tasarım" },
  { href: "/iletisim", label: "Sosyal Sorumluluk" },
]; */

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <Link href="/" className="footer-logo">
          ÇEPOĞLU
        </Link>

        <nav className="footer-primary" aria-label="Alt menü ana bağlantılar">
          {primaryLinks.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

    {/*     <nav className="footer-secondary" aria-label="Alt menü yardımcı bağlantılar">
          {secondaryLinks.map((item) => (
            <Link key={item.label} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav> */}
      </div>

      <div className="footer-bottom">
        <p>© 2026 Çepoğlu. Tüm hakları saklıdır. | Gizlilik Politikası</p>
      {/*   <div className="footer-social" aria-label="Sosyal medya bağlantıları">
          <a href="#" aria-label="LinkedIn">
            in
          </a>
          <a href="#" aria-label="Facebook">
            f
          </a>
          <a href="#" aria-label="X">
            X
          </a>
          <a href="#" aria-label="Instagram">
            ig
          </a>
          <a href="#" aria-label="YouTube">
            yt
          </a>
        </div> */}
      </div>
    </footer>
  );
}
