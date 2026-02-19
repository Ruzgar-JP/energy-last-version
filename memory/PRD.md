# Alarko Enerji - Yenilenebilir Enerji Yatirim Platformu PRD

## Problem Statement
Profesyonel ve kurumsal yatirimcilara yonelik RES ve GES projelerine yatirim platformu. Turkce, goze hos gelen, icerik dolu bir web sitesi.

## Architecture
- **Backend**: FastAPI + MongoDB (Motor async driver)
- **Frontend**: React + TailwindCSS + shadcn/ui
- **Auth**: JWT (email/password) + Google OAuth (Emergent Auth)
- **Database**: MongoDB
- **External API**: open.er-api.com (canli USD/TRY kuru)

## Investment System (Hisse Bazli)
- 1 Hisse = 25.000 TL, Min yatirim: 25.000 TL (1 hisse)
- 1-4 hisse: %7 aylik (TL bazli)
- 5-9 hisse: %7 aylik + dolar kuru uzerinden
- 10+ hisse: %8 aylik + dolar kuru uzerinden

## What's Been Implemented (Feb 2026)
- [x] Hero section with rotating video background (4 videos, 8s intervals, fade transitions)
- [x] Poppins font (replacing Sora) - larger, more readable
- [x] Full landing page with all sections
- [x] Share-based investment system with live USD rate
- [x] Footer with solar panel photo background + gradient
- [x] Login page with solar panel + bouncing GES/RES icons
- [x] Mobile responsive design
- [x] All text ASCII-safe Turkish (no special chars)
- [x] Account page (Hesabim) with password change
- [x] Dashboard with portfolio charts (PieChart + BarChart)
- [x] Withdrawal with admin approval flow
- [x] Admin panel with user edit, KYC, banks, transactions, portfolios
- [x] KYC verification, notification system
- [x] Project listing with GES/RES filtering

## Prioritized Backlog
### P1
- Profil self-edit, E-posta bildirim, PDF export, Admin proje ekleme

### P2
- 2FA, Proje dokumanlari, Referans programi, Mobil uygulama

## Admin: admin@alarkoenerji.com / admin123

## Key Files
- /app/backend/server.py - All API endpoints
- /app/frontend/src/pages/LandingPage.js - Landing with video hero
- /app/frontend/src/pages/LoginPage.js - Login with solar panel
- /app/frontend/src/components/Footer.js - Footer with solar panel bg
- /app/frontend/src/pages/DashboardPage.js - Portfolio dashboard
- /app/frontend/src/pages/AccountPage.js - Account/password change
- /app/frontend/public/videos/ - 4 hero background videos
