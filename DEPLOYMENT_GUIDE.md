# Alarko Enerji - Deployment Rehberi & API Entegrasyonlari

---

## 1. SISTEM GEREKSINIMLERI

| Bilesken | Minimum | Onerilen |
|----------|---------|----------|
| CPU | 1 vCPU | 2 vCPU |
| RAM | 1 GB | 2 GB |
| Disk | 10 GB | 20 GB SSD |
| OS | Ubuntu 20.04+ | Ubuntu 22.04 LTS |
| Node.js | 18.x | 20.x LTS |
| Python | 3.10+ | 3.11+ |
| MongoDB | 6.0+ | 7.0+ |

---

## 2. PROJE YAPISI

```
/app/
├── backend/
│   ├── server.py           # FastAPI ana uygulama
│   ├── requirements.txt    # Python bagimliliklari
│   ├── .env                # Backend ortam degiskenleri
│   └── uploads/            # KYC belgeleri
├── frontend/
│   ├── src/                # React kaynak kodu
│   ├── public/             # Statik dosyalar (videolar dahil)
│   ├── package.json        # Node bagimliliklari
│   └── .env                # Frontend ortam degiskenleri
```

---

## 3. ORTAM DEGISKENLERI (ENV)

### Backend (.env)
```env
# MongoDB Baglantisi (ZORUNLU)
MONGO_URL=mongodb://localhost:27017
DB_NAME=alarko_enerji

# JWT Sifresi (ZORUNLU - guclu bir sifre kullanin)
JWT_SECRET=cok-guclu-rastgele-bir-sifre-buraya-yazin-min-32-karakter

# CORS (frontend domaininizi yazin)
CORS_ORIGINS=https://www.alarkoenerji.com

# E-posta - Resend (OPSIYONEL - asagida detayli aciklama)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
SENDER_EMAIL=bilgi@alarkoenerji.com
```

### Frontend (.env)
```env
# Backend URL (ZORUNLU - domaininizi yazin)
REACT_APP_BACKEND_URL=https://api.alarkoenerji.com
```

---

## 4. ADIM ADIM DEPLOYMENT

### Adim 1: Sunucuyu Hazirlayin

```bash
# Sistem guncellemesi
sudo apt update && sudo apt upgrade -y

# Node.js 20 kurulumu
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Python 3.11 kurulumu
sudo apt install -y python3.11 python3.11-venv python3-pip

# MongoDB 7.0 kurulumu
# https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update && sudo apt install -y mongodb-org
sudo systemctl start mongod && sudo systemctl enable mongod

# Nginx kurulumu
sudo apt install -y nginx
```

### Adim 2: Proje Dosyalarini Yukleyin

```bash
# Proje klasorunu olusturun
sudo mkdir -p /var/www/alarko-enerji
cd /var/www/alarko-enerji

# Dosyalari yukleyin (GitHub, SCP veya FTP ile)
# Ornek: git clone <repo-url> .
# veya: scp -r ./app/* user@sunucu:/var/www/alarko-enerji/
```

### Adim 3: Backend Kurulumu

```bash
cd /var/www/alarko-enerji/backend

# Virtual environment
python3.11 -m venv venv
source venv/bin/activate

# Bagimliliklari yukle
pip install -r requirements.txt

# .env dosyasini duzenle
nano .env
# Yukaridaki degerleri girin

# Test edin
python -c "from server import app; print('Backend OK')"
```

### Adim 4: Frontend Build

```bash
cd /var/www/alarko-enerji/frontend

# .env dosyasini duzenle (REACT_APP_BACKEND_URL degerini girin)
nano .env

# Bagimliliklari yukle ve build alin
npm install --legacy-peer-deps
# veya: yarn install

npm run build
# veya: yarn build

# Build ciktisi: /var/www/alarko-enerji/frontend/build/
```

### Adim 5: Systemd Servisi (Backend)

```bash
sudo nano /etc/systemd/system/alarko-backend.service
```

