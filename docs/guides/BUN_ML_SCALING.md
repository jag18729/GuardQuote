# Bun + ML Engine Scaling Strategy

**Purpose**: Leverage Bun's performance for handling high-volume generated quotes data and ML processing
**Status**: Documentation for implementation
**Priority**: HIGH - Critical for ML performance and scaling

---

## Architecture: Bun Backend + ML Engine

```
┌─────────────────────────────────────────────────────────────────┐
│                    Generated Quotes Flow                        │
└─────────────────────────────────────────────────────────────────┘

User/System
    ↓
    │ Create/Generate Quote (JSON)
    ↓
Hono API (Bun Runtime)
├─ 50ms startup (vs 1.2s NestJS)
├─ High throughput (Bun handles concurrent requests efficiently)
├─ Type validation (Zod)
└─ Queue/batch requests
    ↓
Quote Database (PostgreSQL)
├─ Store generated quotes
├─ Track ML predictions
└─ Store feature data
    ↓
ML Engine (Python FastAPI)
├─ Process quotes in batches
├─ Extract features
├─ Run XGBoost model
└─ Return predictions/scores
    ↓
Response to User
└─ Quote with ML-generated pricing
```

---

## Why Bun for Scaling?

### Performance Advantages

| Metric | NestJS | Hono + Bun | Benefit |
|--------|--------|-----------|---------|
| Startup | 1.2s | 50ms | **24x faster cold starts** |
| Memory | ~120 MB | ~30 MB | **75% less memory** |
| Requests/sec | ~2,000 | ~8,000+ | **4x more throughput** |
| P95 latency | 150ms | 25ms | **6x faster responses** |
| Bundle | 5.2 MB | 50 KB | **99% smaller** |

### Scaling with Bun

1. **Fast Request Processing**: Handle 4-8x more concurrent requests
2. **Lower Memory Footprint**: Run more instances on same hardware
3. **Native TypeScript**: No compilation overhead per request
4. **Built-in Streaming**: Handle large generated datasets
5. **Worker Threads**: Process quotes in parallel efficiently

---

## Generated Quotes Data Flow

### Scenario: Batch Quote Generation

**Generate 1,000 quotes** → Process through ML → Return predictions

```typescript
// Generate quotes (Bun handles efficiently)
async function generateAndProcessQuotes(batchSize: number = 1000) {
  // 1. Generate quotes (fast with Bun)
  const quotes = await generateQuotes(batchSize)  // 50-100ms with Bun
  
  // 2. Validate with Zod (type-safe)
  const validated = quotes.map(q => QuoteSchema.parse(q))
  
  // 3. Store in database (batch insert)
  const stored = await db('quotes')
    .insert(validated)
    .returning('*')
  
  // 4. Send to ML engine (in chunks)
  const predictions = await mlEngine.predictBatch(stored)
  
  // 5. Update quotes with ML results
  await updateQuotesWithPredictions(stored, predictions)
  
  return { processed: stored.length, time: '250ms' }
}
```

**Bun Advantage**: 250ms for 1,000 quotes vs ~2-3s with NestJS

---

## ML Engine Integration

### High-Volume Quote Processing

```typescript
// routes/quotes.ts
import { db } from '../database/knex'
import { mlClient } from '../services/mlClient'

quotes.post('/batch-generate', async (c) => {
  try {
    // 1. Extract parameters
    const { count = 100, params = {} } = await c.req.json()
    
    // 2. Generate quotes locally (fast)
    const generated = generateQuoteTemplates(count, params)
    
    // 3. Store in DB immediately (batch insert)
    const stored = await db('quotes')
      .insert(generated.map(q => ({
        ...q,
        status: 'pending_ml',
        user_id: getUser(c).id,
      })))
      .returning('*')
    
    // 4. Process through ML asynchronously
    mlClient.predictAsync(stored.map(q => ({
      id: q.id,
      features: extractFeatures(q),
    })))
    
    // 5. Return immediately with processing status
    return c.json({
      created: stored.length,
      processing: true,
      estimatedTime: '2-5 seconds',
    }, 202) // 202 Accepted
  } catch (error) {
    throw new HTTPException(400, { message: 'Batch generation failed' })
  }
})
```

