export type ProjectItem = {
  slug: string;
  name: string;
  image: string;
  location: string;
  type: string;
  status: string;
  summary: string;
  details: string[];
};

export const PROJECTS: ProjectItem[] = [
  {
    slug: "inonu-mahallesi-projesi",
    name: "İnönü Mahallesi Projesi",
    image: "/images/projects/İnönü Projesi.jpg",
    location: "Ataşehir / İstanbul",
    type: "Konut",
    status: "Tamamlandı",
    summary:
      "İnönü Mahallesi'ndeki projemiz tamamlanmıştır. Proje, Yeditepe Üniversitesi kapısına 3 dakika mesafede konumlanmaktadır.",
    details: [
      "Adres: İnönü Mahallesi, Ulubatlı Hasan Sokak No:35, Ataşehir",
    ],
  },
  {
    slug: "kucukbakkalkoy-projesi-2",
    name: "2. Küçükbakkalköy Projesi",
    image: "/images/projects/2. Bakkalköy Projesi.jpeg",
    location: "Ataşehir / İstanbul",
    type: "Konut",
    status: "Tamamlandı",
    summary:
      "Küçükbakkalköy'de yer alan ikinci etap projemiz, modern özellikleri ve yaşam odaklı planlamasıyla tamamlanmıştır.",
    details: [
      "Daire tipleri: 2+1 ve 3+1 dubleks.",
      "Proje, tasarım ve işçilik kalitesi odağında yeni nesil bir konut yaklaşımıyla geliştirilmiştir.",
      "Yaşam alanlarında konforu artıran detaylara öncelik verilmiştir.",
      "Bölgeye değer katan proje, yatırım açısından da güçlü bir potansiyel sunmuştur.",
      "Adres: Küçükbakkalköy Mahallesi, Okan Sokak No:2 ve No:4, Ataşehir / İstanbul",
    ],
  },
  {
    slug: "my-hill-residence",
    name: "My Hill Residence",
    image: "/images/projects/My Hill Projesi.jpg",
    location: "Tosmur / Alanya",
    type: "Konut",
    status: "Tamamlandı",
    summary:
      "My Hill Residence, Alanya Tosmur bölgesinde modern yaşam beklentilerine yanıt veren bir proje olarak tamamlanmıştır.",
    details: [
      "Proje, çift blok yerleşimiyle planlanmıştır.",
      "Sosyal donatılar arasında havuz, sauna ve çocuk parkı bulunmaktadır.",
    ],
  },
  {
    slug: "my-dom-residence",
    name: "My Dom Residence",
    image: "/images/projects/My Dom Projesi.jpg",
    location: "Mahmutlar / Alanya",
    type: "Konut",
    status: "Tamamlandı",
    summary:
      "My Dom Residence, Alanya Mahmutlar'da kapsamlı sosyal olanaklara sahip bir yaşam alanı olarak tamamlanmıştır.",
    details: [
      "Projede yüzme havuzu, sauna, fitness salonu, basketbol sahası ve tenis kortu yer almaktadır.",
      "Tasarım ve işçilik kalitesi, yeni nesil konut yaklaşımı doğrultusunda ele alınmıştır.",
      "Bölgeye değer katan proje, sosyal yaşamı destekleyen açık alan kurgusuna sahiptir.",
      "Çocuklar için yüzme havuzu ve oyun alanı planlanmıştır.",
      "Sağlıklı yaşam için modern ekipmanlarla donatılmış spor alanları sunulmuştur.",
    ],
  },
  {
    slug: "edirne-projesi",
    name: "Edirne Projesi",
    image: "/images/projects/Edirne Tower Projesi.jpg",
    location: "Edirne",
    type: "Konut",
    status: "Tamamlandı",
    summary:
      "Edirne Projesi, sosyal donatıları ve geniş yaşam alanlarıyla yeni bir yaşam standardı sunmak üzere tamamlanmıştır.",
    details: [
      "Proje, 3 blokta toplam 120 daireden oluşmaktadır.",
      "140 m² daire planlarıyla ferah bir kullanım hedeflenmiştir.",
      "Konum: Yeni yapılan Devlet Hastanesi'nin karşısı.",
      "Öne çıkan özellikler: Yüzme havuzu, çocuk oyun alanı, tenis kortu, otopark, güvenlik, 20 m² balkon, 3+1 daire tipi.",
    ],
  },
  {
    slug: "kucukbakkalkoy-projesi",
    name: "Küçükbakkalköy Projesi",
    image: "/images/projects/Küçükbakkalköy Projesi.jpg",
    location: "Ataşehir / İstanbul",
    type: "Konut",
    status: "Tamamlandı",
    summary:
      "Küçükbakkalköy Projesi, farklı daire tipleriyle bölgenin gelişen konut ihtiyacına yanıt verecek şekilde tamamlanmıştır.",
    details: [
      "Daire tipleri: 3+1 (125 m²), 5+1 dubleks (180 m²), 4+1 (155 m²).",
      "Adres: Küçükbakkalköy Mahallesi, Fidanlık ve Nur Sokak cepheli No:18, Ataşehir / İstanbul",
    ],
  },
  {
    slug: "kagithane-projesi",
    name: "Kağıthane Projesi",
    image: "/images/projects/Kağıthane Projesi.jpg",
    location: "Kağıthane / İstanbul",
    type: "Konut",
    status: "Tamamlandı",
    summary:
      "Kağıthane Projesi, 2+1, 3+1 ve 4+1 daire seçenekleriyle tamamlanmış bir konut yatırımıdır.",
    details: [
      "Proje, Çağlayan Adliyesi'ne yakın konumuyla öne çıkmaktadır.",
    ],
  },
  {
    slug: "umraniye-projesi",
    name: "Ümraniye Projesi",
    image: "/images/projects/Ümraniye Projesi.jpg",
    location: "Dudullu / Ümraniye / İstanbul",
    type: "Konut",
    status: "Tamamlandı",
    summary:
      "Ümraniye Projesi, Dudullu bölgesinde konum avantajı ve planlama kalitesiyle tamamlanmıştır.",
    details: [
      "Dudullu'daki yeni metro istasyonuna 2 dakika yürüme mesafesindedir.",
      "Adres: Huzur Mahallesi, Gelin Sokak No:23, Dudullu / Ümraniye",
    ],
  },
  {
    slug: "bahcelievler-projesi",
    name: "Bahçelievler Projesi",
    image: "/images/projects/Bahçelievler Projesi.jpg",
    location: "Bahçelievler / İstanbul",
    type: "Konut",
    status: "Tamamlandı",
    summary:
      "Bahçelievler Projesi, 3+1 daire tipiyle geliştirilmiş ve tamamlanmış bir şehir içi konut projesidir.",
    details: [
      "Adres: Şirinevler Mahallesi, Mahmutbey Yolu Caddesi, 11. Sokak No:23",
    ],
  },
  {
    slug: "yenidogan-projesi",
    name: "Yenidoğan Projesi",
    image: "/images/projects/Yenidoğan Projesi.jpg",
    location: "Sancaktepe / İstanbul",
    type: "Konut",
    status: "Tamamlandı",
    summary:
      "Yenidoğan Projesi, 2+1, 3+1 ve 4+1 daire alternatifleriyle tamamlanmış bir konut geliştirme çalışmasıdır.",
    details: [
      "Daire tipleri: 2+1, 3+1, 4+1.",
      "Adres: Yunus Emre Mahallesi / Eyyübi Sokak / Necip Sokak / Yenidoğan / Sancaktepe / İstanbul",
    ],
  },
];

export function getProjectBySlug(slug: string) {
  return PROJECTS.find((project) => project.slug === slug);
}
