# Production-Ready Developer Portfolio Backend

A secure, high-performance, and modular backend API built with **Node.js**, **Express.js**, **PostgreSQL**, and **Prisma ORM** for the developer portfolio of Anushree R.

---

## 🚀 Overview

This backend service powers:
- **Contact Form Submissions**: Validates, sanitizes, rate-limits, and stores visitor inquiries while triggering transactional email notifications via **Resend**.
- **Portfolio Projects API**: Delivers structured, typed project data with slug lookup, technology tags, and categorization.
- **Protected Admin API**: Secure JWT-based dashboard API to view, paginate, filter, update status (`UNREAD`, `READ`, `ARCHIVED`), and delete contact messages.
- **Enterprise-Grade Security**: Hardened with Helmet HTTP headers, strict CORS origin allowlists, request timeouts, payload limits, rate limiters, honeypot bot trap, and safe parameterized database queries.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Runtime & Framework** | Node.js (v20+ / v24+), Express.js (ES Modules) |
| **Database & ORM** | PostgreSQL, Prisma ORM 6.x |
| **Validation** | Zod 3.x with sanitization |
| **Security** | Helmet 8.x, CORS, Bcryptjs, JSONWebToken (JWT) |
| **Rate Limiting** | express-rate-limit |
| **Email Service** | Resend API (with local fallback simulation) |
| **Testing** | Vitest 3.x, Supertest 7.x |
| **Deployment** | Render (Backend + PostgreSQL), Vercel (Frontend) |

---

## 📁 Directory Structure

```
backend/
├── prisma/
│   ├── schema.prisma              # Database schema definitions (Project, ContactMessage, AdminUser)
│   ├── seed.js                    # Seeding script for authentic portfolio projects
│   └── migrations/
│       ├── 20261010000000_init/   # Initial SQL migration
│       └── migration_lock.toml
├── src/
│   ├── config/
│   │   ├── env.js                 # Environment variable validation & centralized access
│   │   ├── prisma.js              # Prisma Client singleton with injection support
│   │   └── resend.js              # Resend email client with dev/test mock fallback
│   ├── controllers/
│   │   ├── admin.controller.js    # Admin login, message retrieval, patch, and delete
│   │   ├── contact.controller.js  # Contact submission processing
│   │   ├── health.controller.js   # Service and database connectivity health probe
│   │   └── projects.controller.js # Public project querying
│   ├── middleware/
│   │   ├── auth.middleware.js     # Admin JWT verification
│   │   ├── error.middleware.js    # Production-safe error and 404 handler
│   │   ├── rateLimiter.middleware.js # Multi-tiered IP rate limiting
│   │   ├── security.middleware.js # Helmet, strict CORS allowlist, request timeout
│   │   └── validate.middleware.js # Zod body, query, and params validator
│   ├── routes/
│   │   ├── admin.routes.js        # /api/admin/*
│   │   ├── contact.routes.js      # /api/contact
│   │   ├── health.routes.js       # /api/health
│   │   ├── projects.routes.js     # /api/projects/*
│   │   └── index.js               # Central API router aggregator
│   ├── scripts/
│   │   └── createAdmin.js         # Interactive / CLI script to create initial admin
│   ├── services/
│   │   ├── admin.service.js       # Message querying, pagination, update, deletion
│   │   ├── auth.service.js        # Admin authentication and bcrypt password comparison
│   │   ├── contact.service.js     # Form processing, honeypot trap, DB persistence
│   │   ├── email.service.js       # Resend notification formatting and dispatch
│   │   └── projects.service.js    # Project querying and filters
│   ├── app.js                     # Express application setup
│   └── server.js                  # HTTP server bootstrap and graceful shutdown
├── tests/
│   ├── setup.js                   # Vitest environment setup
│   ├── health.test.js             # Health check tests
│   ├── contact.test.js            # Contact submission, validation, honeypot, & resilience tests
│   ├── projects.test.js           # Project listing, slug retrieval, & 404 handling tests
│   ├── admin.test.js              # Admin authentication, pagination, update, & delete tests
│   ├── ratelimit.test.js          # Rate limiter tests
│   └── failures.test.js           # Database disconnection and error shielding tests
├── .env.example                   # Environment variable template
├── .gitignore                     # Git ignore rules
├── package.json                   # Dependencies and scripts
├── render.yaml                    # Render Infrastructure as Code Blueprint
├── vitest.config.js               # Vitest runner configuration
└── README.md
```

