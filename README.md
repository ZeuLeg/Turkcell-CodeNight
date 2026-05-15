# TelcoGuard - Turkcell CodeNight 2026

## 🚀 Proje Hakkında
**TelcoGuard | Real-Time NOC Monitoring & Anomaly Detection**
TelcoGuard, Turkcell Şebeke Operasyon Merkezi (NOC) için geliştirilmiş, yüksek ölçekli ve gerçek zamanlı bir şebeke izleme platformudur. Sistem, binlerce baz istasyonundan akan telemetre verilerini (CPU, RAM, Sinyal Gücü, Paket Kaybı vb.) simüle eder, işler ve akıllı algoritmalarla şebeke sağlığını proaktif olarak korur.

### Neden Önemli? (İş Değeri ve Vizyon)
Telekomünikasyon ağlarında (özellikle 5G ve yoğun LTE altyapılarında) yaşanacak birkaç dakikalık bir donanım dar boğazı veya kesinti, binlerce abonenin mağdur olmasına ve ciddi hizmet kalitesi (SLA) ihlallerine yol açar. TelcoGuard, arızaları olduktan sonra reaktif bir şekilde çözmek yerine, metriklerdeki sinsi değişimleri (örneğin eşzamanlı artan gecikme ve CPU) korelasyonla analiz ederek kriz büyümeden önce öngörmeyi amaçlar. Bu proaktif yaklaşım, NOC (Network Operations Center) ekiplerinin arıza çözme süresini (MTTR - Mean Time to Resolution) minimize eder ve saha operasyon maliyetlerini düşürür.

<img width="1624" height="899" alt="image" src="https://github.com/user-attachments/assets/f4c1abf5-e46a-440f-b52c-e0085c4376e1" />

## 🛠 Teknoloji Yığını (Stack)

- **Frontend:** React 19, Vite, Tailwind CSS, Zustand, Recharts, React-Leaflet
- **Backend:** Node.js, Express, TypeScript
- **Veritabanı:** PostgreSQL (Drizzle ORM)
- **Simülatör:** Entegre arkaplan servisi (Background processes with Node)
- **Güvenlik:** JWT Tabanlı Rol (NOC, Engineer) yönetimi, Helmet, CORS
- **Test:** Vitest (Integration + Unit)

### 🏗 Mimari Diyagram (Architecture Diagram)

```mermaid
graph TD
subgraph Veri Üretimi
Sim[Simülatör Servisi\nNode.js]
end

subgraph Çekirdek Sistem
API[Backend API\nExpress.js + TypeScript]
Engine[Anomali Tespit Motoru\nAsenkron Servis]
DB[(PostgreSQL\nDrizzle ORM)]
end

subgraph Kullanıcı Etkileşimi
UI[Frontend Dashboard\nReact 19 + Zustand]
end

Sim -->|Gerçek Zamanlı Telemetri\n(CPU, RAM, Gecikme)| API
API -->|Veri Kaydı & Okuma| DB
DB -.->|Dinamik Eşik Kuralları| Engine
API -->|Tetikleme (Fire-and-Forget)| Engine
UI <-->|REST API & JWT Auth\nDashboard Verisi| API
Engine -->|Kritik Alarm Üretimi| DB
```

## ⚙️ Temel Modüller ve Özellikler
Sistem, telekomünikasyon operasyonlarının uçtan uca yönetilebilmesi için dört ana modül üzerine inşa edilmiştir:

**1. Kimlik ve Yetki Yönetimi (Authentication & RBAC)**
Uygulama güvenliği ve veri gizliliği en üst düzeyde tutulmuştur.
- **Giriş ve Kayıt:** E-posta + şifre veya GSM + OTP simülasyonu üzerinden güvenli erişim.
- **Güvenlik Katmanı:** Tüm API ve istemci süreçlerinde JWT (JSON Web Token) tabanlı kimlik doğrulama.
- **Rol Bazlı Erişim (RBAC):** Sistemde NOC Operatörü, Saha Mühendisi, Şebeke Yöneticisi ve Admin olmak üzere farklı yetki seviyeleri bulunur.
- **Dinamik Arayüz:** Kullanıcının rolüne göre menüler, aksiyon butonları ve dashboard görünümleri otomatik olarak şekillenir.

