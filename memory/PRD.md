# Alarko Enerji - Yenilenebilir Enerji Yatirim Platformu PRD

## Problem Statement
RES ve GES projelerine yatirim platformu. Turkce, icerik dolu web sitesi.

## Architecture
- Backend: FastAPI + MongoDB (Motor) | Frontend: React + TailwindCSS + shadcn/ui
- Auth: JWT + Google OAuth (Emergent) | External API: open.er-api.com (USD/TRY)

## Investment System
- 1 Hisse = 25.000 TL | Min: 1 hisse
- 1-4 hisse: %7/ay TL | 5-9: %7/ay + USD | 10+: %8/ay + USD

## Implemented Features (Feb 2026)
- [x] Hero video carousel (4 video, 8s fade), Poppins font
- [x] Footer with solar panel bg + gradient
- [x] Share-based investment with live USD rate
- [x] Auth: register, login (JWT + Google), password change
- [x] KYC verification, notification system
- [x] Dashboard with portfolio PieChart + BarChart
- [x] Withdrawal with bank selection + custom IBAN ("Diger Bankalar") + admin approval
- [x] Deposit with bank selection + admin approval
- [x] Account page (profile + password change)
- [x] Admin panel (users, KYC, banks, transactions, portfolios)
- [x] Admin edit user info (name, email, phone, password), mobile responsive, full Turkish
- [x] Admin transactions page shows withdrawal bank/IBAN details with "Manuel" badge

## Key API Endpoints
- PUT /api/admin/users/{user_id}/info - Admin edit user name, email, phone, password
- POST /api/transactions/withdraw - Withdrawal with bank_id OR manual iban/account_holder
- GET /api/banks - List system banks
- POST /api/transactions - Deposit flow
- POST /api/portfolio/invest - Share-based investment
- GET /api/usd-rate - Live USD/TRY rate

## Backlog
P1: Self-edit profile, email notifications, PDF export, admin project CRUD
P2: 2FA, project docs viewer, referral program, backend refactoring (split server.py)

## Admin: admin@alarkoenerji.com / admin123
