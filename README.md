# RTP Terminal

Live game analytics dashboard backed by MySQL, with a protected admin area for managing providers and games.

## Stack

- Next.js 16 (App Router, Turbopack) + React 19 + TypeScript
- Tailwind CSS v4
- MySQL via `mysql2/promise` (XAMPP / MariaDB friendly)
- Admin auth: bcrypt + `jose` (JWT in httpOnly cookie), session enforced by `proxy.ts`
- Icons: `lucide-react`; motion: `motion` / `framer-motion`

## Prerequisites

- Node.js 20+
- MySQL/MariaDB (XAMPP works out of the box on `127.0.0.1:3306` with `root` and no password)
- A populated `public/images/` directory (not in git — see below)

## Setup

```bash
npm install
cp .env.example .env.local
# edit .env.local: set DB_* and a strong JWT_SECRET
```

Generate a JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

### Database

Run schema + seed:

```bash
mysql -uroot < db/schema.sql
mysql -uroot < db/seed.sql
```

Create the admin user. Copy `db/admin.example.sql` to `db/admin.sql`, replace `<BCRYPT_HASH>` with the output of:

```bash
node -e "console.log(require('bcryptjs').hashSync('YOUR_PASSWORD', 10))"
```

then apply:

```bash
mysql -uroot < db/admin.sql
```

### Images

`public/images/` is gitignored because it can be hundreds of MB. Layout expected by the app:

```
public/images/
  provider/<slug>.svg                 # logo per provider (slug = lowercase, spaces → _, & → _n_)
  <provider_slug>/<filename>          # game art
```

Get them from your own source or upload via the admin UI.

### Run

```bash
npm run dev
```

Public site: <http://localhost:3000> (or whichever port Next picks if 3000 is busy)
Admin login: <http://localhost:3000/login>

## Project layout

```
src/
  app/
    page.tsx                     # public dashboard (Server Component)
    login/                       # /login (public)
    admin/
      (dashboard)/               # protected; shares sidebar layout
        page.tsx                 # /admin
        providers/...            # CRUD provider
        games/...                # CRUD game with filter + pagination
    actions/                     # server actions (auth, providers, games)
  components/                    # Navbar, ProviderTabs, RtpCard, GamesView (client island)
  lib/
    db.ts                        # mysql2 pool (singleton across HMR)
    session.ts                   # jose encrypt/decrypt + cookie helpers
    auth.ts                      # requireAdmin()
    upload.ts                    # safe file upload to /public/images/...
    gameUtils.ts                 # public-facing queries
  proxy.ts                       # protects /admin/* (Next 16 renamed middleware → proxy)
db/
  schema.sql                     # provider + game tables
  seed.sql                       # 23 providers / 4455 games
  admin.example.sql              # template for admin_user seed
```

## Notes

- Server Actions handle all mutations; Origin-based CSRF protection is built in.
- Uploads validate MIME (`image/png|jpeg|webp|svg+xml`) and size (≤ 2 MB) and resolve paths under `public/` only.
- Cascade delete: removing a provider removes its games (FK `ON DELETE CASCADE`).
- The hydration warning about `bis_skin_checked` / `bis_register` attributes comes from browser extensions (BitDefender etc.) injecting into the DOM, not from this app.
