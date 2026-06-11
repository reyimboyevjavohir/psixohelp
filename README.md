# PsixoHelp v4 — O'zbekiston Psixologik Yordam Platformasi

**Stack:** Next.js 15 · TypeScript · Express · PostgreSQL · Prisma · Docker

---

## Rollar tizimi

| Rol | Huquqlar |
|-----|---------|
| `USER` | AI chat, testlar, kayfiyat, psixolog bron |
| `PSYCHOLOGIST` | O'z tavsiyalarini qo'shish/o'chirish, ish vaqti, bog'lanish ma'lumotlari |
| `ADMIN` | Kitoblar, testlar, resurslar, psixologlar, bronlarni boshqarish |
| `SUPERADMIN` | Adminlarni qo'shish/o'chirish, barcha foydalanuvchilar ustidan nazorat |

---

## Ishga tushirish

### 1. Repozitoriyani klonlash
```bash
git clone https://github.com/sizning-username/psixohelp.git
cd psixohelp
```

### 2. .env fayllarini sozlash
```bash
cp .env.example .env
# .env faylini tahrirlang:
```

**Root `.env`:**
```
POSTGRES_PASSWORD=StrongPassword123!
JWT_SECRET=your-super-secret-jwt-key-minimum-32-chars
CLIENT_URL=http://localhost:3000
GROQ_API_KEY=your-groq-api-key
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### 3. Docker bilan ishga tushirish
```bash
docker-compose up --build
```

Ilovalar:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000/api
- PostgreSQL: localhost:5432

---

## VS Code orqali local development

### Talablar
- Node.js 20+
- PostgreSQL (local yoki Docker)
- npm yoki yarn

### Backend
```bash
cd apps/backend
cp .env.example .env
# .env ni to'ldiring
npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

### Frontend
```bash
cd apps/frontend
cp .env.example .env
# NEXT_PUBLIC_API_URL=http://localhost:4000/api
npm install
npm run dev
```

---

## Git orqali push qilish

```bash
# Birinchi marta
git init
git add .
git commit -m "feat: PsixoHelp v4 - dark 3D UI, psychologist panel, role management"

# GitHub'ga push
git remote add origin https://github.com/username/psixohelp.git
git branch -M main
git push -u origin main

# Keyingi o'zgarishlar
git add .
git commit -m "fix: ..."
git push
```

---

## AWS EC2 ga deploy qilish

### 1. EC2 instance tayyorlash

**Instance tanlash:**
- Ubuntu Server 24.04 LTS
- t3.medium (2 vCPU, 4GB RAM) — minimal
- t3.large (2 vCPU, 8GB RAM) — tavsiya etiladi
- Storage: 20GB SSD

**Security Group (portlar):**
- 22 (SSH)
- 80 (HTTP)
- 443 (HTTPS)
- 3000 (Frontend — ixtiyoriy, Nginx orqali boshqarish yaxshiroq)
- 4000 (Backend — ixtiyoriy)

### 2. Serverga kirish
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

### 3. Server sozlash
```bash
# Tizimni yangilash
sudo apt update && sudo apt upgrade -y

# Docker o'rnatish
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker ubuntu
newgrp docker

# Docker Compose o'rnatish
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Git o'rnatish
sudo apt install git -y
```

### 4. Proyektni yuklab olish
```bash
git clone https://github.com/username/psixohelp.git
cd psixohelp

# .env fayl yaratish
cp .env.example .env
nano .env
# Barcha qiymatlarni to'ldiring!
```

### 5. Docker bilan ishga tushirish
```bash
docker-compose up -d --build

# Loglarni ko'rish
docker-compose logs -f

# Ishlayotganini tekshirish
docker ps
curl http://localhost:4000/api/health
```

### 6. Nginx o'rnatish (Reverse Proxy)
```bash
sudo apt install nginx -y

# Config yaratish
sudo nano /etc/nginx/sites-available/psixohelp
```

**Nginx config:**
```nginx
server {
    listen 80;
    server_name sizning-domen.uz www.sizning-domen.uz;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:4000/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

```bash
# Nginx ni enable qilish
sudo ln -s /etc/nginx/sites-available/psixohelp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## Domen ulash

### 1. DNS sozlamalari (masalan, Namecheap, reg.uz, beget.com)

DNS provayderingizda quyidagilarni qo'shing:

| Tur | Nom | Qiymat | TTL |
|-----|-----|--------|-----|
| A | @ | EC2-IP-MANZIL | 300 |
| A | www | EC2-IP-MANZIL | 300 |

DNS tarqalishi 5-30 daqiqa ketadi.

### 2. SSL sertifikat (Let's Encrypt — bepul)
```bash
# Certbot o'rnatish
sudo apt install certbot python3-certbot-nginx -y

# SSL olish
sudo certbot --nginx -d sizning-domen.uz -d www.sizning-domen.uz

# Avtomatik yangilash tekshirish
sudo certbot renew --dry-run
```

Nginx config avtomatik HTTPS ga o'zgartiriladi!

### 3. CLIENT_URL ni yangilash
```bash
cd ~/psixohelp
nano .env
# CLIENT_URL=https://sizning-domen.uz ni o'zgartiring

# Container ni qayta ishga tushiring
docker-compose down
docker-compose up -d
```

---

## SuperAdmin yaratish

Birinchi foydalanuvchi ro'yxatdan o'tgandan keyin:
```bash
# Backend container ga kirish
docker exec -it psixohelp_backend sh

# Prisma Studio orqali (development)
npx prisma studio

# Yoki SQL orqali
docker exec -it psixohelp_db psql -U postgres psixologik_db
UPDATE "User" SET role = 'SUPERADMIN' WHERE email = 'admin@sizning-email.uz';
\q
```

---

## Foydali komandalar

```bash
# Loglarni ko'rish
docker-compose logs frontend -f
docker-compose logs backend -f

# Konteynerlarni qayta ishga tushirish
docker-compose restart

# To'liq qayta qurish (yangi kod push qilganda)
git pull
docker-compose up -d --build

# Ma'lumotlar bazasini backup qilish
docker exec psixohelp_db pg_dump -U postgres psixologik_db > backup.sql

# Diskni tozalash
docker system prune -a
```

---

## Yangilanishlar deploy qilish (CI/CD)

```bash
# Serverda
cd ~/psixohelp
git pull origin main
docker-compose up -d --build --no-deps frontend backend
```

Yoki GitHub Actions bilan avtomatlashtiring (`.github/workflows/deploy.yml`).
# psixohelp
# psixohelp
# Psixohelp_exam
# Psixohelp_exam
