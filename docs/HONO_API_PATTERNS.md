# Hono API Patterns & Code Examples

Quick reference for common Hono patterns used in GuardQuote migration.

---

## Basic Route Patterns

### Simple GET Route
```typescript
app.get('/status', (c) => {
  return c.json({ status: 'ok' })
})
```

### Route with URL Parameter
```typescript
app.get('/users/:id', async (c) => {
  const id = c.req.param('id')
  const user = await db('users').where('id', id).first()
  return c.json(user)
})
```

### Route with Query Parameters
```typescript
app.get('/quotes', (c) => {
  const limit = c.req.query('limit') || '10'
  const offset = c.req.query('offset') || '0'
  return c.json({ limit, offset })
})
```

### POST Route with Body
```typescript
app.post('/users', async (c) => {
  const body = await c.req.json()
  const [user] = await db('users').insert(body).returning('*')
  return c.json(user, 201)
})
```

---

## Middleware Patterns

### Custom Middleware Function
```typescript
async function customMiddleware(c, next) {
  console.log('Before request')
  await next()
  console.log('After request')
}

app.use(customMiddleware)
```

### Conditional Middleware
```typescript
async function optionalAuth(c, next) {
  const token = c.req.header('Authorization')
  if (token) {
    try {
      const user = jwt.verify(token.slice(7), SECRET)
      c.set('user', user)
    } catch (e) {
      // Continue without auth
    }
  }
  await next()
}
```

### Middleware for Specific Routes
```typescript
app.get('/protected', authMiddleware, async (c) => {
  const user = c.get('user')
  return c.json({ user })
})
```

---

## Error Handling Patterns

### Try-Catch with HTTPException
```typescript
app.post('/quotes', authMiddleware, async (c) => {
  try {
    const data = await c.req.json()
    const quote = await createQuote(data)
    return c.json(quote, 201)
  } catch (error) {
    throw new HTTPException(400, { 
      message: error instanceof Error ? error.message : 'Bad request' 
    })
  }
})
```

### Validation Error Response
```typescript
app.post('/auth/register', async (c) => {
  const { email, password } = await c.req.json()
  
  if (!email || !password) {
    throw new HTTPException(400, {
      message: 'Email and password required'
    })
  }
  
  if (password.length < 8) {
    throw new HTTPException(400, {
      message: 'Password must be at least 8 characters'
    })
  }
  
  // Continue...
})
```

---

## Database Patterns

### Select Single Record
```typescript
const user = await db('users')
  .where('id', userId)
  .first()
```

### Select Multiple Records
```typescript
const quotes = await db('quotes')
  .where('user_id', userId)
  .orderBy('created_at', 'desc')
```

### Insert and Return
```typescript
const [quote] = await db('quotes')
  .insert({ user_id: userId, ...data })
  .returning('*')
```

### Update and Return
```typescript
const [updated] = await db('quotes')
  .where('id', quoteId)
  .update(data)
  .returning('*')
```

### Delete
```typescript
const deleted = await db('quotes')
  .where('id', quoteId)
  .andWhere('user_id', userId)
  .delete()

if (deleted === 0) {
  throw new Error('Not found')
}
```

### Transaction
```typescript
const result = await db.transaction(async (trx) => {
  const user = await trx('users').insert(userData).returning('*')
  const quote = await trx('quotes')
    .insert({ user_id: user[0].id, ...quoteData })
    .returning('*')
  return { user: user[0], quote: quote[0] }
})
```

---

## Authentication Patterns

### JWT Token Generation
```typescript
import jwt from 'jsonwebtoken'

function generateToken(userId: string, email: string) {
  return jwt.sign(
    { sub: userId, email },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '7d' }
  )
}
```

### JWT Verification in Middleware
```typescript
async function authMiddleware(c, next) {
  const auth = c.req.header('Authorization')
  if (!auth?.startsWith('Bearer ')) {
    throw new HTTPException(401, { message: 'Missing token' })
  }
  
  try {
    const token = auth.slice(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret')
    c.set('user', decoded)
  } catch (error) {
    throw new HTTPException(401, { message: 'Invalid token' })
  }
  
  await next()
}
```

### Password Hashing
```typescript
import bcrypt from 'bcryptjs'

// Hash password
const hashed = await bcrypt.hash(password, 10)

// Verify password
const isValid = await bcrypt.compare(password, hashed)
```

---

## Response Patterns

### JSON Response
```typescript
return c.json({ message: 'Success' })
```

### JSON with Status Code
```typescript
return c.json({ data: user }, 201) // Created
return c.json({ data: quote }, 200) // OK
```

### Empty Response
```typescript
return c.body(null, 204) // No Content
```

### Error Response
```typescript
throw new HTTPException(404, { message: 'Not found' })
throw new HTTPException(400, { message: 'Bad request' })
throw new HTTPException(401, { message: 'Unauthorized' })
throw new HTTPException(500, { message: 'Server error' })
```

---

## Route Organization Patterns