```ini
[Unit]
Description=Alarko Enerji Backend
After=network.target mongod.service

[Service]
User=www-data
WorkingDirectory=/var/www/alarko-enerji/backend
Environment=PATH=/var/www/alarko-enerji/backend/venv/bin
EnvironmentFile=/var/www/alarko-enerji/backend/.env
ExecStart=/var/www/alarko-enerji/backend/venv/bin/uvicorn server:app --host 0.0.0.0 --port 8001
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl start alarko-backend
sudo systemctl enable alarko-backend
sudo systemctl status alarko-backend
```

### Adim 6: Nginx Konfigurasyonu

```bash
sudo nano /etc/nginx/sites-available/alarko-enerji
```

```nginx
server {
    listen 80;
    server_name alarkoenerji.com www.alarkoenerji.com;

    # Frontend (React build)
    root /var/www/alarko-enerji/frontend/build;
    index index.html;

    # React SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API proxy
    location /api/ {
        proxy_pass http://127.0.0.1:8001/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        client_max_body_size 10M;
    }

    # KYC upload dosyalari
    location /uploads/ {
        alias /var/www/alarko-enerji/backend/uploads/;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/alarko-enerji /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

### Adim 7: SSL Sertifikasi (Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d alarkoenerji.com -d www.alarkoenerji.com
# E-posta adresinizi girin ve sartlari kabul edin
# Otomatik yenileme zaten aktif olacak
```

---

## 5. API ENTEGRASYONLARI

### 5.1 Resend (E-posta Bildirimleri)

**Ne icin kullaniliyor:** Hesap acilisi, para yatirma/cekme onay bildirimleri

**Kurulum:**
1. https://resend.com adresine gidin
2. Ucretsiz hesap olusturun (ayda 3.000 e-posta ucretsiz)
3. Dashboard > API Keys > "Create API Key" tiklayin
4. Olusturulan anahtari kopyalayin

**Kurumsal domain ekleme (onerilen):**
1. Resend Dashboard > Domains > "Add Domain"
2. Domaininizi girin: `alarkoenerji.com`
3. DNS kayitlarini ekleyin (Resend size verecek):
   - SPF kaydı (TXT)
   - DKIM kaydı (TXT)
   - MX kaydı (opsiyonel)
4. "Verify" tiklayin
5. Dogrulama sonrasi `SENDER_EMAIL=bilgi@alarkoenerji.com` kullanabilirsiniz

**Backend .env'e ekleyin:**
```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
SENDER_EMAIL=bilgi@alarkoenerji.com
```

**Fiyatlandirma:**
| Plan | Aylik E-posta | Fiyat |
|------|--------------|-------|
| Free | 3.000 | $0 |
| Pro | 50.000 | $20/ay |
| Enterprise | 100.000+ | Ozel |

---

### 5.2 Exchange Rate API (Doviz Kuru)

**Ne icin kullaniliyor:** Canli USD/TRY kuru (yatirim getiri hesaplari)

**API:** `https://open.er-api.com/v6/latest/USD`

**Ozellikler:**
- Tamamen ucretsiz, API key gerektirmez
- Gunluk guncelleme
- Rate limit: 1500 istek/ay (ucretsiz)
- Backend otomatik olarak kullaniyor, ek kurulum gerektirmez

**Alternatif (yuksek hacim icin):**
- https://exchangeratesapi.io - Ucretsiz plan mevcut
- https://fixer.io - Aylik 100 istek ucretsiz

---

### 5.3 MongoDB

**Ne icin kullaniliyor:** Tum veri depolama (kullanicilar, portfolyolar, islemler)

**Secenekler:**

| Secenek | Fiyat | Ozellik |
|---------|-------|---------|
| Kendi sunucunuz | $0 | Tam kontrol, yedekleme sizde |
| MongoDB Atlas (Free) | $0 | 512 MB, bulut, otomatik yedekleme |
| MongoDB Atlas (M10) | ~$60/ay | 10 GB, production-ready |

