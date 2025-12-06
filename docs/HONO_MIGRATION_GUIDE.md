# Hono Migration Guide: NestJS → Hono

**Phase**: 1 (Backend Rewrite)
**Expected Time**: 2-3 days
**Status**: Ready to implement

---

## Pre-Migration Checklist

Before starting migration:
- [ ] Read TECH_STACK_UPGRADE.md
- [ ] Understand current NestJS endpoints
- [ ] Database schema stable (no pending changes)
- [ ] All tests passing (if any exist)
- [ ] Create new git branch for this work
- [ ] Back up current backend code

---

## Step 1: Setup Hono Project Structure

### 1.1 Update backend/package.json

Replace NestJS dependencies with Hono:

```json
{
  "name": "guardquote-backend",
  "version": "1.0.0",
  "type": "module",
  "main": "src/index.ts",
  "scripts": {
    "dev": "bun run --watch src/index.ts",
    "start": "bun run src/index.ts",
    "build": "bun build src/index.ts --outdir dist",
    "test": "bun test"
  },
  "dependencies": {
    "hono": "^4.0.0",
    "knex": "^3.1.0",
    "pg": "^8.16.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.1.2",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "typescript": "^5.9.3",
    "@types/bun": "latest",
    "@types/node": "^20.10.0",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/bcryptjs": "^2.4.6"
  }
}
```

### 1.2 Create backend/tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "lib": ["ES2022"],
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 1.3 Create backend/.env.example

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=guardquote
DB_PASSWORD=your_secure_password
DB_NAME=guardquote

# Server
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your_jwt_secret_key_change_in_production

# CORS
FRONTEND_URL=http://localhost:5174
ALLOWED_ORIGINS=localhost:5174,localhost:3000
```

### 1.4 Install dependencies

```bash
cd backend
bun install
# (or npm install if bun not installed yet)
```

---

## Step 2: Create Hono App Structure

### 2.1 Create backend/src/index.ts (Entry Point)

```typescript
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { HTTPException } from 'hono/http-exception'

import authRoutes from './routes/auth'
import usersRoutes from './routes/users'
import quotesRoutes from './routes/quotes'
import { authMiddleware } from './middleware/auth'
import { errorHandler } from './middleware/errorHandler'

const app = new Hono()

// Global middleware
app.use(logger())
app.use(
  cors({
    origin: (process.env.FRONTEND_URL || 'http://localhost:5174').split(','),
    credentials: true,
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  })
)

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Routes
app.route('/auth', authRoutes)
app.route('/users', usersRoutes)
app.route('/quotes', quotesRoutes)

// Error handling
app.onError(errorHandler)

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404)
})

const port = parseInt(process.env.PORT || '3000', 10)

console.log(`🚀 Server running on http://localhost:${port}`)

export default {
  port,
  fetch: app.fetch,
}
```

### 2.2 Create backend/src/types/index.ts

```typescript
// User types
export interface User {
  id: string
  email: string
  password: string
  first_name: string
  last_name: string
  user_type: 'individual' | 'business'
  company_name?: string
  phone?: string
  created_at: Date
  updated_at: Date
}

export interface UserResponse {
  id: string
  email: string
  first_name: string
  last_name: string
  user_type: 'individual' | 'business'
  company_name?: string
  phone?: string
  created_at: Date
  updated_at: Date
}

// Auth types
export interface RegisterRequest {
  email: string
  password: string
  first_name: string
  last_name: string
  user_type?: 'individual' | 'business'
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  access_token: string
  user: UserResponse
}

// Quote types
export interface Quote {
  id: string
  user_id: string
  quote_type: string
  status: 'pending' | 'reviewed' | 'approved' | 'rejected'
  estimated_amount: number
  description: string
  coverage_type: string
  coverage_level: string
  health_info?: Record<string, any>
  employment_status?: string
  industry?: string
  num_employees?: number
  annual_revenue?: number
  business_info?: Record<string, any>
  created_at: Date
  updated_at: Date
}