### Async ML Processing

```typescript
// services/mlClient.ts
export class MLClient {
  async predictAsync(quotes: QuoteFeature[]) {
    // 1. Send to ML engine (non-blocking)
    try {
      const response = await fetch('http://ml-engine:8000/predict/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quotes),
      })
      
      const predictions = await response.json()
      
      // 2. Store predictions back in database
      for (const pred of predictions) {
        await db('quotes')
          .where('id', pred.quote_id)
          .update({
            ml_prediction: pred.prediction,
            ml_confidence: pred.confidence,
            ml_processed_at: new Date(),
            status: 'ml_processed',
          })
      }
      
      return predictions
    } catch (error) {
      console.error('ML prediction failed:', error)
      // Retry logic or fallback
    }
  }
  
  // Batch processing with streaming
  async *predictStream(quotesIterator: AsyncIterableIterator<Quote>) {
    const batch = []
    const BATCH_SIZE = 50
    
    for await (const quote of quotesIterator) {
      batch.push(quote)
      
      if (batch.length >= BATCH_SIZE) {
        const predictions = await this.predictAsync(batch)
        yield predictions
        batch.length = 0
      }
    }
    
    // Process remaining
    if (batch.length > 0) {
      yield await this.predictAsync(batch)
    }
  }
}
```

---

## Bun-Specific Optimizations

### 1. Worker Threads for Parallel Processing

```typescript
// Process multiple quote batches in parallel
import { Worker } from 'worker_threads'

async function processQuotesParallel(quotes: Quote[]) {
  const numWorkers = 4 // CPU cores
  const chunkSize = Math.ceil(quotes.length / numWorkers)
  
  const workers = Array.from({ length: numWorkers }, (_, i) => {
    return new Promise((resolve) => {
      const worker = new Worker('./quote-processor.ts')
      const chunk = quotes.slice(i * chunkSize, (i + 1) * chunkSize)
      
      worker.on('message', (result) => {
        resolve(result)
        worker.terminate()
      })
      
      worker.postMessage(chunk)
    })
  })
  
  return Promise.all(workers)
}
```

### 2. Streaming Large Datasets

```typescript
// Handle large quote CSV imports
app.post('/import-quotes', async (c) => {
  const file = (await c.req.formData()).get('file')
  
  // Stream processing with Bun
  const buffer = await file.arrayBuffer()
  const text = new TextDecoder().decode(buffer)
  const lines = text.split('\n')
  
  for (let i = 0; i < lines.length; i += 1000) {
    const chunk = lines.slice(i, i + 1000)
    const parsed = chunk.map(parseQuoteCSV)
    const validated = parsed.map(q => QuoteSchema.parse(q))
    
    await db('quotes').insert(validated)
    
    // Keep event loop responsive
    await new Promise(resolve => setImmediate(resolve))
  }
  
  return c.json({ imported: lines.length })
})
```

### 3. Native Bun APIs for Performance

```typescript
// Use Bun's built-in APIs for better performance
import { file } from 'bun'

// Fast file operations
async function loadQuoteTemplate(path: string) {
  const content = await file(path).text()
  return JSON.parse(content)
}

// Fast JSON operations
const quotes = [{ id: 1, amount: 500 }, { id: 2, amount: 750 }]
const json = JSON.stringify(quotes)  // Optimized in Bun
const parsed = JSON.parse(json)      // Faster parsing
```

---

## ML Pipeline Optimization

### Feature Extraction at Scale