<img width="549" height="901" alt="image" src="https://github.com/user-attachments/assets/766b489c-67bf-4d94-9b42-b8f91c982243" />

**2. Ana Kontrol Paneli (Dashboard)**
Şebekenin genel anlık durumunun "kuşbakışı" izlendiği operasyon merkezidir.
- **Canlı Harita Entegrasyonu:** React-Leaflet kullanılarak baz istasyonlarının coğrafi dağılımı harita üzerinde gösterilir. Sorunlu istasyonlar kırmızı, sağlıklı olanlar yeşil pinlerle vurgulanır.
- **Özet Metrikler:** Toplam istasyon sayısı, aktif kritik alarm sayısı ve genel şebeke sağlığı (health score) anlık olarak hesaplanıp sunulur.
- **Hızlı Aksiyon:** Son oluşan alarmların canlı akışı (feed) bu ekranda listelenir, operatörün anında müdahale etmesine olanak tanır.

<img width="1592" height="867" alt="image" src="https://github.com/user-attachments/assets/e995da66-1d01-431a-a952-46ea7ff1b904" />

**3. İstasyon Yönetimi ve Metrik İzleme**
Ağdaki her bir düğümün (node) mikroskobik düzeyde analiz edildiği bölümdür.
- **Envanter Listesi:** Tüm baz istasyonları bölgesel bazda filtrelenebilir ve listelenebilir.
- **Canlı Telemetri:** Seçili bir baz istasyonuna ait CPU Kullanımı (%), Bellek (%), Paket Kaybı (%), Gecikme (ms) ve Sinyal Gücü (dBm) verileri son 20 ölçümü kapsayan gerçek zamanlı zaman serisi grafikleri (Recharts) ile görselleştirilir.
- **Manuel Anomali Enjeksiyonu:** Test ve simülasyon süreçleri için istenen istasyona arayüz üzerinden yapay bir metrik sıçraması (spike) gönderilebilir.

<img width="1582" height="588" alt="image" src="https://github.com/user-attachments/assets/9a78f988-c2d0-4bf7-93bc-1a6ac1246a32" />

**4. Alarm ve Olay Yönetimi (Incident Management)**
Anomali tespit motorunun ürettiği uyarıların yönetildiği operasyonel iş akışıdır.
- **Durum Takibi:** Alarmlar; Açık (Open), İnceleniyor (In Progress) ve Çözüldü (Resolved) statülerinde takip edilir.
- **Atama Süreci:** NOC operatörleri, kritik bir alarmı ilgili bölgedeki bir "Saha Mühendisine" (Field Engineer) sistem üzerinden atayabilir.
- **Çözüm Raporlama:** Saha mühendisi sorunu giderdiğinde, sisteme bir çözüm notu (resolution note) girerek alarmı kapatır, böylece gelecekteki arızalar için bir bilgi bankası (knowledge base) oluşur.

<img width="1623" height="726" alt="image" src="https://github.com/user-attachments/assets/9cdc9182-2af8-4fec-a02d-42991d2591c2" />

**5. Bölge Özeti (Regional Summary)**
Türkiye genelindeki şebeke sağlığının coğrafi bölgelere göre gruplandırılarak izlendiği üst düzey izleme modülüdür.
- **Bölgesel Sağlık Skoru:** Marmara, Ege ve İç Anadolu gibi temel bölgelerin anlık ağ sağlığı, yüzdelik dilimler ve trend değişimleriyle (artış/azalış) birlikte takip edilir.
- **İstasyon Durumları:** Her bölgenin altında yer alan baz istasyonlarının (NR_5G, LTE) çalışma durumları ve anlık olarak taşıdıkları kritik/uyarı seviyesindeki alarmlar detaylıca listelenir.
- **Merkezi Özet:** Ekranın en üst panelinde, tüm şebekeyi kapsayan toplam istasyon, aktif alarm, kritik alarm ve çevrimdışı cihaz sayıları konsolide bir şekilde gösterilir.

<img width="1612" height="900" alt="image" src="https://github.com/user-attachments/assets/7de585e6-1acb-4af9-b325-eb0dcd8ad54d" />

