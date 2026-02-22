# Alarko Enerji - Yenilenebilir Enerji Yatırım Platformu

## Proje Tanımı
RES ve GES projelerine yatırım yapma platformu. Yatırımcılar ve admin için ayrı paneller.

## Teknoloji
- **Frontend:** React 18.2, TailwindCSS, shadcn/ui, recharts
- **Backend:** FastAPI, MongoDB (motor), JWT Auth
- **Entegrasyonlar:** Resend (e-posta), Emergent Google Auth (yapılandırılmış)

## Tamamlanan Özellikler

### Auth & Giriş
- [x] Yatırımcı girişi (TC Kimlik + şifre) - `/login`
- [x] Admin girişi (e-posta + şifre) - `/admin/login`
- [x] Kayıt kaldırıldı (admin oluşturur)
- [x] JWT tabanlı kimlik doğrulama

### Yatırımcı Paneli
- [x] Dashboard - portföy özeti, grafikler (recharts), USD getiri
- [x] Proje listesi ve detay sayfaları
- [x] Talep bazlı alım/satım sistemi (kısmi hisse satışı dahil)
- [x] Para yatırma/çekme talep sistemi
- [x] KYC belge yükleme
- [x] Bildirimler sayfası
- [x] Hesap/Profil yönetimi, şifre değiştirme

### Admin Paneli
- [x] Genel Bakış (istatistikler)
- [x] Kullanıcı yönetimi (oluşturma, düzenleme, bakiye)
- [x] Hisse Yönetimi - TL karşılıklı pop-up'larla hisse ekleme/silme
- [x] Alım/Satım talep onaylama
- [x] KYC belge inceleme ve onaylama
- [x] İşlem (para yatırma/çekme) onaylama
- [x] E-posta bildirimleri (Resend)

### UI/UX & Türkçe
- [x] Logo değişikliği (alarko-logo.png) - Navbar + Footer
- [x] Tüm sitede Türkçe özel karakter düzeltmeleri (ı, İ, ş, Ş, ç, Ç, ğ, Ğ, ö, Ö, ü, Ü)
- [x] Footer'dan statik sayfalar: Hakkımızda, Ekibimiz, Kariyer, Basında Biz, Risk Bilgilendirme, Kullanım Şartları, KVKK
- [x] Gizlilik Politikası pop-up (Footer'dan açılır)
- [x] Admin Portföy Yönetimi UI/UX iyileştirmesi (TL karşılıkları gösterilir)
- [x] React 18.2 downgrade

### Dokümantasyon
- [x] TECHNICAL_DOCUMENTATION.md
- [x] DEPLOYMENT_GUIDE.md

## Bekleyen Görevler

### P1 - Yatırımcı Dashboard Grafikleri
- Portföy dağılımı pie chart (tamamlandı)
- Maliyet & getiri bar chart (tamamlandı)

### P2 - Backend Refactoring
- server.py dosyasını routes, models, services olarak böl

## Test Bilgileri
- **Admin:** admin@alarkoenerji.com / admin123
- **Yatırımcı:** TC 12345678901 / sifre123

## API Endpoints
- `/api/auth/login-investor` - Yatırımcı girişi
- `/api/auth/login` - Admin girişi
- `/api/admin/create-user` - Kullanıcı oluştur
- `/api/admin/investor-overview` - Yatırımcı portföy özeti
- `/api/admin/portfolios/add` - Hisse ekle
- `/api/admin/portfolios/{id}` - Hisse sil
- `/api/admin/trade-requests` - Alım/satım talepleri
- `/api/portfolio` - Portföy bilgisi
- `/api/portfolio/invest` - Yatırım talebi
- `/api/portfolio/sell` - Satım talebi
- `/api/transactions` - İşlem listesi
- `/api/projects` - Proje listesi