```typescript
// services/featureExtractor.ts
export class FeatureExtractor {
  // Cache commonly extracted features
  private featureCache = new Map()
  
  extractFeatures(quote: Quote): MLFeatures {
    const cacheKey = `${quote.type}:${quote.coverage}`
    
    if (this.featureCache.has(cacheKey)) {
      return { ...this.featureCache.get(cacheKey), quote_id: quote.id }
    }
    
    const features = {
      quote_id: quote.id,
      // User features
      user_age_group: this.ageToGroup(quote.user_age),
      revenue_per_employee: quote.annual_revenue / quote.num_employees,
      
      // Quote features
      coverage_to_revenue_ratio: quote.estimated_amount / quote.annual_revenue,
      business_age_years: this.calculateAge(quote.founded_at),
      
      // Risk features
      risk_score: this.calculateRiskScore(quote),
      
      // Derived features
      normalized_amount: this.normalize(quote.estimated_amount),
    }
    
    // Cache base features (without quote_id)
    this.featureCache.set(cacheKey, { ...features, quote_id: null })
    
    return features
  }
  
  // Batch extraction with caching
  extractBatch(quotes: Quote[]): MLFeatures[] {
    // Bun can process this in parallel
    return quotes.map(q => this.extractFeatures(q))
  }
}
```

### Connection Pooling to ML Service

```typescript
// services/mlClient.ts
export class MLClient {
  private connectionPool: Set<AbortController> = new Set()
  private maxConnections = 10
  
  async predictBatch(features: MLFeatures[], timeout = 30000) {
    if (this.connectionPool.size >= this.maxConnections) {
      // Wait for available connection
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)
    this.connectionPool.add(controller)
    
    try {
      const response = await fetch('http://ml-engine:8000/predict/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Batch-Size': features.length.toString(),
        },
        body: JSON.stringify(features),
        signal: controller.signal,
      })
      
      const predictions = await response.json()
      return predictions
    } finally {
      clearTimeout(timeoutId)
      this.connectionPool.delete(controller)
    }
  }
}
```

---

## Database Optimization for Generated Quotes

### Batch Inserts (Much Faster)

```typescript
// BAD: Individual inserts
for (const quote of quotes) {
  await db('quotes').insert(quote)  // N queries
}

// GOOD: Batch insert (use this with Bun)
const insertedQuotes = await db('quotes')
  .insert(quotes)
  .returning('*')  // Get generated IDs

// Time: 1000 quotes
// Bad: ~2-3 seconds (1000 queries)
// Good: ~100ms (1 batch query)
```

### Indexes for ML Queries

```typescript
// Migration: Create indexes for ML queries
exports.up = async (knex) => {
  await knex.schema.table('quotes', (table) => {
    // ML processing indexes
    table.index('status')  // Find pending ML quotes
    table.index('created_at')  // Time-series analysis
    table.index('user_id')  // User-specific quotes
    
    // ML features index (if stored)
    table.index('ml_processed_at')
    table.index('ml_confidence')
  })
}
```

### Query Optimization

```typescript
// Get quotes ready for ML processing
const pendingQuotes = await db('quotes')
  .where('status', 'pending_ml')
  .where('created_at', '>', knex.raw('NOW() - INTERVAL \'1 hour\''))
  .select(['id', 'user_id', 'coverage_type', 'estimated_amount'])  // Only needed columns
  .limit(1000)
  .orderBy('created_at', 'asc')
```

---

## Monitoring & Metrics

### Track Generated Quotes Performance

```typescript
// middleware/metrics.ts
export async function metricsMiddleware(c, next) {
  const start = performance.now()
  const path = c.req.path
  
  await next()
  
  const duration = performance.now() - start
  
  // Track metrics
  metrics.recordHistogram('request_duration_ms', duration, {
    path,
    method: c.req.method,
  })
  
  // ML-specific metrics
  if (path.includes('/quotes')) {
    metrics.recordCounter('quotes_processed', 1)
  }
}

// Example metrics to track
{
  'quotes_generated_per_minute': 150,
  'ml_predictions_per_minute': 145,
  'avg_ml_latency_ms': 1500,
  'quotes_queue_depth': 50,
  'database_insert_time_ms': 45,
  'ml_connection_pool_usage': 7/10,
}
```

---

## Scaling Considerations

### Vertical Scaling (One Server)
- Bun runs 4-8x more efficiently than NestJS
- Can handle 8,000+ requests/sec on single core
- Lower memory = run more worker processes

### Horizontal Scaling
```typescript
// With load balancer
User → Load Balancer
       ├→ Hono Server 1 (Bun)
       ├→ Hono Server 2 (Bun)
       ├→ Hono Server 3 (Bun)
       └→ Hono Server 4 (Bun)
              ↓
        ML Engine (shared)
              ↓
        PostgreSQL (shared)
```

