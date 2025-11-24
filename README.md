# GuardQuote - Full-Stack Insurance Quote Platform

A complete full-stack web application for managing individual and business insurance quotes with user authentication, real-time updates, and comprehensive admin controls. Includes an ML pricing engine for smart premium estimation.

## 🚀 Quick Start (5 minutes)

### Frontend Only (No Backend)
```bash
npm run frontend
# Runs on http://localhost:5174
```

### Full-Stack
See [QUICKSTART.md](./QUICKSTART.md) for immediate setup instructions.

## 📋 Documentation

### Core Platform
| Document | Purpose |
|----------|---------|
| [QUICKSTART.md](./QUICKSTART.md) | Get running in 5 minutes |
| [FULLSTACK_SETUP.md](./FULLSTACK_SETUP.md) | Detailed setup & troubleshooting |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System design & API docs |
| [PHASED_IMPLEMENTATION.md](./PHASED_IMPLEMENTATION.md) | Development roadmap (7 phases) |
| [SETUP_SUMMARY.md](./SETUP_SUMMARY.md) | What's been built so far |

### ML Pricing Engine
| Document | Purpose |
|----------|---------|
| [docs/ML_ENGINE_OVERVIEW.md](./docs/ML_ENGINE_OVERVIEW.md) | Overview & quick start guide |
| [docs/ML_ENGINE_DESIGN.md](./docs/ML_ENGINE_DESIGN.md) | Complete architecture & design |
| [docs/ML_ENGINE_INDEX.md](./docs/ML_ENGINE_INDEX.md) | Documentation index & navigation |
| [docs/ML_ENGINE_SETUP_COMPLETE.md](./docs/ML_ENGINE_SETUP_COMPLETE.md) | Setup status & next steps |

**Start here →** [QUICKSTART.md](./QUICKSTART.md) or [docs/ML_ENGINE_OVERVIEW.md](./docs/ML_ENGINE_OVERVIEW.md)

## 🏗️ Architecture

```
Frontend (React/TypeScript)        Backend API (NestJS)        Database (PostgreSQL)
┌─────────────────────┐            ┌──────────────────┐        ┌─────────────┐
│  React Components   │ ←→ JSON    │  NestJS API      │ ←→ SQL │ PostgreSQL  │
│  TypeScript Types   │  /REST     │  JWT Auth        │        │ Tables:     │
│  API Client         │  +JWT      │  Knex.js ORM     │        │ • users     │
└─────────────────────┘            └──────────────────┘        │ • quotes    │
                                                                └─────────────┘
Port: 5174                         Port: 3000                  Port: 5432

                           ↕ Integration

                    ML Pricing Engine (Python)
                    ┌─────────────────────────┐
                    │  FastAPI Service        │
                    │  XGBoost Model          │
                    │  Feature Pipeline       │
                    └─────────────────────────┘
                    Port: 8000
```

## 🎯 Current Status

### ✅ Completed
- [x] NestJS backend with modular architecture
- [x] PostgreSQL database with Knex migrations
- [x] JWT authentication with bcrypt hashing
- [x] Complete API endpoints (Auth, Users, Quotes)
- [x] Fully typed API client for frontend
- [x] TypeScript type definitions
- [x] Environment configuration
- [x] Comprehensive documentation
- [x] ML Engine documentation & architecture (6-phase plan)
- [x] ML Engine project structure & dependencies

### ⏳ Next Steps
- [ ] Database setup (PostgreSQL)
- [ ] Run migrations
- [ ] Frontend authentication UI
- [ ] Quote creation forms
- [ ] Quote dashboard
- [ ] Admin panel
- [ ] ML Phase 1: Data exploration & feature engineering

See [PHASED_IMPLEMENTATION.md](./PHASED_IMPLEMENTATION.md) for complete development roadmap.

## 💻 Tech Stack

### Frontend
- **React 19.2** - UI library
- **TypeScript 5.9** - Type safety
- **Vite 7.2** - Build tool (fast HMR)
- **React Router 7.9** - Routing
- **React Hook Form 7.66** - Form management
- **Fetch API** - HTTP client

### Backend
- **NestJS 11.1** - Node.js framework
- **Express 5** - HTTP server
- **Knex.js 3.1** - Query builder & migrations
- **PostgreSQL 12+** - Relational database
- **JWT 11.0** - Token authentication
- **Passport.js 0.7** - Authentication
- **Bcrypt 6.0** - Password hashing

### ML Engine
- **Python 3.9+** - Programming language
- **XGBoost 2.0** - Primary ML model
- **Scikit-learn 1.3** - ML toolkit
- **Pandas 2.0** - Data manipulation
- **NumPy 1.24** - Numerical computing
- **FastAPI 0.104** - ML service API
- **SQLAlchemy 2.0** - ORM for data access
- **Jupyter 1.0** - Notebooks for exploration

## 📁 Project Structure

