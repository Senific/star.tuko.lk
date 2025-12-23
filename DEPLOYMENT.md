# Star.Tuko.lk Deployment Information

## Server Details

- **Server**: tuko.senific.com
- **SSH Port**: 2222
- **SSH Command**: `ssh -p 2222 root@tuko.senific.com`
- **App Directory**: `/var/www/star.tuko.lk`

## Domain & SSL

- **Domain**: https://star.tuko.lk
- **SSL**: Let's Encrypt (auto-renews)
- **Certificate Location**: `/etc/letsencrypt/live/star.tuko.lk/`

## Database (PostgreSQL 16)

- **Host**: localhost
- **Port**: 5432
- **Database**: beauty2026
- **User**: postgres
- **Password**: `DrcoolFern`
- **Connection String**: 
  ```
  postgresql://postgres:DrcoolFern@localhost:5432/beauty2026?schema=public
  ```

## PM2 Process

- **App Name**: star.tuko.lk
- **Port**: 3002
- **Commands**:
  ```bash
  pm2 status                    # Check status
  pm2 logs star.tuko.lk         # View logs
  pm2 restart star.tuko.lk      # Restart app
  pm2 stop star.tuko.lk         # Stop app
  ```

## Nginx

- **Config File**: `/etc/nginx/sites-available/star.tuko.lk`
- **Reload**: `systemctl reload nginx`

## GitHub Repository

- **Repo**: git@github.com:Senific/star.tuko.lk.git
- **Branch**: main

## Deployment Commands

```bash
# SSH to server
ssh -p 2222 root@tuko.senific.com

# Update and rebuild
cd /var/www/star.tuko.lk
git pull
npm install
npm run build
pm2 restart star.tuko.lk
```

## Tuko OAuth

- **Client ID**: 078a8695298d1816715cc4933c47399c
- **Client Secret**: fcc8ded2db471d0f1187ffc25e7b0849dcf30607f59f667f7e42dae95f170e33
- **Redirect URI**: https://star.tuko.lk/api/auth/tuko/callback

## Environment Variables (.env)

The `.env` file on the server contains:
- DATABASE_URL
- NEXTAUTH_SECRET
- NEXTAUTH_URL
- Tuko OAuth credentials

---
*Last updated: December 23, 2025*