**MongoDB Atlas kurulumu (onerilen):**
1. https://cloud.mongodb.com hesap acin
2. "Build a Cluster" > Free Tier (M0) secin
3. Region: Frankfurt (Turkiye'ye yakin)
4. "Connect" > "Connect your application"
5. Connection string'i kopyalayin

**Backend .env'e ekleyin:**
```env
MONGO_URL=mongodb+srv://kullanici:sifre@cluster.xxxxx.mongodb.net/alarko_enerji?retryWrites=true&w=majority
DB_NAME=alarko_enerji
```

---

## 6. GUVENLIK KONTROL LISTESI

```
[x] JWT_SECRET icin en az 32 karakterlik rastgele deger kullanin
[x] CORS_ORIGINS sadece kendi domaininizi icersin (* kullanmayin)
[x] MongoDB'ye disaridan erisimi kapatin (bind_ip: 127.0.0.1)
[x] SSL sertifikasi aktif (HTTPS zorunlu)
[x] Sunucu firewall aktif (sadece 80, 443, 22 portlari acik)
[x] MongoDB Atlas kullaniyorsaniz IP whitelist yapin
[x] Admin sifrelerini degistirin (admin123 kullanmayin!)
[x] .env dosyalarini git'e eklemeyin (.gitignore)
```

**Guclu JWT Secret olusturma:**
```bash
python3 -c "import secrets; print(secrets.token_hex(32))"
```

---

## 7. YEDEKLEME

```bash
# MongoDB yedekleme (cronjob olarak ekleyin)
mongodump --db alarko_enerji --out /backup/$(date +%Y%m%d)

# Otomatik gunluk yedekleme
sudo crontab -e
# Ekleyin:
0 3 * * * mongodump --db alarko_enerji --out /backup/$(date +\%Y\%m\%d) --gzip
```

---

## 8. IZLEME & BAKIM

```bash
# Backend loglarini kontrol edin
sudo journalctl -u alarko-backend -f

# Nginx loglarini kontrol edin
sudo tail -f /var/log/nginx/error.log

# MongoDB durumu
sudo systemctl status mongod

# Disk kullanimi
df -h

# Backend guncelleme
cd /var/www/alarko-enerji/backend
source venv/bin/activate
pip install -r requirements.txt
sudo systemctl restart alarko-backend

# Frontend guncelleme
cd /var/www/alarko-enerji/frontend
npm install --legacy-peer-deps && npm run build
# Nginx otomatik yeni build'i servir eder
```

---

## 9. HIZLI BASLANGIÇ OZETI

| Adim | Ne Yapmali | Nereden |
|------|-----------|---------|
| 1 | Resend API Key al | https://resend.com |
| 2 | MongoDB Atlas olustur (veya local) | https://cloud.mongodb.com |
| 3 | Domain + SSL al | Herhangi bir domain saglayici |
| 4 | VPS/Sunucu al | DigitalOcean, Hetzner, AWS |
| 5 | Bu rehberi takip et | Yukaridaki adimlar |
| 6 | Admin sifrelerini degistir | /admin/login |
| 7 | CORS ve JWT degerlerini guncelle | backend/.env |

---

## 10. VARSAYILAN HESAPLAR

```
Admin Girisi (/admin/login):
  E-posta: admin@alarkoenerji.com
  Sifre:   admin123  ← MUTLAKA DEGISTIRIN!

Test Yatirimci (/login):
  TC Kimlik: 12345678901
  Sifre:     sifre123  ← Test sonrasi silin
```

---

## DESTEK

Sorun yasarsaniz kontrol edin:
1. `sudo systemctl status alarko-backend` - Backend calisiyor mu?
2. `sudo systemctl status mongod` - MongoDB calisiyor mu?
3. `sudo nginx -t` - Nginx konfigurasyonu dogru mu?
4. `sudo journalctl -u alarko-backend -n 50` - Backend hatalari
5. Tarayici Console (F12) - Frontend hatalari