// JWT payload
export interface JWTPayload {
  sub: string // user id
  email: string
  iat: number
  exp: number
}

// Hono context with user
export interface AuthContext {
  user: {
    id: string
    email: string
  }
}
```

---

## Step 3: Create Middleware

### 3.1 Create backend/src/middleware/auth.ts

```typescript
import { Context, Next } from 'hono'
import { HTTPException } from 'hono/http-exception'
import jwt from 'jsonwebtoken'
import { JWTPayload, AuthContext } from '../types'

export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization')
  
  if (!authHeader?.startsWith('Bearer ')) {
    throw new HTTPException(401, { message: 'Missing or invalid token' })
  }

  const token = authHeader.slice(7)

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as JWTPayload
    
    c.set('user', {
      id: decoded.sub,
      email: decoded.email,
    })
    
    await next()
  } catch (error) {
    throw new HTTPException(401, { message: 'Invalid token' })
  }
}

// Helper to get user from context
export function getUser(c: Context) {
  return c.get('user') as AuthContext['user']
}
```

### 3.2 Create backend/src/middleware/errorHandler.ts

```typescript
import { Context } from 'hono'
import { HTTPException } from 'hono/http-exception'

export function errorHandler(err: Error, c: Context) {
  console.error('Error:', err)

  if (err instanceof HTTPException) {
    return c.json(
      { error: err.message || 'HTTP Exception' },
      err.status
    )
  }

  if (err instanceof Error) {
    return c.json(
      { error: err.message || 'Internal Server Error' },
      500
    )
  }

  return c.json({ error: 'Internal Server Error' }, 500)
}
```

---

## Step 4: Create Database Connection

### 4.1 Create backend/src/database/knex.ts

```typescript
import knex from 'knex'
import type { Knex } from 'knex'

const db = knex({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER || 'guardquote',
    password: process.env.DB_PASSWORD || 'guardquote',
    database: process.env.DB_NAME || 'guardquote',
  },
})

export default db
```

---

## Step 5: Create Services

### 5.1 Create backend/src/services/authService.ts

```typescript
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../database/knex'
import { User, RegisterRequest, LoginRequest, AuthResponse, UserResponse } from '../types'

const JWT_SECRET = process.env.JWT_SECRET || 'secret'
const JWT_EXPIRES_IN = '7d'

