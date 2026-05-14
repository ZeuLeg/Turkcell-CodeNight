# TelcoGuard - Turkcell CodeNight 2026

## 🚀 Proje Hakkında

TelcoGuard, Turkcell Şebeke Operasyon Merkezi (NOC) için geliştirilmiş gerçek zamanlı şebeke izleme ve anomali tespit platformudur. Baz istasyonlarından akan telemetre verilerini simüle eder, işler, anomali kurallarına göre analiz ederek alarmlar üretir ve canlı olarak bir dashboard sistemine aktarır.
<img width="1635" height="884" alt="image" src="https://github.com/user-attachments/assets/4f70d20f-dd61-467a-83ff-52d61cd33769" />


## 🛠 Teknoloji Yığını (Stack)

- **Backend:** Node.js, Express, TypeScript
- **Veritabanı:** PostgreSQL (Drizzle ORM)
- **Simülatör:** Entegre arkaplan servisi (Background processes with Node)
- **Güvenlik:** JWT Tabanlı Rol (NOC, Engineer) yönetimi, Helmet, CORS
- **Test:** Vitest (Integration + Unit)

## 📡 API Uç Noktaları ve Özellikler

CodeNight 2026 gereksinimleri birebir karşılanarak, Auth, Dashboard, Alarmlar ve Simülatör yapıları `api/v1` formatında hazırlanmıştır.

- `GET /api/v1/dashboard/summary`: Anlık sistem özeti (Tüm cihazlar ve alarmlar)
- `GET /api/v1/stations`: Tüm istasyonlar listesi ve harita pinleri.
- `GET /api/v1/stations/:id/metrics`: Zaman serisi analiz grafikleri için geçmiş datalar.
- `PATCH /api/v1/alarms/:id/assign`: Saha mühendisine atama.
- `PATCH /api/v1/alarms/:id/resolve`: Çözüldü olarak işaretleme ve çözüm notu (resolution_note) ekleme.
- `POST /api/v1/simulator/inject-anomaly`: İstenen istasyona belirli süreli arıza ve metrik enjeksiyonu.

## 🧠 Anomali Tespit Algoritması

Sistem gelen metrikleri asenkron işler.

1. **Dinamik Eşik Yöntemi (Treshold-Based):** CPU, Paket Kaybı, Bağlı Kullanıcı gibi metrikler limitleri aşarsa (veya aşağı düşerse) anında Alarm Engine'e tetik gönderilir. DB üzerinden `warning` ve `critical` seviyeleri okunur (Hardcode yoktur).
2. **Korelasyon (Bonus):** Eğer CPU ile birlikte yüksek gecikme(Latency) oluşursa sistem bunu bir DARBOĞAZ (Bottleneck) olarak algılar ve anında `CRITICAL` düzey korelasyonal alarm kapatır.
3. **Akıllı Tekilleştirme (Debounce/Throttle):** Gürültü (Noise) sebebiyle databaselerin şişmesini önlemek için, aynı alarm durumu son 5 dakika içinde açıksa yeni satır eklenmez, sadece mevcut alarmın şiddeti güncellenir.

## ⚙️ Kurulum ve Çalıştırma

\`\`\`bash

# 1. Bağımlılıkları yükleyin

npm install

# 2. Veritabanını ayağa kaldırıp Seed verilerini yükleyin

npm run db:push
npm run db:seed

# 3. Projeyi ayağa kaldırın (Backend ve Simulator beraber)

npm start
\`\`\`