### Sub-router Pattern (Used in GuardQuote)
```typescript
// auth.ts
const auth = new Hono()

auth.post('/register', async (c) => {
  // Register logic
})

auth.post('/login', async (c) => {
  // Login logic
})

export default auth

// index.ts
app.route('/auth', authRoutes)    // Mounts at /auth/*
app.route('/users', userRoutes)   // Mounts at /users/*
app.route('/quotes', quoteRoutes) // Mounts at /quotes/*
```

---

## CORS Patterns

### Basic CORS
```typescript
import { cors } from 'hono/cors'

app.use(cors())  // Allow all origins
```

### Restricted CORS (Recommended)
```typescript
app.use(
  cors({
    origin: 'http://localhost:5174',
    credentials: true,
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization']
  })
)
```

### Multiple Origins
```typescript
app.use(
  cors({
    origin: (origin) => {
      const allowed = ['http://localhost:5174', 'https://example.com']
      return allowed.includes(origin) ? origin : 'http://localhost:5174'
    }
  })
)
```

---

## Testing Patterns

### Test Basic Route
```typescript
import { describe, it, expect } from 'bun:test'
import app from '../src/index'

describe('GET /health', () => {
  it('should return ok status', async () => {
    const response = await app.request('/health')
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data.status).toBe('ok')
  })
})
```

### Test Protected Route
```typescript
it('should require auth token', async () => {
  const response = await app.request('/users/me', {
    method: 'GET'
  })
  
  expect(response.status).toBe(401)
})
```

---

## Common Comparison: NestJS → Hono

### Controller Class → Route Handler
```typescript
// NestJS
@Controller('quotes')
export class QuotesController {
  @Get(':id')
  getQuote(@Param('id') id: string) {
    return this.service.get(id)
  }
}

// Hono
quotes.get('/:id', async (c) => {
  const id = c.req.param('id')
  return c.json(await quoteService.getQuote(id))
})
```

### Injectable Service → Standalone Function
```typescript
// NestJS
@Injectable()
export class QuoteService {
  async getQuote(id: string) { }
}

// Hono
export async function getQuote(id: string) { }
```

### Module Decorator → Router Instance
```typescript
// NestJS
@Module({
  imports: [],
  controllers: [QuotesController],
  providers: [QuotesService],
})
export class QuotesModule {}

// Hono
const quotes = new Hono()
quotes.get('/:id', async (c) => { })
export default quotes
```

---

## Hono vs NestJS Quickstart

| Need | NestJS | Hono |
|------|--------|------|
| Create app | `NestFactory.create()` | `new Hono()` |
| Add route | `@Get()` decorator | `app.get()` method |
| Get param | `@Param('id')` | `c.req.param('id')` |
| Get body | `@Body()` | `await c.req.json()` |
| Return JSON | Automatic | `c.json()` |
| Status code | `@HttpCode(201)` | `c.json(data, 201)` |
| Middleware | `@UseGuards()` | `app.use()` |
| Error handle | `@Catch()` | `app.onError()` |
| Service | Inject via DI | Regular function |
| Testing | Jest | Bun:test |

---

## Performance Tips

### Use .first() for Single Records
```typescript
// Good - returns single object
const user = await db('users').where('id', id).first()

// Bad - returns array, slower
const [user] = await db('users').where('id', id).limit(1)
```

### Use Indexes on Frequently Queried Columns
```typescript
// Migration example
await db.schema.createTable('users', (table) => {
  table.increments('id')
  table.string('email').unique().index()  // Index on email
  table.timestamps()
})
```

### Avoid N+1 Queries
```typescript
// Bad - N+1 queries
const quotes = await db('quotes').where('user_id', userId)
for (const quote of quotes) {
  quote.user = await db('users').where('id', userId).first()
}

// Good - single query
const quotes = await db('quotes')
  .where('user_id', userId)
  .join('users', 'quotes.user_id', 'users.id')
  .select('quotes.*', 'users.first_name', 'users.last_name')
```

---

## Debugging

### Enable Request Logging
```typescript
import { logger } from 'hono/logger'

app.use(logger())  // Shows all requests in console
```

### Manual Logging
```typescript
app.get('/debug', async (c) => {
  const body = await c.req.json()
  console.log('Request body:', body)
  console.log('Headers:', c.req.header())
  return c.json({ debug: 'ok' })
})
```

### Check Context Values
```typescript
app.get('/check', async (c) => {
  const user = c.get('user')
  console.log('User from context:', user)
  return c.json({ user })
})
```

---

**Quick Link**: Back to HONO_MIGRATION_GUIDE.md

---

## Zod Validation (Input Validation)

Zod is a schema validation library perfect for Hono API validation.

### Basic Zod Schema
```typescript
import { z } from 'zod'

// Define schema for request body
const RegisterSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password min 8 chars'),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  user_type: z.enum(['individual', 'business']).optional(),
})

type RegisterInput = z.infer<typeof RegisterSchema>
```