---

## ⚙️ Environment Variables

Create `.env` inside `backend/` from `.env.example`:

```bash
cp .env.example .env
```

| Variable | Description | Example / Default |
|---|---|---|
| `PORT` | Port for the backend server | `5000` |
| `NODE_ENV` | Environment (`development`, `production`, `test`) | `development` |
| `DATABASE_URL` | PostgreSQL connection URL | `postgresql://user:pass@localhost:5432/portfolio_db?schema=public` |
| `CORS_ORIGIN` | Comma-separated list of allowed frontend origins | `http://localhost:5173,https://your-portfolio.vercel.app` |
| `JWT_SECRET` | 32+ char secret string for signing admin tokens | Strong random string |
| `JWT_EXPIRES_IN` | Token duration | `1h` |
| `RESEND_API_KEY` | Resend API key | `re_123456789...` |
| `CONTACT_FROM_EMAIL` | Sender address verified in Resend | `Portfolio Contact <onboarding@resend.dev>` |
| `CONTACT_TO_EMAIL` | Destination email for notifications | `anushreer695@gmail.com` |
| `RATE_LIMIT_WINDOW_MINUTES` | Window duration for rate limiting | `15` |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per IP on general API | `100` |
| `RATE_LIMIT_CONTACT_MAX` | Max submissions per IP on contact form | `5` |
| `RATE_LIMIT_AUTH_MAX` | Max login attempts per IP | `5` |
| `INITIAL_ADMIN_EMAIL` | Optional email for initial admin seed | `admin@anushreer.dev` |
| `INITIAL_ADMIN_PASSWORD` | Optional password for initial admin seed | `ChangeThisPassword123!` |

---

## 🏃 Local Setup & Running Locally

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Database & Run Migrations
Ensure PostgreSQL is running locally or provide a remote database URL in `.env`:
```bash
# Apply migrations to database
npx prisma migrate deploy

# (Optional) Generate fresh Prisma client if schema was changed
npm run prisma:generate
```

### 3. Seed Database
Seeds all 6 projects from the portfolio (All India Villages API, AI Health Diagnostics, Smart Waste Management, Merchant Agent OS, CampusMind, CareerCompass AI):
```bash
npm run prisma:seed
```

### 4. Create Initial Admin Account
Run the secure admin creation script:
```bash
# Interactive mode (prompts for email, password, and name):
npm run admin:create

# Or with CLI flags:
node src/scripts/createAdmin.js --email "admin@anushreer.dev" --password "YourStrongPassword123!" --name "Anushree R"
```

### 5. Start Server
```bash
# Start in watch mode for development:
npm run dev

# Start in production mode:
npm start
```
The server will start at `http://localhost:5000`.

### 6. Run Test Suite
```bash
npm test
```
Runs 20 automated tests verifying:
- Health check and DB status
- Contact submissions, honeypot detection, input sanitization, and Zod validation
- Projects API listing, slug lookup, and 404 responses
- Admin authentication, JWT verification, pagination, patch, and delete
- Rate limiting protection
- Failure resilience (Resend outage resilience, DB connection failure handling, privacy shielding)

---

## 📡 API Reference

### Health Check
- **`GET /api/health`**
  - **Response 200 OK**:
    ```json
    {
      "status": "ok",
      "uptime": 142,
      "timestamp": "2026-10-10T16:00:00.000Z",
      "environment": "development",
      "database": {
        "status": "connected",
        "latencyMs": 4
      }
    }
    ```

---

### Contact Form API
- **`POST /api/contact`**
  - **Headers**: `Content-Type: application/json`
  - **Request Body**:
    ```json
    {
      "name": "Jane Doe",
      "email": "jane@example.com",
      "subject": "Internship Inquiry",
      "message": "Hi Anushree, I came across your portfolio and would love to discuss an engineering role.",
      "_gotcha": ""
    }
    ```
  - **Features**:
    - **Honeypot field (`_gotcha`)**: If populated by spam bots, the server returns `201 Created` immediately without storing to DB or triggering email.
    - **Sanitization**: Strips ASCII control characters and HTML script tags.
    - **Persistence Resilience**: If Resend email delivery fails, the message remains safely stored in PostgreSQL with status `UNREAD` and the error is logged internally.
  - **Success Response (201 Created)**:
    ```json
    {
      "success": true,
      "message": "Thank you for reaching out! Your message has been received.",
      "data": {
        "id": "cm_clxy...",
        "createdAt": "2026-10-10T16:00:00.000Z"
      }
    }
    ```
  - **Validation Error Response (400 Bad Request)**:
    ```json
    {
      "success": false,
      "error": "Validation failed",
      "details": [
        { "field": "email", "message": "Please provide a valid email address" }
      ]
    }
    ```

