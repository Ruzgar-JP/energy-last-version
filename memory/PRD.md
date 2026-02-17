# Alarko Enerji - Yenilenebilir Enerji Yatirim Platformu PRD

## Problem Statement
Profesyonel ve kurumsal yatirimcilara yonelik RES (Ruzgar Enerjisi Santrali) ve GES (Gunes Enerjisi Santrali) projelerine yatirim platformu. Aylik %7 getiri. Turk dilinde, goze hos gelen, icerik dolu bir web sitesi.

## Architecture
- **Backend**: FastAPI + MongoDB (Motor async driver)
- **Frontend**: React + TailwindCSS + shadcn/ui
- **Auth**: JWT (email/password) + Google OAuth (Emergent Auth)
- **Database**: MongoDB

## User Personas
1. **Bireysel Yatirimci**: Kucuk tutarlarla yenilenebilir enerjiye yatirim yapmak isteyen bireyler
2. **Profesyonel Yatirimci**: Orta olcekli yatirim yapan deneyimli yatirimcilar
3. **Kurumsal Yatirimci**: Buyuk tutarlarla yatirim yapan sirketler ve fonlar
4. **Admin**: Platform yoneticisi - kullanici, banka, KYC, islem yonetimi

## Core Requirements
- Kullanici kayit/giris (email + Google OAuth)
- KYC kimlik dogrulama (belge yukleme, admin onayi)
- Proje listeleme ve detay (GES/RES filtreleme)
- Yatirim yapma ve portfolyo takibi
- Para yatirma (banka IBAN gosterimi) ve cekme
- Bildirim sistemi (site ici)
- Admin paneli (ayri URL, ayri layout)
  - Kullanici yonetimi ve bakiye islemleri
  - KYC onaylama/reddetme
  - Banka ekleme/duzenleme/silme
  - Portfolyo goruntuleme
  - Islem (deposit/withdrawal) yonetimi

## What's Been Implemented (Feb 2026)
- [x] Full landing page (hero, steps, projects, plans, benefits, testimonials, FAQ, CTA, footer)
- [x] User auth (email/password + Google OAuth)
- [x] KYC verification (file upload + admin review + notifications)
- [x] Project listing with GES/RES filtering
- [x] Project detail with invest dialog
- [x] Portfolio dashboard (stats, active investments, sell)
- [x] Deposit with bank IBAN display
- [x] Withdrawal requests
- [x] Notification system (bell icon + list)
- [x] Admin panel with 6 sub-pages (dashboard, users, KYC, banks, portfolios, transactions)
- [x] Seed data (admin user, 4 projects, 4 banks)
- [x] Responsive design

## Prioritized Backlog
### P0 (Critical)
- None remaining

### P1 (Important)
- E-posta bildirim entegrasyonu (SendGrid/Resend)
- Profil sayfasi (kullanici bilgi duzenleme)
- Yatirim gecmisi raporu (PDF export)

### P2 (Nice to Have)
- Iki faktorlu dogrulama (2FA)
- Getiri hesaplama grafikleri (recharts)
- Proje dokumanlari (PDF viewer)
- Mobil uygulama (React Native)
- Admin proje ekleme/duzenleme paneli
- Referans programi

## Admin Credentials
- Email: admin@alarkoenerji.com
- Password: admin123

## Tech Stack Details
- Backend: FastAPI, Motor (async MongoDB), bcrypt, PyJWT
- Frontend: React 18, TailwindCSS, shadcn/ui, axios, react-router-dom
- Fonts: Manrope (headings), Plus Jakarta Sans (body)
- Colors: Deep Forest Teal (#0F3935), Emerald (#10B981), Mint (#D1FAE5)