export async function registerUser(data: RegisterRequest): Promise<AuthResponse> {
  // Check if user exists
  const existing = await db('users').where('email', data.email).first()
  if (existing) {
    throw new Error('User already exists')
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(data.password, 10)

  // Create user
  const [user] = await db('users')
    .insert({
      email: data.email,
      password: hashedPassword,
      first_name: data.first_name,
      last_name: data.last_name,
      user_type: data.user_type || 'individual',
    })
    .returning('*')

  // Generate token
  const token = generateToken(user.id, user.email)

  return {
    access_token: token,
    user: formatUser(user),
  }
}

export async function loginUser(data: LoginRequest): Promise<AuthResponse> {
  // Find user
  const user = await db('users').where('email', data.email).first()
  if (!user) {
    throw new Error('Invalid email or password')
  }

  // Check password
  const isValid = await bcrypt.compare(data.password, user.password)
  if (!isValid) {
    throw new Error('Invalid email or password')
  }

  // Generate token
  const token = generateToken(user.id, user.email)

  return {
    access_token: token,
    user: formatUser(user),
  }
}

export async function getUserById(id: string): Promise<UserResponse> {
  const user = await db('users').where('id', id).first()
  if (!user) {
    throw new Error('User not found')
  }
  return formatUser(user)
}

// Helpers
function generateToken(userId: string, email: string): string {
  return jwt.sign(
    { sub: userId, email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  )
}

function formatUser(user: User): UserResponse {
  const { password, ...rest } = user
  return rest
}
```

### 5.2 Create backend/src/services/userService.ts

```typescript
import db from '../database/knex'
import { User, UserResponse } from '../types'

function formatUser(user: User): UserResponse {
  const { password, ...rest } = user
  return rest
}

export async function getAllUsers(): Promise<UserResponse[]> {
  const users = await db('users').select('*')
  return users.map(formatUser)
}

export async function getUserById(id: string): Promise<UserResponse> {
  const user = await db('users').where('id', id).first()
  if (!user) {
    throw new Error('User not found')
  }
  return formatUser(user)
}
```

### 5.3 Create backend/src/services/quoteService.ts

```typescript
import db from '../database/knex'
import { Quote } from '../types'

export async function getUserQuotes(userId: string): Promise<Quote[]> {
  return db('quotes').where('user_id', userId).orderBy('created_at', 'desc')
}

export async function getQuoteById(id: string, userId: string): Promise<Quote> {
  const quote = await db('quotes')
    .where('id', id)
    .andWhere('user_id', userId)
    .first()
  
  if (!quote) {
    throw new Error('Quote not found')
  }
  
  return quote
}

export async function createQuote(
  userId: string,
  data: Partial<Quote>
): Promise<Quote> {
  const [quote] = await db('quotes')
    .insert({
      user_id: userId,
      ...data,
      status: 'pending',
    })
    .returning('*')
  
  return quote
}

export async function updateQuote(
  id: string,
  userId: string,
  data: Partial<Quote>
): Promise<Quote> {
  const [quote] = await db('quotes')
    .where('id', id)
    .andWhere('user_id', userId)
    .update(data)
    .returning('*')
  
  if (!quote) {
    throw new Error('Quote not found')
  }
  
  return quote
}

export async function deleteQuote(id: string, userId: string): Promise<void> {
  const result = await db('quotes')
    .where('id', id)
    .andWhere('user_id', userId)
    .delete()
  
  if (result === 0) {
    throw new Error('Quote not found')
  }
}
```

---

## Step 6: Create Routes

### 6.1 Create backend/src/routes/auth.ts

```typescript
import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import * as authService from '../services/authService'
import { RegisterRequest, LoginRequest } from '../types'

const auth = new Hono()

auth.post('/register', async (c) => {
  try {
    const body = (await c.req.json()) as RegisterRequest
    
    if (!body.email || !body.password || !body.first_name || !body.last_name) {
      throw new HTTPException(400, { message: 'Missing required fields' })
    }
    
    const result = await authService.registerUser(body)
    return c.json(result, 201)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Registration failed'
    throw new HTTPException(400, { message })
  }
})

auth.post('/login', async (c) => {
  try {
    const body = (await c.req.json()) as LoginRequest
    
    if (!body.email || !body.password) {
      throw new HTTPException(400, { message: 'Missing email or password' })
    }
    
    const result = await authService.loginUser(body)
    return c.json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed'
    throw new HTTPException(401, { message })
  }
})

export default auth
```

### 6.2 Create backend/src/routes/users.ts

```typescript
import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import * as userService from '../services/userService'
import { authMiddleware, getUser } from '../middleware/auth'

const users = new Hono()

// Get all users
users.get('/', async (c) => {
  try {
    const allUsers = await userService.getAllUsers()
    return c.json(allUsers)
  } catch (error) {
    throw new HTTPException(500, { message: 'Failed to fetch users' })
  }
})

// Get current user (protected)
users.get('/me', authMiddleware, async (c) => {
  try {
    const user = getUser(c)
    const userData = await userService.getUserById(user.id)
    return c.json(userData)
  } catch (error) {
    throw new HTTPException(404, { message: 'User not found' })
  }
})

export default users
```

### 6.3 Create backend/src/routes/quotes.ts

```typescript
import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import * as quoteService from '../services/quoteService'
import { authMiddleware, getUser } from '../middleware/auth'
import { Quote } from '../types'

const quotes = new Hono()

// Get user's quotes (protected)
quotes.get('/', authMiddleware, async (c) => {
  try {
    const user = getUser(c)
    const userQuotes = await quoteService.getUserQuotes(user.id)
    return c.json(userQuotes)
  } catch (error) {
    throw new HTTPException(500, { message: 'Failed to fetch quotes' })
  }
})

// Get quote by ID (protected)
quotes.get('/:id', authMiddleware, async (c) => {
  try {
    const user = getUser(c)
    const id = c.req.param('id')
    const quote = await quoteService.getQuoteById(id, user.id)
    return c.json(quote)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch quote'
    throw new HTTPException(404, { message })
  }
})

// Create quote (protected)
quotes.post('/', authMiddleware, async (c) => {
  try {
    const user = getUser(c)
    const body = (await c.req.json()) as Partial<Quote>
    
    if (!body.quote_type || !body.coverage_type) {
      throw new HTTPException(400, { message: 'Missing required fields' })
    }
    
    const quote = await quoteService.createQuote(user.id, body)
    return c.json(quote, 201)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create quote'
    throw new HTTPException(400, { message })
  }
})

// Update quote (protected)
quotes.patch('/:id', authMiddleware, async (c) => {
  try {
    const user = getUser(c)
    const id = c.req.param('id')
    const body = (await c.req.json()) as Partial<Quote>
    
    const quote = await quoteService.updateQuote(id, user.id, body)
    return c.json(quote)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update quote'
    throw new HTTPException(400, { message })
  }
})

// Delete quote (protected)
quotes.delete('/:id', authMiddleware, async (c) => {
  try {
    const user = getUser(c)
    const id = c.req.param('id')
    
    await quoteService.deleteQuote(id, user.id)
    return c.json({ message: 'Quote deleted' })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete quote'
    throw new HTTPException(400, { message })
  }
})

export default quotes
```

---

## Step 7: Test the Migration

### 7.1 Start the Hono backend

```bash
cd backend
bun install
bun run dev
```

Should see:
```
🚀 Server running on http://localhost:3000
```

### 7.2 Test health endpoint

```bash
curl http://localhost:3000/health
# Expected: {"status":"ok","timestamp":"..."}
```

### 7.3 Test auth endpoints

```bash
# Register
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!",
    "first_name": "John",
    "last_name": "Doe"
  }'

# Should return: { "access_token": "...", "user": {...} }
```

### 7.4 Test protected endpoint

```bash
# Use token from register/login
curl http://localhost:3000/users/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Step 8: Migration Checklist

- [ ] Created backend/package.json with Hono deps
- [ ] Created backend/tsconfig.json
- [ ] Created backend/.env.example
- [ ] Created backend/src/index.ts
- [ ] Created all TypeScript types
- [ ] Created middleware (auth, errorHandler)
- [ ] Created database connection
- [ ] Created services (auth, users, quotes)
- [ ] Created all route handlers
- [ ] Tested health endpoint
- [ ] Tested register endpoint
- [ ] Tested login endpoint
- [ ] Tested protected endpoints
- [ ] Verified CORS working
- [ ] Verified database operations
- [ ] All endpoints respond with correct format

---

## Step 9: Cleanup

Once migration is complete and tested:

```bash
# Remove old NestJS files
rm -rf backend/src/app.module.ts
rm -rf backend/src/main.ts
rm -rf backend/src/auth/
rm -rf backend/src/users/
rm -rf backend/src/quotes/

# Commit changes
git add .
git commit -m "refactor: Migrate backend from NestJS to Hono"
```

---

## Troubleshooting

### Import/Module errors
**Solution**: Ensure backend has `"type": "module"` in package.json

### Database connection errors
**Solution**: Check .env file has correct DB credentials

### CORS errors
**Solution**: Verify FRONTEND_URL in .env matches your frontend URL

### Token errors
**Solution**: Ensure JWT_SECRET is set in .env

### TypeScript errors
**Solution**: Run `bun install` to ensure @types packages are installed

---

## Next Steps

1. After successful migration, proceed to Phase 2: Bun Integration
2. Read BUNCHMARK.md for Bun setup
3. Then Phase 3: Cloudflare Tunnels (CLOUDFLARE_TUNNELS.md)

---

**Status**: Migration complete!
**Next Doc**: BUNCHMARK.md (Bun Integration)