**6. Simülatör Yönetimi (Simulator Control)**
Ağdaki istasyon veri akışını simüle etmek ve anomali tespit algoritmalarını test etmek için geliştirilmiş manuel kontrol ortamıdır.
- **Manuel Anomali Tetikleme:** Geliştiriciler veya test mühendisleri, seçtikleri belirli bir istasyona (örneğin BSC-001) belirlenen süre boyunca (örn. 60 saniye) "CPU Spike" gibi spesifik darboğazlar enjekte edebilir.
- **Simülatör Kontrolü:** Şebekeyi besleyen arka plan telemetri veri akışı bu panel üzerinden tek tuşla başlatılabilir veya durdurulabilir.
- **Aktif Anomaliler:** Manuel olarak sisteme enjekte edilen ve o an aktif olan yapay ağ hataları canlı olarak izlenip sistemin tepkisi ölçülebilir.

<img width="1611" height="694" alt="image" src="https://github.com/user-attachments/assets/ef45d8d1-990f-4a99-8a9d-f378db9bd932" />

---

## 📡 API Uç Noktaları ve Özellikler

CodeNight 2026 gereksinimleri birebir karşılanarak, Auth, Dashboard, Alarmlar ve Simülatör yapıları `api/v1` formatında hazırlanmıştır.

- `GET /api/v1/dashboard/summary`: Anlık sistem özeti (Tüm cihazlar ve alarmlar)
- `GET /api/v1/stations`: Tüm istasyonlar listesi ve harita pinleri.
- `GET /api/v1/stations/:id/metrics`: Zaman serisi analiz grafikleri için geçmiş datalar.
- `PATCH /api/v1/alarms/:id/assign`: Saha mühendisine atama.
- `PATCH /api/v1/alarms/:id/resolve`: Çözüldü olarak işaretleme ve çözüm notu (resolution_note) ekleme.
- `POST /api/v1/simulator/inject-anomaly`: İstenen istasyona belirli süreli arıza ve metrik enjeksiyonu.

## 🧠 Anomali Tespit Algoritması
Sistem, simülatörden gelen gerçek zamanlı metrikleri asenkron ve bloklamayan (non-blocking) bir mimariyle analiz eder. Tespit motorumuz, vaka gereksinimlerine uygun olarak Dinamik Eşik Yöntemi ve Çoklu Metrik Korelasyonu olmak üzere iki temel prensibe dayanır.

### 1. Hangi Yöntem Kullanıldı?
**Temel Yöntem:** Yön Bazlı (Above/Below) Dinamik Eşik (Threshold) Kontrolü.
**Gelişmiş Yöntem (Bonus):** Çapraz Metrik Korelasyon Analizi (CPU + Latency).
**Filtreleme Yöntemi:** Zaman Pencereli Tekilleştirme (5-Minute Throttle).

### 2. Neden Bu Yöntemler Seçildi?
**Neden Dinamik Eşik?** Telekomünikasyon ve şebeke altyapılarında (CPU limitleri, sinyal dBm sınırları) donanım ve kapasite toleransları genellikle kesin ve nettir. Z-Score veya Hareketli Ortalama (Moving Average) gibi istatistiksel sapma yöntemleri yerine, ağın çökme noktalarını belirten kesin eşik değerlerinin kullanılması, NOC operatörleri için daha net ve aksiyon alınabilir alarmlar üretir. Eşiklerin hard-coded olmak yerine veritabanından okunması, şebeke yöneticilerine sistemi yeniden başlatmadan kural değiştirme esnekliği sağlar.

**Neden Korelasyon?** Şebeke sorunları genellikle zincirleme etki yaratır. Tek başına yüksek bir CPU kullanımı her zaman kritik bir kesinti anlamına gelmeyebilir, ancak bu durum gecikmeye (latency) de yansıyorsa ortada kesin bir darboğaz var demektir. Korelasyon, hatalı pozitifleri (false-positive) azaltmak ve kök nedene (root-cause) inmek için tercih edilmiştir.

### 3. Nasıl Çalışıyor?
Algoritma her metrik akışında şu adımları izler:

