# Contributing to GuardQuote - Your Contribution Guide

## Overview

You have successfully created a complete full-stack foundation for the GuardQuote application and are ready to contribute it to the original repository at https://github.com/ibernal1815/GuardQuote/

## Git Setup Recap

Your repository is already configured for contribution:

```
Your Fork:      https://github.com/jag18729/GuardQuote.git
Original Repo:  https://github.com/ibernal1815/GuardQuote.git (upstream)

Git Remotes:
- origin   → your fork (jag18729)
- upstream → original repo (ibernal1815)
```

## What You've Built (rafael branch)

### Backend (NestJS/Node.js)
✅ Complete modular architecture
- `src/main.ts` - Application entry point
- `src/app.module.ts` - Root module
- `src/auth/` - JWT authentication with Passport.js
- `src/users/` - User management
- `src/quotes/` - Quote CRUD operations
- `src/database/` - PostgreSQL + Knex.js setup
- Database migrations for users and quotes tables

### Frontend (React/TypeScript)
✅ Production-ready integration
- `src/services/apiClient.ts` - Fully typed API client
- `src/types/User.ts` - User type definitions
- `src/types/Quote.ts` - Quote type definitions
- Component structure ready for implementation
- Auth context and custom hooks

### Project Structure (Root Level)
```
GuardQuote/
├── backend/     (NestJS API on :3000)
├── frontend/      (React Frontend on :5174)
└── Documentation files
```

## Creating the Pull Request

### Method 1: Using GitHub Web Interface (Recommended)

1. **Go to compare page:**
   https://github.com/jag18729/GuardQuote/compare/ibernal1815:main...jag18729:rafael

2. **Review your changes:**
   - 3 commits with all the foundation work
   - Clean diff showing additions to structure

3. **Click "Create Pull Request"**

4. **Add PR Title:**
   ```
   feat: Add complete full-stack foundation with NestJS backend and React frontend
   ```

5. **Add PR Description:**
   ```markdown
   ## Summary

   Complete full-stack development foundation for GuardQuote:

   ### Backend
   - NestJS with modular architecture (Auth, Users, Quotes)
   - JWT authentication with Bcrypt
   - PostgreSQL database with Knex.js migrations
   - All CRUD endpoints implemented

   ### Frontend
   - React 19 + TypeScript + Vite
   - Fully typed API client
   - Complete type definitions
   - Authentication context ready

   ### Database
   - PostgreSQL schema with migrations
   - Users table
   - Quotes table with flexible fields

   ## Files Added
   - 22 TypeScript backend files
   - Frontend type definitions and API client
   - Database migrations
   - Configuration files
   - Documentation

   ## Next Phase (Phase 2)
   - Authentication UI components
   - Quote management UI
   - Dashboard and forms
   ```

6. **Click "Create pull request"**

### Method 2: Using Git CLI

```bash
gh pr create \
  --repo ibernal1815/GuardQuote \
  --head jag18729:rafael \
  --base main \
  --title "feat: Add complete full-stack foundation" \
  --body "See PR description in Method 1"
```

## Your Branch Details

### Branch: rafael
- **3 commits** with clean, descriptive messages
- **Location:** https://github.com/jag18729/GuardQuote/tree/rafael
- **Based on:** upstream/main

### Commits:
1. `feat: Add full-stack foundation with complete documentation`
2. `refactor: Reorganize project structure - both backend and frontend at root level`
3. `docs: Add project structure documentation`

## After Creating the PR

### Checklist
- [ ] PR is created
- [ ] Review any feedback from maintainers
- [ ] Make changes if requested (if any)
- [ ] Wait for approval and merge

### If Changes Are Requested
1. Make changes on your local `rafael` branch
2. Commit changes
3. Push to origin: `git push origin rafael`
4. PR will automatically update

### After Merge
1. Update your local repo:
   ```bash
   git checkout main
   git pull upstream main
   ```

2. Delete local rafael branch:
   ```bash
   git branch -d rafael
   ```

3. Delete remote rafael branch:
   ```bash
   git push origin --delete rafael
   ```

## Setup Instructions for Others

Once merged, the project can be set up with:

```bash
# 1. Clone the repo
git clone https://github.com/ibernal1815/GuardQuote.git
cd GuardQuote

# 2. Install dependencies
cd backend && npm install
cd ../frontend && npm install && cd ..

# 3. Setup PostgreSQL
psql postgres << SQL
CREATE USER guardquote WITH PASSWORD 'guardquote';
CREATE DATABASE guardquote OWNER guardquote;
GRANT ALL PRIVILEGES ON DATABASE guardquote TO guardquote;
SQL

# 4. Run migrations
cd backend
npx knex migrate:latest

# 5. Start backend (Terminal 1)
npm run dev

# 6. Start frontend (Terminal 2)
cd frontend
npm run dev
```

## What's NOT Included (For Future PRs)

- UI Component implementations
- Form handling and validation UI
- Page styling and design
- Dashboard features
- Admin features
- Testing suite
- CI/CD configuration

These would be great follow-up PRs in Phase 2!

## Questions?

For questions about the code:
1. Check `IMPLEMENTATION_PLAN.txt` for development roadmap
2. Check `PROJECT_STRUCTURE.txt` for directory details
3. Read code comments in the TypeScript files
4. Refer to NestJS and React documentation

## Summary

You have:
✅ Created a production-ready full-stack foundation
✅ Organized code properly at project root
✅ Written clean, modular code
✅ Provided comprehensive documentation
✅ Set up for contribution via fork/PR

Your work is ready to contribute! The PR will showcase your ability to:
- Build scalable backend architecture
- Integrate frontend with API
- Implement security (JWT + Bcrypt)
- Document code and processes
- Follow version control best practices

Good luck with the contribution! 🚀
