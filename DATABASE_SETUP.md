# Database Setup Guide for Beauty 2026

## Prerequisites
- PostgreSQL 14+ installed and running
- Node.js 18+

## Step 1: Install PostgreSQL

### Windows
Download from: https://www.postgresql.org/download/windows/

During installation:
- Remember the password you set for the `postgres` user
- Default port is `5432`

### Using Chocolatey
```bash
choco install postgresql
```

### Using Docker (Alternative)
```bash
docker run --name beauty2026-db -e POSTGRES_PASSWORD=password -e POSTGRES_DB=beauty2026 -p 5432:5432 -d postgres:15
```

## Step 2: Create the Database

Open pgAdmin or use psql command line:

```sql
-- Connect as postgres user
psql -U postgres

-- Create the database
CREATE DATABASE beauty2026;

-- Verify it was created
\l

-- Exit
\q
```

Or using pgAdmin:
1. Right-click on "Databases"
2. Click "Create" > "Database"
3. Name: `beauty2026`
4. Click Save

## Step 3: Configure Environment Variables

Edit the `.env` file in the project root:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/beauty2026?schema=public"
```

Replace `YOUR_PASSWORD` with the password you set during PostgreSQL installation.

## Step 4: Run Database Migration

```bash
# Push the schema to create tables
npx prisma db push

# Or use migrations (recommended for production)
npx prisma migrate dev --name init
```

## Step 5: Seed Initial Data

```bash
npm run db:seed
```

This will create:
- 9 Provinces with trilingual names
- 25 Districts with trilingual names
- Default admin user (admin@beauty2026.lk / admin123)
- Competition phases (District, Provincial, National)
- Default settings

## Step 6: Verify Setup

```bash
# Open Prisma Studio to view your data
npx prisma studio
```

This opens a web interface at http://localhost:5555 where you can browse your database.

## Useful Commands

| Command | Description |
|---------|-------------|
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:push` | Push schema changes to database |
| `npm run db:migrate` | Create and run migrations |
| `npm run db:seed` | Seed initial data |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:reset` | Reset database (WARNING: deletes all data) |

## Troubleshooting

### Error: Can't reach database server at localhost:5432
- Make sure PostgreSQL is running
- Check if the port 5432 is correct
- Verify firewall isn't blocking the connection

### Error: password authentication failed
- Check the password in your `.env` file
- Make sure you're using the correct PostgreSQL user

### Error: database "beauty2026" does not exist
- Create the database using pgAdmin or psql
- See Step 2 above

## Production Deployment

For production, use a managed PostgreSQL service:
- **Supabase**: https://supabase.com (Free tier available)
- **Railway**: https://railway.app
- **Neon**: https://neon.tech (Free tier available)
- **PlanetScale**: https://planetscale.com

Update your `DATABASE_URL` with the connection string from your provider.