- **Asenkron Tetikleme (Fire-and-Forget):** Simülatörden metrik endpoint'ine düşen telemetri verisi veritabanına kaydedildiği an, API yanıt süresini (I/O) bloklamamak adına anomali motoru controller üzerinden asenkron olarak (await beklenmeden) tetiklenir.
- **Kural Eşleştirme ve Yön Kontrolü:** Veritabanından o an aktif olan eşik kuralları çekilir. Sisteme gelen değer, eşiğin türüne göre (above: üst sınır aşımı veya below: alt sınır ihlali) değerlendirilir. Örneğin; paket kaybı için üst sınır (above), sinyal kalitesi (RSSI) için alt sınır (below) kontrolü yapılır. İhlal durumunda WARNING veya CRITICAL seviyesi belirlenir.
- **Akıllı Tekilleştirme (Debounce & Upgrade):** Gürültülü (noisy) verilerin veritabanını aynı alarmlarla boğmasını önlemek için 5 dakika kuralı uygulanır. Tespit edilen bir anomali için, son 5 dakika içinde aynı istasyona ait AÇIK (OPEN) statüde bir alarm olup olmadığı kontrol edilir:
  - Mevcut alarm yoksa sisteme yeni alarm kaydedilir.
  - Mevcut bir alarm varsa ve yeni gelen verinin şiddeti daha kötüyse (Örn: Uyarı seviyesinden Kritik seviyeye geçiş), sistem gereksiz yere yeni alarm açmaz; mevcut alarmın durumunu CRITICAL olarak günceller ve kötüleştiği bilgisini düşer.
- **Korelasyon Motoru (Darboğaz Tespiti):** Döngü sonunda, sistem aynı zaman diliminde hem CPU Kullanımı hem de Gecikme (Latency) metriklerinde eş zamanlı anomali tespit ederse, bireysel alarmlardan bağımsız olarak `correlation_bottleneck` adında özel ve CRITICAL seviyede bir darboğaz alarmı üretir.

## 📊 Anlık Ağ Metrikleri Detay Görünümü
Aşağıdaki görsel, seçili bir baz istasyonuna (veya genel şebeke ortalamasına) ait 6 kritik telemetre verisinin son 20 ölçümünü kapsayan gerçek zamanlı (real-time) zaman serisi grafiklerini göstermektedir. Bu panel, NOC operatörlerinin şebeke sağlığını mikroskobik düzeyde izlemesine olanak tanır.

**İzlenen Metrikler:** CPU Kullanımı (%), Bellek (RAM) (%), Paket Kaybı (%), Gecikme (Latency) (ms), Sinyal Gücü (RSSI) (dBm) ve Bağlı Kullanıcı Sayısı.

<img width="1584" height="580" alt="image" src="https://github.com/user-attachments/assets/73f292da-73db-456b-af7b-e208c3838386" />

---

## ⚙️ Kurulum ve Çalıştırma (Geliştirme Ortamı)
Projeyi yerel ortamınızda (localhost) çalıştırmak için makinenizde Node.js ve PostgreSQL veritabanını izole bir şekilde ayağa kaldırmak için Docker kurulu olmalıdır.

Projeyi sorunsuz bir şekilde ayağa kaldırmak için 4 farklı terminal penceresi açmanız gerekmektedir. İşlemleri aşağıdaki sırayla uygulayın:

**Terminal 1 — Veritabanı (PostgreSQL)**
```bash
docker compose up -d
```

**Terminal 2 — Backend (Port: 3000)**
```bash
npm run dev:backend
```

**Terminal 3 — Simülatör (Port: 3001)**
```bash
npm run dev:simulator
```

**Terminal 4 — Frontend (Port: 5173)**
```bash
cd frontend
npm run dev
```

> **Not:** Eğer port çakışması yaşarsanız (örneğin 3001 portu doluysa), PowerShell üzerinden ilgili portu boşaltmak için şu komutu kullanabilirsiniz:
> ```powershell
> Get-NetTCPConnection -LocalPort 3001 -State Listen | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force }
> ```

## 🔑 Test Kullanıcı Hesapları (Giriş İçin)

Projeyi test ederken aşağıdaki rol bazlı kullanıcı hesaplarını kullanabilirsiniz:

* **NOC Operatörü:**
  * E-posta: `noc@telcoguard.com`
  * Şifre: `admin123`
* **Saha Mühendisi:**
  * E-posta: `saha@telcoguard.com`
  * Şifre: `saha123`