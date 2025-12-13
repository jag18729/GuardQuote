# GuardQuote Documentation

Welcome to GuardQuote documentation. This directory contains all guides, architecture docs, and project planning materials.

---

## 📚 Documentation Quick Links

### Getting Started (Start Here!)
- **[GETTING_STARTED.md](./GETTING_STARTED.md)** - Set up and run GuardQuote locally

### Implementation Guides (How-To)
- **[guides/BUN_1_3_RECOMMENDATIONS.md](./guides/BUN_1_3_RECOMMENDATIONS.md)** - Bun 1.3 features, migration path, and recommendations (NEW!)

- **[guides/HONO_MIGRATION_GUIDE.md](./guides/HONO_MIGRATION_GUIDE.md)** - Migrate backend from NestJS to Hono (Phase 1)
- **[guides/BUNCHMARK.md](./guides/BUNCHMARK.md)** - Install and use Bun as runtime (Phase 2)
- **[guides/BUN_ML_SCALING.md](./guides/BUN_ML_SCALING.md)** - Scale with ML engine and generated quotes

### Architecture & Design
- **[architecture/TECH_STACK_UPGRADE.md](./architecture/TECH_STACK_UPGRADE.md)** - Tech stack upgrade strategy overview
- **[architecture/HONO_API_PATTERNS.md](./architecture/HONO_API_PATTERNS.md)** - API patterns, Zod validation, API Gateway
- **[architecture/ML_ENGINE_DESIGN.md](./ml-engine/ML_ENGINE_DESIGN.md)** - ML pricing engine architecture
- **[architecture/DEPLOYMENT_ARCHITECTURE.md](./architecture/DEPLOYMENT_ARCHITECTURE.md)** - System design and deployment

### Project Planning
- **[project/CONTRIBUTION_GUIDE.md](./project/CONTRIBUTION_GUIDE.md)** - How to contribute to the project
- **[project/PROJECT_STRUCTURE.md](./project/PROJECT_STRUCTURE.md)** - Project folder organization
- **[project/IMPLEMENTATION_PLAN.md](./project/IMPLEMENTATION_PLAN.md)** - Development roadmap
- **[project/MIGRATION_CHECKLIST.md](./project/MIGRATION_CHECKLIST.md)** - 4-phase upgrade tracking

### ML Engine Docs
- **[ml-engine/ML_ENGINE_OVERVIEW.md](./ml-engine/ML_ENGINE_OVERVIEW.md)** - ML engine overview
- **[ml-engine/ML_ENGINE_INDEX.md](./ml-engine/ML_ENGINE_INDEX.md)** - ML documentation index
- **[ml-engine/ML_ENGINE_SETUP_COMPLETE.md](./ml-engine/ML_ENGINE_SETUP_COMPLETE.md)** - Setup status

### Next Session
- **[.continue](./.continue)** - Continuation guide for next development session

---

## 🚀 Quick Navigation by Role

### New Developer Starting Project
1. Read: [GETTING_STARTED.md](./GETTING_STARTED.md)
2. Understand: [project/PROJECT_STRUCTURE.md](./project/PROJECT_STRUCTURE.md)
3. Learn: [architecture/](./architecture/)

### ML Engineer
1. Start: [ml-engine/ML_ENGINE_OVERVIEW.md](./ml-engine/ML_ENGINE_OVERVIEW.md)
2. Deep dive: [ml-engine/ML_ENGINE_DESIGN.md](./ml-engine/ML_ENGINE_DESIGN.md)
3. Optimize: [guides/BUN_ML_SCALING.md](./guides/BUN_ML_SCALING.md)

### Backend Engineer Migrating to Hono
1. Overview: [architecture/TECH_STACK_UPGRADE.md](./architecture/TECH_STACK_UPGRADE.md)
2. Implementation: [guides/HONO_MIGRATION_GUIDE.md](./guides/HONO_MIGRATION_GUIDE.md)
3. Patterns: [architecture/HONO_API_PATTERNS.md](./architecture/HONO_API_PATTERNS.md)

### Implementing API Gateway
1. Patterns: [architecture/HONO_API_PATTERNS.md](./architecture/HONO_API_PATTERNS.md) (API Gateway section)
2. Architecture: [architecture/DEPLOYMENT_ARCHITECTURE.md](./architecture/DEPLOYMENT_ARCHITECTURE.md)