---

### Projects API
- **`GET /api/projects`**
  - Optional Query Parameters:
    - `category`: Filter by category (e.g. `Full Stack`, `AI`)
    - `featured`: `true` or `false`
    - `search`: Keyword search across title, category, description
  - **Success Response (200 OK)**:
    ```json
    {
      "success": true,
      "count": 6,
      "data": [
        {
          "id": "...",
          "number": "01",
          "slug": "all-india-villages-api",
          "title": "All India Villages API",
          "category": "APIs · FULL STACK",
          "description": "A searchable API platform for Indian villages...",
          "stack": ["Node.js", "Express", "PostgreSQL", "Prisma", "React"],
          "details": ["457K+ village records", "API-key authentication", "PostgreSQL + Prisma"],
          "githubUrl": null,
          "liveDemoUrl": null,
          "featured": true,
          "published": true,
          "accent": "violet",
          "createdAt": "...",
          "updatedAt": "..."
        }
      ]
    }
    ```
- **`GET /api/projects/:slug`**
  - Returns a single project by its unique slug.
  - Returns `404 Not Found` if the slug does not exist.

---

### Admin API (Protected)
- **`POST /api/admin/auth/login`**
  - **Request Body**:
    ```json
    {
      "email": "admin@anushreer.dev",
      "password": "YourStrongPassword123!"
    }
    ```
  - **Response (200 OK)**:
    ```json
    {
      "success": true,
      "message": "Login successful",
      "token": "eyJhbGciOiJIUzI1NiIsIn...",
      "admin": {
        "id": "...",
        "email": "admin@anushreer.dev",
        "name": "Anushree R",
        "role": "ADMIN"
      }
    }
    ```
- **`GET /api/admin/auth/me`**
  - Header: `Authorization: Bearer <token>`
  - Returns authenticated admin profile.

- **`GET /api/admin/messages`**
  - Header: `Authorization: Bearer <token>`
  - Query parameters: `page=1`, `limit=20`, `status=UNREAD|READ|ARCHIVED`, `search=keyword`
  - Returns paginated messages list with metadata:
    ```json
    {
      "success": true,
      "data": [...],
      "pagination": {
        "total": 12,
        "page": 1,
        "limit": 20,
        "totalPages": 1,
        "hasNext": false,
        "hasPrev": false
      }
    }
    ```

- **`GET /api/admin/messages/:id`**
  - Header: `Authorization: Bearer <token>`
  - Retrieves specific message details including sender IP and user-agent.

- **`PATCH /api/admin/messages/:id`**
  - Header: `Authorization: Bearer <token>`
  - **Request Body**:
    ```json
    {
      "status": "READ",
      "adminNotes": "Followed up via personal email on 10/10."
    }
    ```

- **`DELETE /api/admin/messages/:id`**
  - Header: `Authorization: Bearer <token>`
  - Permanently removes message from database.

---

## 🎨 Frontend Integration Guide

The frontend React application (`anushree-portfolio`) has been pre-integrated with:
1. **Interactive Contact Form Component**: `src/components/ContactForm.jsx`
   - Replaced static mailto card while preserving the "AVAILABLE FOR OPPORTUNITIES" badge and design styling.
   - States: idle, submitting (with animated spinner), success card with reset button, field validation errors, and server alerts.
   - Hidden honeypot field (`_gotcha`) automatically attached to every submission.
2. **API Client Service**: `src/services/api.js`
   - Configured to use `import.meta.env.VITE_API_BASE_URL`.
3. **Optional Dynamic Projects API**:
   - In `src/App.jsx`, projects fall back to the built-in local `portfolio.js` dataset by default.
   - To enable live backend project fetching in the frontend, simply create `.env` in the root folder with:
     ```env
     VITE_API_BASE_URL=http://localhost:5000
     VITE_USE_PROJECTS_API=true
     ```

