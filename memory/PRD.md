# Alarko Enerji - Yenilenebilir Enerji Yatirim Platformu PRD

## Problem Statement
Profesyonel ve kurumsal yatirimcilara yonelik RES (Ruzgar Enerjisi Santrali) ve GES (Gunes Enerjisi Santrali) projelerine yatirim platformu. Turkce, goze hos gelen, icerik dolu bir web sitesi.

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
- Para yatirma (banka IBAN gosterimi) ve cekme (admin onayiyla)
- Bildirim sistemi (site ici)
- Hesabim sayfasi (profil bilgileri + sifre degistirme)
- Admin paneli (ayri URL, ayri layout)
  - Kullanici yonetimi, bilgi duzenleme ve bakiye islemleri
  - KYC onaylama/reddetme
  - Banka ekleme/duzenleme/silme
  - Portfolyo goruntuleme
  - Islem (deposit/withdrawal) yonetimi ve onaylama

## What's Been Implemented (Feb 2026)
- [x] Full landing page (hero, steps, projects, plans, calculator, benefits, testimonials, FAQ, CTA, footer)
- [x] User auth (email/password + Google OAuth)
- [x] KYC verification (file upload + admin review + notifications)
- [x] Project listing with GES/RES filtering
- [x] Project detail with invest dialog
- [x] Portfolio dashboard with charts (PieChart + BarChart via recharts)
- [x] Tiered investment returns (5K=7%, 10K=8%, 20K+=10%)
- [x] Return calculator on landing page
- [x] "Nasil Calisir" detailed section with 4 steps
- [x] Deposit with bank IBAN display
- [x] Withdrawal with admin approval flow (balance NOT deducted until approval)
- [x] Notification system (bell icon + list)
- [x] Account page (Hesabim) with profile info and password change
- [x] Admin panel with 6 sub-pages (dashboard, users, KYC, banks, portfolios, transactions)
- [x] Admin can edit user info (name, email, phone)
- [x] Admin email changeable via user edit
- [x] Seed data (admin user, 4 projects, 4 banks)
- [x] Responsive design
- [x] Full Turkish localization with Sora font

## Prioritized Backlog
### P0 (Critical)
- None remaining

### P1 (Important)
- E-posta bildirim entegrasyonu (SendGrid/Resend)
- Profil sayfasi self-edit (kullanici kendi bilgilerini duzenleyebilsin)
- Yatirim gecmisi raporu (PDF export)

### P2 (Nice to Have)
- Iki faktorlu dogrulama (2FA)
- Proje dokumanlari (PDF viewer)
- Mobil uygulama (React Native)
- Admin proje ekleme/duzenleme paneli (frontend)
- Referans programi

## Admin Credentials
- Email: admin@alarkoenerji.com
- Password: admin123

## Tech Stack Details
- Backend: FastAPI, Motor (async MongoDB), bcrypt, PyJWT
- Frontend: React 18, TailwindCSS, shadcn/ui, axios, react-router-dom, recharts
- Fonts: Sora (headings + body)
- Colors: Deep Forest Teal (#0F3935), Emerald (#10B981), Mint (#D1FAE5)

## Key API Endpoints
- /api/auth/{register, login, google-callback, me, change-password}
- /api/projects, /api/projects/{project_id}
- /api/portfolio, /api/portfolio/{invest, sell}
- /api/transactions (create + list)
- /api/banks
- /api/kyc/{upload, status}
- /api/notifications, /api/notifications/{id}/read, /api/notifications/read-all
- /api/admin/{stats, users, kyc, banks, transactions, portfolios}
- /api/admin/users/{user_id}/{balance, role, info}
- /api/admin/transactions/{transaction_id}
- /api/admin/kyc/{kyc_id}/{approve, reject}

## DB Schema
- users: {user_id, email, password_hash, name, phone, role, kyc_status, balance, picture, created_at}
- projects: {project_id, name, type, description, location, capacity, return_rate, total_target, funded_amount, investors_count, image_url, details, status, created_at}
- portfolios: {portfolio_id, user_id, project_id, project_name, project_type, amount, monthly_return, return_rate, purchase_date, status}
- banks: {bank_id, name, iban, account_holder, logo_url, is_active, created_at}
- transactions: {transaction_id, user_id, user_name, type, amount, bank_id, status, created_at}
- kyc_documents: {kyc_id, user_id, user_name, user_email, front_image, back_image, status, submitted_at, reviewed_at}
- notifications: {notification_id, user_id, title, message, type, is_read, created_at}
