"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type MouseEvent, useState } from "react";

const navLinks = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/projeler", label: "Projeler" },
  { href: "/iletisim", label: "İletişim" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);
  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      closeMenu();
    }
  };

  return (
    <header className="top-shell">
      <div className="top-nav">
        <nav className="nav-group nav-left" aria-label="Sol menü">
          {navLinks.slice(0, 2).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname === item.href ? "is-active" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link href="/" className="brand-box" onClick={closeMenu}>
          ÇEPOĞLU YAPI A.Ş.
        </Link>

        <nav className="nav-group nav-right" aria-label="Sağ menü">
          {navLinks.slice(2).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname === item.href ? "is-active" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="menu-button"
          aria-expanded={open}
          aria-label="Menüyü aç"
          onClick={() => setOpen((prev) => !prev)}
        >
          <span />
          <span />
        </button>
      </div>

      <div className={`mobile-panel ${open ? "is-open" : ""}`} onClick={handleBackdropClick}>
        <nav aria-label="Mobil menü">
          {navLinks.map((item) => (
            <Link key={item.href} href={item.href} onClick={closeMenu}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