---

## 🚢 Production Deployment

### 1. Deploying Backend to Render

You can deploy the backend using the included **Render Blueprint (`render.yaml`)** or manually via the Render Dashboard.

#### Option A: Using Blueprint (Recommended)
1. Push your repository to GitHub.
2. In the [Render Dashboard](https://dashboard.render.com/), click **New** > **Blueprint**.
3. Connect your repository. Render will automatically detect `backend/render.yaml` and provision:
   - **PostgreSQL Database** (`anushree-portfolio-db`)
   - **Node Web Service** (`anushree-portfolio-backend`)
4. Set the following environment variables in the Render Dashboard:
   - `CORS_ORIGIN`: Your production Vercel frontend URL (e.g. `https://anushree-portfolio.vercel.app`)
   - `RESEND_API_KEY`: Your live Resend API key (`re_...`)
   - `CONTACT_FROM_EMAIL`: Verified sender email (e.g. `Portfolio Contact <onboarding@resend.dev>`)
   - `CONTACT_TO_EMAIL`: `anushreer695@gmail.com`

#### Option B: Manual Setup on Render
1. Create a **PostgreSQL** database on Render:
   - Name: `anushree-portfolio-db`
   - Region: Oregon (or your preferred region)
   - Copy the **Internal Database URL**.
2. Create a **Web Service** on Render:
   - Root Directory: `backend`
   - Runtime: `Node`
   - Build Command: `npm install && npm run build && npx prisma migrate deploy`
   - Start Command: `npm start`
   - Health Check Path: `/api/health`
3. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `DATABASE_URL`: *(paste the Render PostgreSQL connection string)*
   - `CORS_ORIGIN`: `https://your-portfolio.vercel.app`
   - `JWT_SECRET`: *(32+ characters strong random string)*
   - `RESEND_API_KEY`: `re_...`
   - `CONTACT_FROM_EMAIL`: `Portfolio Contact <onboarding@resend.dev>`
   - `CONTACT_TO_EMAIL`: `anushreer695@gmail.com`
4. Deploy the service.
5. In Render's **Shell** tab, run:
   ```bash
   npm run prisma:seed
   npm run admin:create
   ```

---

### 2. Deploying Frontend to Vercel

1. Push your changes to GitHub.
2. In [Vercel](https://vercel.com/), import the repository `anushree-portfolio`.
3. In Project Settings > **Environment Variables**, add:
   - `VITE_API_BASE_URL`: `https://anushree-portfolio-backend.onrender.com` (your Render backend URL without trailing slash)
   - `VITE_USE_PROJECTS_API`: `false` (or `true` if you want projects queried dynamically)
4. Deploy. Vercel will build the Vite frontend.
5. Once deployed, verify that submitting the contact form sends a request to your Render backend and returns a success response.

---

### 3. Resend Email Configuration & Sender Verification

1. Create a free account at [resend.com](https://resend.com/).
2. Navigate to **API Keys** and generate a new key with sending permissions.
3. **Testing / Sandbox mode**:
   - You can send from `onboarding@resend.dev` to the email registered on your Resend account without owning a custom domain.
4. **Custom Domain mode (Production)**:
   - Go to **Domains** > **Add Domain**.
   - Add the DKIM and SPF DNS records provided by Resend to your domain registrar (e.g. Cloudflare, Namecheap).
   - Once verified, update `CONTACT_FROM_EMAIL="Anushree R <contact@yourdomain.com>"`.

---

## 🔒 Security Best Practices Implemented

- **No Secrets in Source Control**: `.env` is git-ignored, all credentials read via environment variables.
- **SQL Injection Prevention**: 100% parameterized queries via Prisma ORM.
- **XSS & Injection Protection**: HTML sanitization on all text fields with script stripping.
- **DDoS & Spam Mitigation**: Rate limiters applied to contact submissions (5 per 15 min) and auth routes (5 attempts per 15 min).
- **Honeypot Bot Defense**: Invisible form field traps automated scrapers without annoying genuine visitors with CAPTCHAs.
- **Payload Limits**: Express JSON and URL-encoded parsers capped at `10kb` to prevent memory exhaustion attacks.
- **Timing & Privacy Protection**: Generic error responses in production hide internal database schemas and stack traces. Sensitive message contents are never written to application logs.

---

## 📄 License
MIT License © 2026 Anushree R

