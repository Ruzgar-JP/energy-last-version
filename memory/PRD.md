# Alarko Enerji - Yenilenebilir Enerji Yatirim Platformu PRD

## Problem Statement
RES ve GES projelerine yatirim platformu. Turkce, profesyonel, kurumsal web uygulamasi.

## Architecture
- Backend: FastAPI + MongoDB (Motor) + Resend (email)
- Frontend: React + TailwindCSS + shadcn/ui + recharts
- Auth: JWT | Investors: TC Kimlik + Sifre | Admin: E-posta + Sifre
- External API: open.er-api.com (USD/TRY)

## Investment System
- 1 Hisse = 25.000 TL | Min: 1 hisse
- 1-4 hisse: %7/ay TL | 5-9: %7/ay + USD | 10+: %8/ay + USD
- Alim/Satim talep bazli (admin onayi gerekli)

## Auth & User Management
- Yatirimci: TC Kimlik + Sifre ile giris (/login)
- Admin: E-posta + Sifre ile giris (/admin/login)
- Kayit: Sadece admin olusturabilir (admin panel)
- Hesap olusturma e-postasi: Giris bilgileri ile

## Implemented Features (Feb 2026)
- [x] Ayri giris sayfalari (yatirimci: /login, admin: /admin/login)
- [x] TC Kimlik bazli giris sistemi
- [x] Admin kullanici olusturma (TC Kimlik zorunlu)
- [x] Admin KYC dogrudan onaylama (belge gerekmez)
- [x] Admin portfolyo yonetimi (hisse ekleme/cikarma)
- [x] Talep bazli alim/satim sistemi (admin onayi)
- [x] Basitlestirilmis para yatirma/cekme (bankalarsiz)
- [x] 1 aylik yatirim cekme uyarisi
- [x] USD bazli getiri gosterimi (dashboard)
- [x] E-posta bildirimleri (hesap acilisi, para islemleri)
- [x] Portfolyo grafikleri (PieChart + BarChart)
- [x] Mobil uyumlu, tam Turkce lokalizasyon
- [x] Hero video carousel, Poppins font, modern UI

## Admin Panel
- Kullanicilar (olusturma, duzenleme, bakiye, TC Kimlik)
- Kimlik Dogrulama (belge inceleme + dogrudan onay)
- Hisse Yonetimi (portfolyo ekleme/silme)
- Islemler (para yatirma/cekme onay/ret)
- Alim/Satim Talepleri (yatirim talepleri onay/ret)

## Key API Endpoints
- POST /api/auth/login-investor (TC Kimlik + sifre)
- POST /api/auth/login (admin email + sifre)
- POST /api/admin/users/create (TC Kimlik ile kullanici olustur)
- POST /api/admin/kyc/approve-user/{user_id}
- POST /api/admin/portfolios/add | DELETE /api/admin/portfolios/{id}
- POST /api/portfolio/invest | POST /api/portfolio/sell (talep olusturur)
- PUT /api/admin/trade-requests/{id} (onayla/reddet)
- GET /api/portfolio/withdrawal-check (1 ay kontrolu)

## Backlog
- P1: Resend API key konfigurasyonu (kurumsal domain)
- P2: 2FA, PDF export, detayli raporlama
- P2: Backend refactoring (server.py bolme)

## Credentials
- Admin: admin@alarkoenerji.com / admin123
- Test Yatirimci: TC 12345678901 / sifre123