```
GuardQuote/
├── frontend/                       # Frontend (React)
│   ├── src/
│   │   ├── components/             # UI components
│   │   ├── pages/                  # Page components
│   │   ├── services/               # API client
│   │   ├── types/                  # TypeScript types
│   │   ├── context/                # Context API
│   │   ├── hooks/                  # Custom hooks
│   │   └── router/                 # React Router config
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                        # Backend (NestJS)
│   ├── src/
│   │   ├── auth/                   # JWT authentication
│   │   ├── users/                  # User management
│   │   ├── quotes/                 # Quote management
│   │   ├── database/               # Database setup
│   │   ├── app.module.ts           # Root module
│   │   └── main.ts                 # Entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env                        # Configuration
│
├── ml-engine/                      # ML Pricing Engine (Python)
│   ├── src/
│   │   ├── data/                   # Data pipeline modules
│   │   ├── models/                 # ML model implementations
│   │   ├── config/                 # Configuration
│   │   ├── api/                    # FastAPI service
│   │   └── utils/                  # Utility functions
│   ├── notebooks/                  # Jupyter notebooks
│   ├── tests/                      # Unit tests
│   ├── data/                       # Data storage (raw, processed, splits)
│   ├── models/artifacts/           # Trained model storage
│   ├── README.md
│   ├── requirements.txt
│   └── .env.example
│
├── docs/                           # Documentation
│   ├── ML_ENGINE_OVERVIEW.md       # ML system overview
│   ├── ML_ENGINE_DESIGN.md         # ML architecture
│   ├── ML_ENGINE_INDEX.md          # Documentation index
│   └── ML_ENGINE_SETUP_COMPLETE.md # ML setup status
│
├── README.md                        # This file
├── QUICKSTART.md                    # 5-minute setup
├── FULLSTACK_SETUP.md              # Detailed guide
├── ARCHITECTURE.md                 # System design
├── PHASED_IMPLEMENTATION.md        # Development plan
├── SETUP_SUMMARY.md                # What's built
├── package.json                    # Root npm scripts
└── .gitignore
```

## 🔐 API Endpoints

All endpoints documented in [FULLSTACK_SETUP.md](./FULLSTACK_SETUP.md)

### Authentication
```
POST   /auth/register        Create new account
POST   /auth/login           Get JWT token
```

### Users (Protected)
```
GET    /users                Get all users
```

### Quotes (Protected)
```
GET    /quotes               Get my quotes
POST   /quotes               Create quote
GET    /quotes/:id           Get quote details
PATCH  /quotes/:id           Update quote
DELETE /quotes/:id           Delete quote
```

Protected endpoints require:
```
Authorization: Bearer <JWT_TOKEN>
```

## 🗄️ Database Schema

### users
```sql
id, email (unique), password (hashed), first_name, last_name,
user_type (individual/business), company_name, phone,
created_at, updated_at
```

### quotes
```sql
id, user_id (FK), quote_type, status (pending/reviewed/approved/rejected),
estimated_amount, description, coverage_type, coverage_level,
health_info (JSON), employment_status, industry, num_employees,
annual_revenue, business_info (JSON), created_at, updated_at
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- npm or yarn
- Python 3.9+ (for ML engine)

### Installation

1. **Clone repository**
   ```bash
   cd GuardQuote
   ```

2. **Setup Database**
   ```bash
   # Create user and database (see QUICKSTART.md for details)
   psql postgres
   # Copy commands from QUICKSTART.md
   ```

3. **Run Migrations**
   ```bash
   cd backend
   npx knex migrate:latest
   ```

4. **Start Backend**
   ```bash
   cd backend
   npm run dev
   # Runs on http://localhost:3000
   ```

5. **Start Frontend** (new terminal)
   ```bash
   cd frontend
   npm run dev
   # Runs on http://localhost:5174
   ```

## 📝 Example API Usage

### Register
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "first_name": "John",
    "last_name": "Doe"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

### Create Quote
```bash
curl -X POST http://localhost:3000/quotes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "quote_type": "individual",
    "coverage_type": "life",
    "estimated_amount": 500
  }'
```

## 🛠️ Development & Deployment

### Running the App

#### Option 1: Frontend Only (Recommended for UI Development)
```bash
npm run frontend
# Installs dependencies and runs on http://localhost:5174
# Perfect for working on UI without database setup
```

#### Option 2: Backend Only
```bash
npm run backend
# Starts NestJS server on http://localhost:3000
# Requires database setup (see QUICKSTART.md)
```

#### Option 3: Full-Stack (Frontend + Backend)
```bash
npm run dev
# Runs both backend and frontend in parallel
# Terminal 1: Backend on http://localhost:3000
# Terminal 2: Frontend on http://localhost:5174
```

#### Option 4: Install All Dependencies
```bash
npm run install:all
# Install dependencies for root, frontend, and backend
```

### Frontend Development
```bash
cd frontend
npm run dev       # Start dev server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