### Queue Processing for Large Batches

```typescript
// Use Redis queue for generated quotes
import { Queue } from 'bullmq'

const quoteQueue = new Queue('quotes', {
  connection: {
    host: 'localhost',
    port: 6379,
  },
})

// Add quotes to queue
app.post('/generate-quotes', async (c) => {
  const { count } = await c.req.json()
  
  await quoteQueue.add('batch-generate', { count }, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 },
  })
  
  return c.json({ queued: true }, 202)
})

// Process in background worker
quoteQueue.process(async (job) => {
  const quotes = generateQuotes(job.data.count)
  const stored = await db('quotes').insert(quotes)
  const predictions = await mlEngine.predict(stored)
  return { processed: stored.length }
})
```

---

## Code Examples: Complete Flow

### Generate, Store, Predict

```typescript
// Complete example with Bun optimizations
import { Hono } from 'hono'
import { z } from 'zod'
import { db } from '../database/knex'
import { mlClient } from '../services/mlClient'
import { featureExtractor } from '../services/featureExtractor'

const GenerateSchema = z.object({
  count: z.number().min(1).max(1000),
  user_id: z.string(),
})

const quotes = new Hono()

quotes.post('/generate-batch', authMiddleware, async (c) => {
  const start = performance.now()
  
  try {
    const { count, user_id } = GenerateSchema.parse(await c.req.json())
    
    // 1. Generate quotes (fast with Bun)
    const generated = Array.from({ length: count }, (_, i) => ({
      user_id,
      coverage_type: pickRandom(['life', 'health', 'property']),
      coverage_level: pickRandom(['basic', 'standard', 'premium']),
      estimated_amount: Math.random() * 50000 + 1000,
      status: 'pending_ml',
      created_at: new Date(),
    }))
    
    // 2. Batch insert (much faster than individual inserts)
    const stored = await db('quotes')
      .insert(generated)
      .returning('*')
    
    // 3. Extract features
    const features = stored.map(q => featureExtractor.extractFeatures(q))
    
    // 4. Send to ML async (don't wait)
    mlClient.predictAsync(features).catch(err => console.error(err))
    
    const duration = performance.now() - start
    
    return c.json({
      created: stored.length,
      duration: `${Math.round(duration)}ms`,
      ml_processing: 'queued',
    }, 201)
  } catch (error) {
    throw new HTTPException(400, { message: 'Generation failed' })
  }
})

export default quotes
```

---

## Performance Targets

### With Bun + Hono

| Metric | Target | Notes |
|--------|--------|-------|
| Quote generation | 1000/sec | Memory-only generation |
| Database insert | 100ms/1000 | Batch insert optimized |
| ML prediction | 2-5sec/batch | Depends on batch size |
| Total throughput | 100-200 quotes/sec | End-to-end with ML |
| API response | <100ms | 202 Accepted for async |
| Memory usage | <100MB | Per Bun process |

---

## Implementation Roadmap

### Phase 1: Basic Integration
- [ ] Implement quote batch generation
- [ ] Add Zod validation
- [ ] Batch insert to database
- [ ] Async ML queue

### Phase 2: Optimization
- [ ] Add feature caching
- [ ] Connection pooling to ML engine
- [ ] Request metrics
- [ ] Error retry logic

### Phase 3: Scaling
- [ ] Load balancer setup
- [ ] Redis queue for large batches
- [ ] Database query optimization
- [ ] Horizontal scaling

### Phase 4: Monitoring
- [ ] Real-time metrics dashboard
- [ ] ML latency tracking
- [ ] Quote generation rates
- [ ] System performance alerts

---

## Key Takeaways

✅ **Bun handles high-volume quote generation efficiently**
✅ **Batch processing gives 10-100x speedup over individual inserts**
✅ **Async ML processing keeps API responsive**
✅ **Feature caching and pooling reduce latency**
✅ **Horizontal scaling easy with stateless Bun servers**
✅ **Native Bun APIs provide additional performance**

---

**Next Steps**: Implement during Phase 1 Hono migration with these patterns