### Using Zod in Hono Routes
```typescript
app.post('/auth/register', async (c) => {
  try {
    const body = await c.req.json()
    
    // Validate with Zod
    const data = RegisterSchema.parse(body)
    
    // Now 'data' is type-safe and validated
    const result = await registerUser(data)
    return c.json(result, 201)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new HTTPException(400, {
        message: 'Validation failed',
        details: error.errors
      })
    }
    throw error
  }
})
```

### Zod Validation Helper
```typescript
function createValidationMiddleware<T>(schema: z.ZodSchema<T>) {
  return async (c: Context, next: Next) => {
    try {
      const body = await c.req.json()
      const data = schema.parse(body)
      c.set('validatedBody', data)
      await next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new HTTPException(400, { message: 'Invalid request' })
      }
      throw error
    }
  }
}
```

### Common Zod Patterns
```typescript
import { z } from 'zod'

// String validation
const email = z.string().email()
const password = z.string().min(8).max(128)
const username = z.string().regex(/^[a-zA-Z0-9_]+$/)

// Number validation
const age = z.number().min(18).max(150)
const price = z.number().positive().multipleOf(0.01)

// Enum validation
const status = z.enum(['pending', 'approved', 'rejected'])

// Optional fields
const company = z.string().optional()
const phone = z.string().nullable()

// Nested objects
const address = z.object({
  street: z.string(),
  city: z.string(),
  zipcode: z.string(),
})

// Arrays
const tags = z.array(z.string()).min(1)
const quotes = z.array(z.object({ id: z.string() }))

// Union types
const notification = z.union([
  z.object({ type: z.literal('email'), email: z.string() }),
  z.object({ type: z.literal('sms'), phone: z.string() }),
])
```

---

## API Gateway Pattern (Future Implementation)

Your teammate will implement an API Gateway later. Here's how Hono integrates with it:

### API Gateway Architecture
```
Client
  ↓
API Gateway (Future - Kong, API7, etc.)
  ↓ Routes requests
  ├→ /auth → Auth Service (Hono)
  ├→ /users → User Service (Hono)
  ├→ /quotes → Quote Service (Hono)
  └→ /ml → ML Service (Python FastAPI)
  ↓
Backend Services
```

### Preparing Hono for API Gateway

**1. Version Your API**
```typescript
// routes/auth.ts
const auth = new Hono().basePath('/v1')

auth.post('/auth/register', async (c) => { ... })
// Accessible at: /v1/auth/register
```

**2. Add Standard Headers**
```typescript
app.use(async (c, next) => {
  await next()
  c.header('X-API-Version', '1.0')
  c.header('X-Service', 'guardian-backend')
})
```

**3. Structure for Multiple Services**
```typescript
// index.ts
const v1 = new Hono()

// Mount all routes under v1
v1.route('/auth', authRoutes)
v1.route('/users', usersRoutes)
v1.route('/quotes', quotesRoutes)

app.route('/api/v1', v1)
// Routes accessible at: /api/v1/auth/register, etc.
```

**4. Health Check for Gateway**
```typescript
app.get('/health', (c) => {
  return c.json({
    status: 'healthy',
    service: 'backend',
    version: '1.0.0',
    uptime: process.uptime(),
  })
})
```

**5. Request ID Tracking (for logging through gateway)**
```typescript
import { crypto } from 'node:crypto'

app.use(async (c, next) => {
  const requestId = c.req.header('X-Request-ID') || crypto.randomUUID()
  c.set('requestId', requestId)
  c.header('X-Request-ID', requestId)
  await next()
})
```

### Notes for API Gateway Integration
- Hono can run behind any gateway (Kong, API7, Traefik, etc.)
- Keep services stateless (good for scaling)
- Use consistent error responses
- Include version in API paths
- Implement health checks
- Use request IDs for tracing

---

## Zod + Hono + API Gateway Example

Complete example combining all three:

```typescript
import { Hono } from 'hono'
import { z } from 'zod'
import { HTTPException } from 'hono/http-exception'

// Schema
const CreateQuoteSchema = z.object({
  quote_type: z.enum(['individual', 'business']),
  coverage_type: z.string().min(1),
  coverage_level: z.string().min(1),
  estimated_amount: z.number().positive(),
  description: z.string().optional(),
})

type CreateQuoteInput = z.infer<typeof CreateQuoteSchema>

// Validation helper
function validateBody<T>(schema: z.ZodSchema<T>) {
  return async (c: Context, next: Next) => {
    try {
      const body = await c.req.json()
      const data = schema.parse(body)
      c.set('validatedBody', data)
      await next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new HTTPException(400, {
          message: 'Invalid request body',
          errors: error.errors,
        })
      }
      throw error
    }
  }
}

// Route
const quotes = new Hono()

quotes.post(
  '/',
  authMiddleware,
  validateBody(CreateQuoteSchema),
  async (c) => {
    const user = getUser(c)
    const data = c.get('validatedBody') as CreateQuoteInput
    
    // data is now type-safe and validated
    const quote = await quoteService.createQuote(user.id, data)
    return c.json(quote, 201)
  }
)

export default quotes
```

---

**Note**: Zod integration and API Gateway patterns are ready for future implementation!