### Backend Development
```bash
cd backend
npm run dev                    # Start dev server (with hot reload)
npm run build                  # Build for production
npx knex migrate:latest        # Run migrations
npx knex migrate:rollback      # Rollback migrations
```

### ML Engine Development
```bash
cd ml-engine
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
jupyter notebook              # Start Jupyter for data exploration
pytest tests/                 # Run tests
```

## 📊 Project Status

### Core Platform
**Phase 1: Foundation & Setup** ✅ Complete
- Environment setup
- Backend architecture
- Database schema
- API endpoints
- Frontend integration layer

**Phase 2-7**: In Development
See [PHASED_IMPLEMENTATION.md](./PHASED_IMPLEMENTATION.md) for detailed roadmap

### ML Pricing Engine
**Phase 1: Foundation Setup** 📋 Planned
- Data exploration & analysis
- Feature engineering pipeline
- Baseline model training
- Documentation complete (See [docs/ML_ENGINE_SETUP_COMPLETE.md](./docs/ML_ENGINE_SETUP_COMPLETE.md))

**Phase 2-6**: 6-phase plan over 12 weeks
See [docs/ML_ENGINE_DESIGN.md](./docs/ML_ENGINE_DESIGN.md) for detailed roadmap

## 🔍 Features Overview

### Phase 1 (Completed)
- ✅ User registration & login
- ✅ JWT authentication
- ✅ User management
- ✅ Quote CRUD operations
- ✅ Type-safe API client

### Phase 2-3 (Next)
- [ ] Registration UI
- [ ] Login UI
- [ ] Dashboard
- [ ] Quote creation forms
- [ ] Quote listing

### Phase 4-7 (Future)
- [ ] Admin panel
- [ ] Quote management workflows
- [ ] Reporting & analytics
- [ ] Email notifications
- [ ] Document management
- [ ] Payment integration
- [ ] ML-powered quote pricing

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Check PostgreSQL is running
brew services list

# Verify credentials in .env
cat backend/.env

# Test connection
psql -h localhost -U guardquote -d guardquote
```

### Port Already in Use
```bash
# Kill process on port 3000
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Kill process on port 5174
lsof -i :5174 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### Migration Errors
```bash
# Check migration status
npx knex migrate:status

# Rollback and retry
npx knex migrate:rollback
npx knex migrate:latest
```

For more help, see [FULLSTACK_SETUP.md](./FULLSTACK_SETUP.md#troubleshooting)

## 🔐 Security Notes

1. Change `JWT_SECRET` in `.env` before production
2. Change database password before production
3. Enable HTTPS in production
4. Configure CORS for your domain
5. Add rate limiting for auth endpoints
6. Implement email verification
7. Add input sanitization
8. Regular security audits

See [ARCHITECTURE.md](./ARCHITECTURE.md#security-features) for details

## 📚 Learning Resources

### Frontend
- [React 19 Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [React Router Docs](https://reactrouter.com)

### Backend
- [NestJS Documentation](https://docs.nestjs.com)
- [Knex.js Docs](https://knexjs.org)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [JWT.io](https://jwt.io)

### ML Engine
- [XGBoost Docs](https://xgboost.readthedocs.io)
- [Scikit-learn Docs](https://scikit-learn.org/stable/)
- [Pandas Docs](https://pandas.pydata.org/docs/)
- [FastAPI Docs](https://fastapi.tiangolo.com)

## 👥 Team

- **Frontend Lead**: [Your Name]
- **Backend Lead**: [Your Name]
- **ML Engineer**: [Your Name]
- **DevOps**: [Your Name]
- **QA**: [Your Name]

## 📞 Support

For issues or questions:
1. Check [TROUBLESHOOTING](./FULLSTACK_SETUP.md#troubleshooting) section
2. Review [ARCHITECTURE.md](./ARCHITECTURE.md)
3. Check GitHub issues
4. Contact team lead

## 📄 License

[Your License Here]

## 🎉 Next Steps

1. **Setup Database**: Follow [QUICKSTART.md](./QUICKSTART.md)
2. **Run Application**: Start backend and frontend
3. **Review Code**: Understand the structure
4. **Begin Development**: Start Phase 2 tasks
5. **Follow Roadmap**: Use [PHASED_IMPLEMENTATION.md](./PHASED_IMPLEMENTATION.md)

---

**Last Updated**: November 24, 2024
**Status**: Platform Foundation Complete, ML Engine Documentation Ready

**Quick Links**:
- 📖 [Platform Documentation](.)
- 🚀 [Quick Start](./QUICKSTART.md)
- 🏗️ [Architecture](./ARCHITECTURE.md)
- 📋 [Implementation Plan](./PHASED_IMPLEMENTATION.md)
- 💾 [Setup Details](./FULLSTACK_SETUP.md)
- 🤖 [ML Engine Overview](./docs/ML_ENGINE_OVERVIEW.md)
- 🧠 [ML Engine Design](./docs/ML_ENGINE_DESIGN.md)
- 📚 [ML Documentation](./docs/)
