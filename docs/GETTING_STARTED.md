# Getting Started with GuardQuote

Quick guide to set up and run GuardQuote locally.

---

## Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org))
- **PostgreSQL** 12+ ([Download](https://www.postgresql.org/download/))
- **npm** 9+ (comes with Node.js)
- **Git** ([Download](https://git-scm.com))

---

## 1. Clone the Repository

```bash
git clone https://github.com/jag18729/GuardQuote.git
cd GuardQuote
```

---

## 2. Install Dependencies

```bash
# Install all dependencies
npm run install:all

# Or individually:
cd frontend && npm install
cd ../backend && npm install
cd ../ml-engine && pip install -r requirements.txt
```

---

## 3. Setup Database

Create PostgreSQL database:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database and user
CREATE USER guardquote WITH PASSWORD 'guardquote';
CREATE DATABASE guardquote OWNER guardquote;
GRANT ALL PRIVILEGES ON DATABASE guardquote TO guardquote;
\q
```

Run migrations:

```bash
cd backend
npx knex migrate:latest
```

---

## 4. Environment Configuration

Create `.env` files:

**backend/.env**
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=guardquote
DB_PASSWORD=guardquote
DB_NAME=guardquote
PORT=3000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_change_in_production
FRONTEND_URL=http://localhost:5174
```

**frontend/.env.local**
```env
VITE_API_URL=http://localhost:3000
```

---

## 5. Run the Application

### Option 1: Frontend Only (Recommended for UI Development)
```bash
npm run frontend
# Opens http://localhost:5174
```

### Option 2: Both Frontend & Backend
```bash
npm run dev
# Frontend: http://localhost:5174
# Backend: http://localhost:3000
```

### Option 3: Individual Services

Terminal 1 - Backend:
```bash
cd backend
npm run dev
# Runs on http://localhost:3000
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
# Runs on http://localhost:5174
```

Terminal 3 - ML Engine (Optional):
```bash
cd ml-engine
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
jupyter notebook
```

---

## 6. Test the Application

### Test Backend
```bash
curl http://localhost:3000/health
# Expected: {"status":"ok","timestamp":"..."}
```

### Test Registration
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!",
    "first_name": "John",
    "last_name": "Doe"
  }'
```

### Open Frontend
```
http://localhost:5174
```

---

## Troubleshooting

### Database Connection Error
```bash
# Check PostgreSQL is running
psql -U guardquote -d guardquote

# Verify .env credentials
cat backend/.env
```

### Port Already in Use
```bash
# macOS/Linux
lsof -i :3000    # Backend
lsof -i :5174    # Frontend

# Kill process
kill -9 <PID>
```

### Dependencies Not Installing
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## Next Steps

1. **Learn the codebase**: Read [project/PROJECT_STRUCTURE.md](./project/PROJECT_STRUCTURE.md)
2. **Understand the architecture**: Read [architecture/](./architecture/)
3. **Contributing**: Read [project/CONTRIBUTION_GUIDE.md](./project/CONTRIBUTION_GUIDE.md)
4. **Tech stack upgrade**: Check [architecture/TECH_STACK_UPGRADE.md](./architecture/TECH_STACK_UPGRADE.md)

---

## Quick Commands Reference

```bash
# Development
npm run dev              # Frontend + Backend
npm run frontend         # Frontend only
npm run backend          # Backend only
npm run build            # Build both

# Database
cd backend
npx knex migrate:latest  # Run migrations
npx knex migrate:status  # Check status

# ML Engine
cd ml-engine
jupyter notebook         # Start notebooks
pip install -r requirements.txt  # Install dependencies

# Git
git checkout -b feature/name      # Create feature branch
git add .                          # Stage changes
git commit -m "message"            # Commit
git push origin feature/name       # Push to remote
```

---

**Having issues?** Check the [troubleshooting guide](./architecture/DEPLOYMENT_ARCHITECTURE.md#troubleshooting) or ask for help in the GitHub issues.
