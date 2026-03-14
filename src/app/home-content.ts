export type HomeSlide = {
  title: string;
  subtitle: string;
  kicker: string;
  imageClass: string;
  video?: string;
  typewriter?: boolean;
  ctaHref: string;
  ctaLabel: string;
};

export type HomeStat = {
  value: string;
  label: string;
  detail: string;
  badge: string;
};

export const HOME_SLIDES: HomeSlide[] = [
  {
    kicker: "",
    title: "Güçlü Altyapı, Kaliteli Projeler",
    subtitle:
      "Büyük ölçekli projeleri kalite, güvenlik ve zaman disipliniyle teslim eden güçlü bir yüklenici altyapısı.",
    imageClass: "gallery-hero-main",
    video: "/videos/cover.mp4",
    typewriter: true,
    ctaHref: "/hakkimizda",
    ctaLabel: "Hakkımızda",
  },
  {
    kicker: "Öne Çıkan Proje",
    title: "Loya Homes",
    subtitle: "Çepoğlu imzalı öne çıkan konut projelerinden biri.",
    imageClass: "gallery-project-01",
    ctaHref: "/projeler",
    ctaLabel: "Projeleri Gör",
  },
  {
    kicker: "Öne Çıkan Proje",
    title: "Edirne Tower",
    subtitle: "Yüksek ölçekli kentsel projeler portföyünde yer alan referans uygulama.",
    imageClass: "gallery-project-02",
    ctaHref: "/projeler",
    ctaLabel: "Projeleri Gör",
  },
  {
    kicker: "Öne Çıkan Proje",
    title: "My Hill",
    subtitle: "Modern konut yaklaşımını yansıtan güncel proje örneklerinden biridir.",
    imageClass: "gallery-project-03",
    ctaHref: "/iletisim",
    ctaLabel: "İletişim",
  },
];

export const HOME_STATS: HomeStat[] = [
  {
    value: "30+",
    label: "Yıllık Tecrübe",
    detail: "Uzun dönemli saha yönetimi ve taahhüt süreçlerinde birikim.",
    badge: "Uzun Yıllardır Sizinleyiz",
  },
  {
    value: "30+",
    label: "Tamamlanan Proje",
    detail: "Konut ve ticari projelerde planlı teslim geçmişi.",
    badge: "Zamanında teslim",
  },
  {
    value: "100.000 m²",
    label: "Toplam İnşaat Alanı",
    detail: "Farklı ölçeklerde uygulanan kapsamlı inşaat hacmi.",
    badge: "Geniş portföy",
  },
  {
    value: "%98",
    label: "Müşteri Memnuniyeti",
    detail: "İletişim hızı, kalite ve şeffaf raporlama odaklı iş modeli.",
    badge: "Güven odaklı",
  },
];
