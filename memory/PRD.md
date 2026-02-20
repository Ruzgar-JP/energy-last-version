# Alarko Enerji - Yenilenebilir Enerji Yatirim Platformu PRD

## Problem Statement
RES ve GES projelerine yatirim platformu. Turkce, icerik dolu web sitesi.

## Architecture
- Backend: FastAPI + MongoDB (Motor) | Frontend: React + TailwindCSS + shadcn/ui
- Auth: JWT + Google OAuth (Emergent) | External API: open.er-api.com (USD/TRY)

## Investment System
- 1 Hisse = 25.000 TL | Min: 1 hisse
- 1-4 hisse: %7/ay TL | 5-9: %7/ay + USD | 10+: %8/ay + USD
- Kismi satis destekleniyor (ornegin 3 hisseden 1 tanesini sat)

## Implemented Features (Feb 2026)
- [x] Hero video carousel (4 video, 8s fade), Poppins font
- [x] Footer with solar panel bg + gradient
- [x] Share-based investment with live USD rate
- [x] Auth: register, login (JWT + Google), password change
- [x] KYC verification, notification system
- [x] Dashboard with portfolio PieChart + BarChart
- [x] Dashboard: USD bazli getiri gosterimi (aylik/yillik TL + USD)
- [x] Dashboard: Kismi hisse satisi (adet sec, onizleme, onay/iptal)
- [x] Withdrawal with bank selection + custom IBAN + admin approval
- [x] Deposit with bank selection + admin approval
- [x] Account page (profile + password change)
- [x] Admin panel (users, KYC, banks, transactions, portfolios)
- [x] Admin edit user info (name, email, phone, password)
- [x] Admin transactions page shows withdrawal bank/IBAN details
- [x] "Panel" -> "Islemlerim" yeniden adlandirma (tum alanlarda)

## Key API Endpoints
- GET /api/portfolio - Includes usd_rate, total_monthly_return_usd, per-investment USD fields
- POST /api/portfolio/sell - Accepts {portfolio_id, shares} for partial/full sell
- PUT /api/admin/users/{user_id}/info - Admin edit name, email, phone, password
- POST /api/transactions/withdraw - Withdrawal with bank selection or manual IBAN
- GET /api/banks, POST /api/transactions, POST /api/portfolio/invest, GET /api/usd-rate

## Backlog
P1: Self-edit profile, email notifications, PDF export, admin project CRUD
P2: 2FA, project docs viewer, referral program, backend refactoring (split server.py)

## Admin: admin@alarkoenerji.com / admin123
