# ernestofm.dev

[![Deploy to Vercel](https://github.com/ErnestoFM/ernestofm.dev/actions/workflows/deploy-vercel.yml/badge.svg)](https://github.com/ErnestoFM/ernestofm.dev/actions/workflows/deploy-vercel.yml)
[![Unit Tests](https://github.com/ErnestoFM/ernestofm.dev/actions/workflows/unit-tests.yml/badge.svg)](https://github.com/ErnestoFM/ernestofm.dev/actions/workflows/unit-tests.yml)
[![Lint & Format](https://github.com/ErnestoFM/ernestofm.dev/actions/workflows/lint-and-format.yml/badge.svg)](https://github.com/ErnestoFM/ernestofm.dev/actions/workflows/lint-and-format.yml)

Personal portfolio website for **Ernesto Fierro (ErnestoFM)** — Software Engineer specialized in backend development. Built with Next.js 14+, TypeScript, Tailwind CSS, Prisma, Redis, and deployed on Vercel.

🌐 **Live:** [ernestofm.dev](https://ernestofm.dev)

---

## Tech Stack

| Layer          | Technology                          |
| -------------- | ----------------------------------- |
| **Framework**  | Next.js 14+ (App Router)            |
| **Language**   | TypeScript                          |
| **Styling**    | Tailwind CSS + Framer Motion        |
| **Animations** | Framer Motion + Canvas API          |
| **i18n**       | next-intl (EN/ES)                   |
| **Themes**     | next-themes (Dark/Light)            |
| **Database**   | PostgreSQL via Prisma ORM           |
| **Cache**      | Redis via Upstash                   |
| **Auth**       | NextAuth.js (JWT credentials)       |
| **Email**      | Nodemailer / Resend                 |
| **Images**     | Cloudinary (image microservice)     |
| **Deployment** | Vercel                              |
| **CI/CD**      | GitHub Actions (6 workflows)        |
| **Containers** | Docker + Docker Compose             |
| **Testing**    | Jest + Testing Library + Playwright |

---

## Project Structure

```
ernestofm.dev/
├── app/                        # Next.js App Router
│   ├── [locale]/               # i18n locale routes (en, es)
│   │   ├── layout.tsx          # Locale layout with Navbar/Footer
│   │   └── page.tsx            # Home page (all sections)
│   ├── admin/                  # Protected admin panel
│   ├── api/                    # API routes (microservices pattern)
│   │   ├── projects/
│   │   ├── skills/
│   │   ├── certifications/
│   │   ├── articles/
│   │   ├── courses/
│   │   ├── contact/            # Rate-limited + honeypot
│   │   ├── images/             # Cloudinary upload
│   │   └── auth/               # NextAuth
│   ├── layout.tsx              # Root layout + metadata
│   ├── sitemap.ts              # Dynamic sitemap
│   └── robots.ts               # robots.txt
├── components/
│   ├── layout/                 # Navbar, Footer, Providers
│   └── sections/               # Hero, About, Skills, Projects, Certs, Blog, Contact
├── services/
│   ├── content-service/        # Prisma CRUD operations
│   ├── cache-service/          # Redis caching wrapper
│   ├── image-service/          # Cloudinary integration
│   └── mail-service/           # Nodemailer email
├── lib/
│   ├── prisma.ts               # Prisma client singleton
│   ├── redis.ts                # Redis + getCached helper
│   ├── auth.ts                 # NextAuth options
│   └── sanitize.ts             # Input sanitization
├── prisma/
│   ├── schema.prisma           # Data models
│   └── seed.ts                 # Seed data
├── i18n/
│   ├── en.json                 # English translations
│   ├── es.json                 # Spanish translations
│   └── request.ts              # next-intl server config
├── types/
│   └── index.ts                # Shared TypeScript types
├── __tests__/
│   ├── unit/                   # Jest unit tests
│   ├── integration/            # API + DB integration tests
│   └── e2e/                    # Playwright E2E tests
├── public/
│   ├── images/                 # Static images (profile.jpg)
│   └── cv/                     # CV PDF
├── .github/workflows/          # 6 CI/CD workflows
├── Dockerfile                  # Multi-stage production build
├── docker-compose.yml          # Local dev environment
└── .env.example                # Environment variable template
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- Docker & Docker Compose (for local dev)
- PostgreSQL database
- Upstash Redis account
- Cloudinary account (for image uploads)

### Local Development with Docker

```bash
# 1. Clone the repository
git clone https://github.com/ErnestoFM/ernestofm.dev.git
cd ernestofm.dev

# 2. Copy environment variables
cp .env.example .env.local
# Edit .env.local with your values

# 3. Start all services (app + postgres + redis)
docker compose up -d

# 4. Run database migrations
docker compose exec app npx prisma migrate deploy

# 5. Seed the database
docker compose exec app npx prisma db seed
```

### Local Development (without Docker)

```bash
# 1. Install dependencies
npm install

# 2. Copy and configure environment variables
cp .env.example .env.local

# 3. Generate Prisma client
npx prisma generate

# 4. Run migrations
npx prisma migrate dev

# 5. Seed the database
npx prisma db seed

# 6. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in all values:

| Variable                   | Description                         | Required |
| -------------------------- | ----------------------------------- | -------- |
| `DATABASE_URL`             | PostgreSQL connection string        | ✅       |
| `DATABASE_URL_TEST`        | Test database URL                   | Dev      |
| `UPSTASH_REDIS_REST_URL`   | Upstash Redis REST URL              | ✅       |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST token            | ✅       |
| `NEXTAUTH_SECRET`          | NextAuth JWT secret (random string) | ✅       |
| `NEXTAUTH_URL`             | App base URL                        | ✅       |
| `ADMIN_EMAIL`              | Admin login email                   | ✅       |
| `ADMIN_PASSWORD_HASH`      | bcrypt hash of admin password       | ✅       |
| `RESEND_API_KEY`           | Resend API key for emails           | Email    |
| `MAIL_FROM`                | Sender email address                | Email    |
| `MAIL_TO`                  | Recipient email for contact form    | Email    |
| `CLOUDINARY_CLOUD_NAME`    | Cloudinary cloud name               | Images   |
| `CLOUDINARY_API_KEY`       | Cloudinary API key                  | Images   |
| `CLOUDINARY_API_SECRET`    | Cloudinary API secret               | Images   |
| `NEXT_PUBLIC_APP_URL`      | Public app URL                      | ✅       |

### Generating Admin Password Hash

```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('your-password', 12).then(console.log)"
```

---

## Testing

```bash
# Run all Jest tests
npm test

# Run with coverage report
npm test -- --coverage

# Run specific test file
npm test -- __tests__/unit/services/content-service.test.ts

# Run E2E tests (requires dev server running)
npm run dev &
npx playwright test

# Run E2E in UI mode
npx playwright test --ui
```

### Test Structure

```
__tests__/
├── unit/
│   ├── services/               # Unit tests for all service modules
│   └── components/             # Component rendering tests
├── integration/
│   ├── api/                    # API route integration tests
│   └── db/                     # Database query tests
└── e2e/
    ├── navigation.test.ts      # Page navigation flows
    └── contact-form.test.ts    # Contact form behavior
```

#### API Integration Coverage

- Todas las rutas API usan validación estricta con Zod y manejo de errores consistente.
- La ruta `/api/skills` está cubierta con tests de integración para:
  - GET exitoso y error de caché/servicio
  - POST sin sesión (401), payload inválido (400), éxito (201), error de dependencia (500)
  - Validación de efectos secundarios: llamadas a createSkill, invalidateCache y mocks de sesión
- El patrón de tests sigue el estilo de [projects](__tests__/integration/api/projects.test.ts), [contact](__tests__/integration/api/contact.test.ts) y [certifications](__tests__/integration/api/certifications.test.ts).

#### Notas de testing avanzado

- Si Jest muestra el warning `Haste module naming collision` por `package.json` duplicado en `.next/standalone`, limpia la carpeta `.next` antes de correr tests para evitar ruido.

---

## Database

### Migrations

```bash
# Create a new migration
npx prisma migrate dev --name your-migration-name

# Apply migrations in production
npx prisma migrate deploy

# Reset database (dev only)
npx prisma migrate reset

# Seed data
npx prisma db seed
```

### Prisma Studio

```bash
npx prisma studio
```

---

## Deployment

### Vercel (Recommended)

1. Import the repository on [vercel.com](https://vercel.com)
2. Set all environment variables in the Vercel dashboard
3. Enable the PostgreSQL and Redis add-ons (or connect external services)
4. Push to `main` — the `deploy-vercel.yml` workflow handles the rest

### Manual Vercel Deploy

```bash
npm install -g vercel
vercel --token=YOUR_TOKEN --prod
```

### Docker Production

```bash
# Build the image
docker build -t ernestofm.dev .

# Run with environment file
docker run -p 3000:3000 --env-file .env.local ernestofm.dev
```

---

## CI/CD Workflows

| Workflow               | Trigger                | Purpose                              |
| ---------------------- | ---------------------- | ------------------------------------ |
| `deploy-vercel.yml`    | Push to `main`         | Run tests → build → deploy to Vercel |
| `unit-tests.yml`       | PR to `main`/`develop` | Jest tests + 70% coverage gate       |
| `lint-and-format.yml`  | Pull request           | ESLint + Prettier check              |
| `secret-scan.yml`      | Every push             | Gitleaks secret scanning             |
| `dependency-audit.yml` | Every Monday 08:00 UTC | `npm audit` + auto issue creation    |
| `docker-build.yml`     | Push to `main`         | Build Docker image → push to GHCR    |

### Required Secrets

Set these in **GitHub → Settings → Secrets → Actions**:

- `VERCEL_TOKEN` — Vercel access token
- `VERCEL_ORG_ID` — Vercel organization ID
- `VERCEL_PROJECT_ID` — Vercel project ID
- `DATABASE_URL` — Production database URL
- `UPSTASH_REDIS_REST_URL` — Redis URL
- `UPSTASH_REDIS_REST_TOKEN` — Redis token
- `NEXTAUTH_SECRET` — Auth secret
- `NEXT_PUBLIC_APP_URL` — Production URL

---

## Content Management

Access the admin panel at `/admin` (requires credentials from environment variables).

### Admin Features

- View/create/update/delete Projects
- Manage Skills by category and level
- Add Certifications and Courses
- Create and publish Articles (draft system)
- Upload project cover images via Cloudinary

---

## Internationalization

The site supports English (`/en`) and Spanish (`/es`) via `next-intl`.

To add a new locale:

1. Add translations to `i18n/[locale].json`
2. Add the locale to `middleware.ts` locales array
3. Add the locale to `app/[locale]/layout.tsx` validation

---

## Performance

- **Redis caching** on all public GET API routes (TTL: 5 minutes)
- **Next.js Image** with lazy loading and WebP format via Cloudinary
- **Server Components** used by default; Client Components only for interactivity
- **Code splitting** via Next.js App Router
- Target: **Lighthouse 90+** in all categories

---

## Security

- ✅ No secrets committed — `.env.local` in `.gitignore`
- ✅ Rate limiting on contact form (5 requests/hour/IP)
- ✅ Honeypot field for spam protection
- ✅ Input sanitization (XSS prevention)
- ✅ Zod schema validation on all API inputs
- ✅ Admin routes protected by NextAuth JWT
- ✅ Gitleaks secret scanning in CI
- ✅ Admin routes excluded from `robots.txt`

---

## License

MIT © [Ernesto Fierro](https://ernestofm.dev)

---

Built with ❤️ by **ErnestoFM** · Tonalá, Jalisco, México