### Project Manager
1. Roadmap: [project/IMPLEMENTATION_PLAN.md](./project/IMPLEMENTATION_PLAN.md)
2. Tracking: [project/MIGRATION_CHECKLIST.md](./project/MIGRATION_CHECKLIST.md)
3. Status: [.continue](./.continue)

---

## 📋 Documentation Structure

```
docs/
├── README.md                              (You are here)
├── GETTING_STARTED.md                     (Quick start)
├── .continue                              (Next session guide)
│
│   ├── BUN_1_3_RECOMMENDATIONS.md       Bun 1.3 features & migration path

├── guides/                                (How-to & Implementation)
│   ├── HONO_MIGRATION_GUIDE.md            Phase 1: Backend rewrite
│   ├── BUNCHMARK.md                       Phase 2: Bun setup
│   └── BUN_ML_SCALING.md                  ML optimization
│
├── architecture/                          (Design & Reference)
│   ├── TECH_STACK_UPGRADE.md              Strategy overview
│   ├── HONO_API_PATTERNS.md               API patterns + Zod + Gateway
│   └── DEPLOYMENT_ARCHITECTURE.md         System design
│
├── project/                               (Planning & Organization)
│   ├── CONTRIBUTION_GUIDE.md              How to contribute
│   ├── PROJECT_STRUCTURE.md               Project overview
│   ├── IMPLEMENTATION_PLAN.md             Development roadmap
│   └── MIGRATION_CHECKLIST.md             Progress tracking
│
└── ml-engine/                             (ML-Specific)
    ├── ML_ENGINE_OVERVIEW.md              Overview
    ├── ML_ENGINE_DESIGN.md                Architecture
    ├── ML_ENGINE_INDEX.md                 Navigation
    └── ML_ENGINE_SETUP_COMPLETE.md        Setup status
```

---

## 🎯 4-Phase Tech Stack Upgrade

The project is undergoing a 4-phase upgrade:

**Phase 1: Hono Migration** - Replace NestJS with Hono (24x faster startup)
- Docs: [guides/HONO_MIGRATION_GUIDE.md](./guides/HONO_MIGRATION_GUIDE.md)
- Track: [project/MIGRATION_CHECKLIST.md](./project/MIGRATION_CHECKLIST.md)

**Phase 2: Bun Integration** - Replace npm with Bun (3x faster installs)
- Docs: [guides/BUNCHMARK.md](./guides/BUNCHMARK.md)
- Track: [project/MIGRATION_CHECKLIST.md](./project/MIGRATION_CHECKLIST.md)

**Phase 3: Cloudflare Tunnels** - Secure deployment (free tier)
- Coming soon...

**Phase 4: Full Deployment** - Production ready
- Coming soon...

---

## 💡 Key Technologies

- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: Hono + Bun (formerly NestJS)
- **Database**: PostgreSQL + Knex.js
- **ML Engine**: Python + FastAPI + XGBoost
- **Deployment**: Cloudflare + Tunnels

---

## 📊 Performance Targets

- Backend startup: 50ms (24x faster)
- Bundle size: 50KB (99% smaller)
- Install time: 15s (3x faster)
- Generated quotes throughput: 100-200/sec
- Concurrent requests: 8,000+

---

## 🔗 External Links

- [Main README](../README.md)
- [Frontend README](../frontend/README.md)
- [Backend Package.json](../backend/package.json)
- [ML Engine README](../ml-engine/README.md)

---

## ❓ Can't Find What You're Looking For?

1. **Quick start?** → [GETTING_STARTED.md](./GETTING_STARTED.md)
2. **How to code?** → [guides/](./guides/)
3. **How does it work?** → [architecture/](./architecture/)
4. **How to contribute?** → [project/CONTRIBUTION_GUIDE.md](./project/CONTRIBUTION_GUIDE.md)
5. **Status/Progress?** → [project/MIGRATION_CHECKLIST.md](./project/MIGRATION_CHECKLIST.md)
6. **Next steps?** → [.continue](./.continue)

---

**Last Updated**: December 5, 2024
**Status**: Documentation organized and ready
