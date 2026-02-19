# GuardQuote

**ML-powered security service pricing platform.**

> Intelligent quote generation for private security companies using machine learning, real-time data enrichment, and industry-standard pricing models.

[![CI](https://github.com/jag18729/guardquote-frontend/actions/workflows/ci.yml/badge.svg)](https://github.com/jag18729/guardquote-frontend/actions)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)]()

**Live**: [guardquote.vandine.us](https://guardquote.vandine.us) &nbsp;|&nbsp; **API**: [guardquote-origin.vandine.us](https://guardquote-origin.vandine.us/api/status)

---

## What It Does

GuardQuote replaces spreadsheet-based pricing with an intelligent system that:

- **Generates accurate quotes** based on event type, location, duration, and risk factors
- **Learns from historical data** using XGBoost gradient boosting models
- **Enriches with external data** — weather forecasts, census demographics, local events
- **Applies business rules** — overtime rates, hazard pay, minimum staffing requirements
- **Tracks everything** — full audit trail, SIEM-ready auth events, quote lifecycle management

---

## Architecture

```
┌──────────────────────────────┐
│   Frontend (React + Vite)    │  guardquote.vandine.us
│   Cloudflare Pages           │  (CF Pages auto-deploy)
└──────────────┬───────────────┘
               │ /api/*
┌──────────────▼───────────────┐
│   Backend API (Hono/Bun)     │  pi1 → pi2 K3s (v2)
│   REST + WebSocket + JWT     │  Port 3002
└──────────────┬───────────────┘
               │
       ┌───────┴───────┐
       ▼               ▼
┌──────────────┐ ┌──────────────┐
│  PostgreSQL  │ │  ML Engine   │
│  (Primary)   │ │  (FastAPI +  │
│              │ │   XGBoost)   │
└──────────────┘ └──────────────┘
```

---

## Tech Stack

| Layer | Current (v1) | v2.0 (In Progress) |
|-------|-------------|-------------------|
| **Frontend** | React 18, React Router 7, Tailwind, Framer Motion | + OAuth login UI, quote lookup, DEMO_MODE |
| **Backend** | Node.js + Hono, JWT, bcrypt | **Bun 1.3** native serve, argon2id, OAuth 2.0 |
| **Database** | PostgreSQL 15 | + OAuth tables, SIEM events, ML predictions, pricing rules |
| **ML Engine** | Rule-based calculator | **XGBoost** + external API enrichment (NWS, Census, PredictHQ) |
| **Auth** | Email/password + JWT | + **GitHub OAuth** + **Google OAuth** (PKCE) |
| **Infra** | Docker on pi1 | **K3s on pi2** (16GB, NVMe), Cloudflare tunnel |
| **Monitoring** | Sentry | Prometheus + Grafana + Loki (OpenClaw managed) |

---

## v2.0 Roadmap 🚀

**Target: SDPS — March 3, 2026**

### Phase 1 — Backend Port & Auth *(In Progress)*
- [ ] Port backend from Node.js/Hono to **native Bun.serve** ([#90](https://github.com/jag18729/guard-quote/issues/90))
- [ ] OAuth 2.0 SSO — **GitHub** + **Google** login ([#91](https://github.com/jag18729/guard-quote/issues/91))
  - Apps registered and verified ✅
  - Raw OAuth flows (no framework), PKCE, httpOnly cookies
- [ ] v2 database schema migration — 7 new tables ([#98](https://github.com/jag18729/guard-quote/issues/98))
  - `user_oauth_links`, `siem_auth_events`, `ml_predictions`, `pricing_rules`, `audit_log`
  - Auto-lockout trigger (5 failures in 15 min)

### Phase 2 — ML Engine
- [ ] Real ML pricing engine — **XGBoost gradient boosting** ([#92](https://github.com/jag18729/guard-quote/issues/92))
  - 3-source intelligence: trained model + external APIs + rule engine
  - Confidence-weighted ensemble/blender
- [ ] External data enrichment ([#94](https://github.com/jag18729/guard-quote/issues/94))
  - NWS weather forecasts (free, no API key)
  - Census ACS demographics
  - PredictHQ local events (1K/month free tier)
- [ ] Email workflows — quote delivery, acceptance/rejection notifications

### Phase 3 — Demo & Polish
- [ ] **DEMO_MODE** for SDPS showcase ([#93](https://github.com/jag18729/guard-quote/issues/93))
  - Works without VPN or database access
  - Realistic mock data showing full ML pipeline
- [ ] Frontend updates — OAuth UI, enhanced dashboard ([#97](https://github.com/jag18729/guard-quote/issues/97))
- [ ] Remove ~2,350 lines of infrastructure overlap ([#95](https://github.com/jag18729/guard-quote/issues/95))

### Infrastructure
- [ ] Deploy to **pi2 K3s** cluster ([#96](https://github.com/jag18729/guard-quote/issues/96))
- [ ] Dedicated **PostgreSQL server** on Orange Pi RV2 ([#89](https://github.com/jag18729/guard-quote/issues/89))

**Project Board**: [github.com/users/jag18729/projects/3](https://github.com/users/jag18729/projects/3)

---

## Project Structure

```
guard-quote/
├── backend/                 NestJS API (class version)
│   └── src/
│       ├── auth/            JWT authentication
│       ├── database/        PostgreSQL migrations
│       ├── quotes/          Quote CRUD + calculator
│       └── users/           User management
│
├── frontend/                React + Vite + TypeScript
│   └── src/
│       ├── components/      Shared UI components
│       ├── context/         Auth state management
│       ├── pages/           Route pages
│       ├── services/        API client
│       └── types/           TypeScript interfaces
│
├── ml-engine/               Python ML pipeline
│   ├── src/
│   │   ├── api/             FastAPI endpoints
│   │   ├── models/          XGBoost training + inference
│   │   └── data/            Feature engineering
│   └── requirements.txt
│
└── docs/
    ├── architecture/        Tech stack docs, API patterns
    ├── diagrams/            System diagrams (drawio)
    ├── guides/              Migration guides, benchmarks
    ├── ml-engine/           ML design docs
    └── project/             SOW, contribution guide, structure
```

---

## Getting Started

### Prerequisites
- **Node.js** 20+ (or **Bun** 1.3+)
- **PostgreSQL** 15+
- **Python** 3.10+ (for ML engine)

### Development

```bash
# Clone
git clone https://github.com/jag18729/GuardQuote.git
cd GuardQuote

# Backend
cd backend && npm install && npm run start:dev

# Frontend (separate terminal)
cd frontend && npm install && npm run dev
```

Frontend: `http://localhost:5173` &nbsp;|&nbsp; Backend API: `http://localhost:5000`

### Production Repos

| Component | Repository | Deploy Target |
|-----------|-----------|---------------|
| Backend API | [jag18729/guard-quote](https://github.com/jag18729/guard-quote) (dev branch) | pi1 systemd → pi2 K3s |
| Frontend | [jag18729/guardquote-frontend](https://github.com/jag18729/guardquote-frontend) | Cloudflare Pages |
| This repo | [jag18729/GuardQuote](https://github.com/jag18729/GuardQuote) | Class monorepo (reference) |

---

## API Reference

### Public
```
GET  /api/status              Health check + runtime info
GET  /api/event-types         List available event types
GET  /api/locations           List service locations
```

### Authentication
```
POST /api/auth/register       Create account
POST /api/auth/login          Login → JWT token
POST /api/auth/logout         Clear session
GET  /api/auth/me             Current user profile
```

### Quotes (Protected)
```
POST /api/predict             Generate ML-powered quote
GET  /api/quotes              List user's quotes
GET  /api/quotes/:id          Quote details
```

### Admin (Role-based)
```
GET  /api/admin/stats         Dashboard statistics
GET  /api/admin/users         User management
GET  /api/admin/ml/*          ML model status + training
```

### v2.0 — Coming Soon
```
GET  /auth/github             GitHub OAuth redirect
GET  /auth/github/callback    GitHub OAuth callback
GET  /auth/google             Google OAuth redirect
GET  /auth/google/callback    Google OAuth callback
GET  /api/ml/predictions      ML prediction history
GET  /api/siem/events         SIEM auth event log
```

---

## Security

- **Authentication**: JWT (httpOnly cookies), OAuth 2.0 with PKCE
- **Password hashing**: bcrypt (v1) → argon2id via `Bun.password` (v2)
- **SIEM events**: 35 auth event types, CEF severity mapping, auto-lockout
- **RBAC**: Role-based access control (user, admin, super_admin)
- **Rate limiting**: Per-IP and per-user request throttling
- **CSRF**: Token-based protection on state-changing endpoints

---

## License

MIT

---

**Senior Design Project** — CIT 480, California State University, Northridge
