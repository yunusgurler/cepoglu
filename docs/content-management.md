# Content Management

Bu projede proje içerikleri tek bir dosyadan yönetilir:

- `src/content/projects.json`

Her proje kaydı şu alanları içerir:

- `slug`: detay sayfası URL anahtarı
- `name`: proje adı
- `image`: proje kartı ve detay hero görseli
- `location`: konum bilgisi
- `type`: proje tipi
- `status`: ör. `Tamamlandı`, `Devam Ediyor`, `Yeni Proje`
- `summary`: kısa açıklama
- `details`: detay sayfasında listelenen maddeler

Görsel yerleşimi:

- Kapak görseli: `public/images/projects/`
- Galeri görselleri: `public/images/projects/gallery/<slug>/`

Yeni proje ekleme akışı:

1. Kapak görselini `public/images/projects/` altına koy.
2. Galeri görsellerini `public/images/projects/gallery/<slug>/` altına sırayla ekle.
3. `src/content/projects.json` içine yeni proje nesnesini ekle.
4. Siteyi yeniden build/deploy et.

Not:

- Sadece client-side parola kontrolü gerçek güvenlik sağlamaz. Tarayıcıya gönderilen tüm kod ve sabitler kullanıcı tarafından görülebilir.
- Gerçek upload ve kalıcı kayıt için en azından server-side bir katman ya da harici içerik servisi gerekir.
