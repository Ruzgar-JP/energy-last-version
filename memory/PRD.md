# Alarko Enerji - Yenilenebilir Enerji Yatirim Platformu PRD

## Problem Statement
Profesyonel ve kurumsal yatirimcilara yonelik RES (Ruzgar Enerjisi Santrali) ve GES (Gunes Enerjisi Santrali) projelerine yatirim platformu. Turkce, goze hos gelen, icerik dolu bir web sitesi.

## Architecture
- **Backend**: FastAPI + MongoDB (Motor async driver)
- **Frontend**: React + TailwindCSS + shadcn/ui
- **Auth**: JWT (email/password) + Google OAuth (Emergent Auth)
- **Database**: MongoDB
- **External API**: open.er-api.com (canli USD/TRY kuru)

## Investment System (Hisse Bazli)
- 1 Hisse = 25.000 TL
- Min yatirim: 25.000 TL (1 hisse)
- Kademeli getiri:
  - 1-4 hisse: %7 aylik (TL bazli)
  - 5-9 hisse: %7 aylik + dolar kuru uzerinden
  - 10+ hisse: %8 aylik + dolar kuru uzerinden
- Canli USD/TRY kuru (1 saat cache)

## What's Been Implemented (Feb 2026)
- [x] Full landing page (hero, steps, projects, plans, calculator, benefits, testimonials, FAQ, CTA, footer)
- [x] Share-based investment system (25K TL per share)
- [x] Tiered returns with USD-based calculation for 5+ shares
- [x] Live USD/TRY exchange rate from open.er-api.com
- [x] Return calculator with share slider on landing page
- [x] User auth (email/password + Google OAuth)
- [x] KYC verification (file upload + admin review + notifications)
- [x] Project listing with GES/RES filtering
- [x] Project detail with share-based invest dialog (+/- buttons)
- [x] Portfolio dashboard with charts (PieChart + BarChart via recharts)
- [x] Deposit with bank IBAN display
- [x] Withdrawal with admin approval flow (balance deducted ONLY on admin approval)
- [x] Notification system (bell icon + list)
- [x] Account page (Hesabim) with profile info and password change
- [x] Admin panel with 6 sub-pages (dashboard, users, KYC, banks, portfolios, transactions)
- [x] Admin can edit user info (name, email, phone)
- [x] Login page with solar panel photo background + green gradient + bouncing GES/RES icons
- [x] Full Turkish localization with Sora font
- [x] Responsive design

## Prioritized Backlog
### P1 (Important)
- Profil sayfasi self-edit (kullanici kendi bilgilerini duzenleyebilsin)
- E-posta bildirim entegrasyonu
- Yatirim gecmisi raporu (PDF export)
- Admin proje ekleme/duzenleme (frontend)

### P2 (Nice to Have)
- Iki faktorlu dogrulama (2FA)
- Proje dokumanlari (PDF viewer)
- Referans programi
- Mobil uygulama

## Admin Credentials
- Email: admin@alarkoenerji.com
- Password: admin123

## Tech Stack
- Backend: FastAPI, Motor, bcrypt, PyJWT, requests
- Frontend: React 18, TailwindCSS, shadcn/ui, axios, react-router-dom, recharts
- Fonts: Sora
- Colors: #0F3935 (dark teal), #10B981 (emerald), #D1FAE5 (mint)

## Key API Endpoints
- /api/auth/{register, login, google-callback, me, change-password}
- /api/usd-rate (canli dolar kuru)
- /api/projects, /api/projects/{project_id}
- /api/portfolio, /api/portfolio/{invest, sell}
- /api/transactions, /api/banks
- /api/kyc/{upload, status}
- /api/notifications, /api/notifications/{id}/read, /api/notifications/read-all
- /api/admin/{stats, users, kyc, banks, transactions, portfolios}
- /api/admin/users/{user_id}/{balance, role, info}
- /api/admin/transactions/{transaction_id}

## DB Schema
- users: {user_id, email, password_hash, name, phone, role, kyc_status, balance, picture, created_at}
- projects: {project_id, name, type, description, location, capacity, return_rate, total_target, funded_amount, investors_count, image_url, details, status, created_at}
- portfolios: {portfolio_id, user_id, project_id, project_name, project_type, amount, shares, usd_based, usd_rate_at_purchase, monthly_return, return_rate, purchase_date, status}
- banks: {bank_id, name, iban, account_holder, logo_url, is_active, created_at}
- transactions: {transaction_id, user_id, user_name, type, amount, bank_id, status, created_at}
- kyc_documents: {kyc_id, user_id, user_name, user_email, front_image, back_image, status, submitted_at, reviewed_at}
- notifications: {notification_id, user_id, title, message, type, is_read, created_at}
