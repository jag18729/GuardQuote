# Bun Setup & Quick Start Guide

Fast setup guide for adopting Bun as your JavaScript runtime and package manager.

---

## What is Bun?

Bun is a fast JavaScript runtime designed to replace Node.js in your projects.

**Key Benefits**:
- ✅ 3x faster npm installs
- ✅ 24x faster startup (Hono: 50ms vs NestJS: 1.2s)
- ✅ Native TypeScript execution (no ts-node needed)
- ✅ Drop-in Node.js replacement
- ✅ Built-in testing framework
- ✅ Faster bundler

---

## Installation

### macOS
```bash
brew install bun
```

### Linux (Ubuntu/Debian)
```bash
curl -fsSL https://bun.sh/install | bash
```

### Linux (Fedora)
```bash
dnf install bun
```

### Windows
```bash
powershell -c "irm bun.sh/install.ps1 | iex"
```

### Verify Installation
```bash
bun --version
# Output: bun 1.x.x (or similar)
```

---

## npm → Bun Commands

| Task | npm | Bun |
|------|-----|-----|
| Install deps | `npm install` | `bun install` |
| Add package | `npm install pkg` | `bun add pkg` |
| Remove package | `npm uninstall pkg` | `bun remove pkg` |
| Run script | `npm run dev` | `bun run dev` |
| Run file | `node file.js` | `bun file.js` |
| Build | `npm run build` | `bun build` |
| Test | `npm test` | `bun test` |

**Result**: Exactly the same commands, just faster!

---

## Migrating from npm to Bun

### Step 1: Install Bun
```bash
# macOS
brew install bun

# Or other OS from above
```

### Step 2: Delete Old Lock Files
```bash
# Remove npm lock file
rm package-lock.json

# Remove old node_modules (optional but faster)
rm -rf node_modules
```

### Step 3: Install with Bun
```bash
bun install
# This creates bun.lockb (Bun's lock file)
```

### Step 4: Update Scripts (if needed)
Most npm scripts work unchanged. Just use `bun run` instead of `npm run`:

```bash
# Before
npm run dev

# After
bun run dev
```

### Step 5: Use Bun Everywhere
```bash
# Instead of: npm run dev:backend
bun run dev:backend

# Instead of: npm test
bun test

# Instead of: node src/index.js
bun src/index.js
```

---

## Working with Bun Lockfile

### bun.lockb
This is Bun's lock file (binary format, faster than package-lock.json).

**Always commit it**:
```bash
git add bun.lockb
git commit -m "update: Bun lockfile"
```

**Don't modify manually** - let `bun add/remove` handle it.

---

## Development Workflow with Bun

### Watch Mode (Auto-reload)
```bash
bun run --watch src/index.ts
```

Or in package.json:
```json
{
  "scripts": {
    "dev": "bun run --watch src/index.ts"
  }
}
```

### Run TypeScript Directly
```bash
# No compilation needed
bun src/file.ts
```

### Run Tests with Bun
```bash
# If you have bun test configured
bun test

# Or run specific test
bun test tests/auth.test.ts
```

---

## Performance Comparison

### Installation Speed
```bash
# npm (45 seconds)
npm install

# Bun (15 seconds) - 3x faster!
bun install
```

### Startup Time (Hono backend)
```bash
# NestJS (1.2 seconds)
npm run dev

# Hono with Bun (50ms) - 24x faster!
bun run dev
```

### File Size
```bash
# NestJS bundle (5.2 MB)
# Hono bundle (50 KB) - 99% smaller!
```

---

## Configuration

### bunfig.toml (Optional)
Create `bunfig.toml` in project root for custom settings:

```toml
[install]
# Use Bun's solver by default
auto-install = true

[build]
# Custom build settings
root = "src"
```

### Environment Variables
Bun reads from `.env` just like Node.js:

```bash
# .env
DATABASE_URL=postgresql://...
JWT_SECRET=your_secret

# In code
process.env.DATABASE_URL  # Works!
```

---

## Common Issues & Solutions

### Issue: "bun: command not found"
**Solution**: Bun not in PATH. Add to shell rc:
```bash
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"
```

Then source your rc file or restart terminal.

### Issue: "Cannot find module 'xyz'"
**Solution**: Run `bun install` to ensure all deps are there

### Issue: TypeScript errors with Bun
**Solution**: Ensure tsconfig.json exists and is correct

### Issue: "Package not found"
**Solution**: 
```bash
bun install missing-package
bun install  # Reinstall all
```

### Issue: npm vs Bun version conflicts
**Solution**: Use Bun exclusively, never mix with npm

---

## Package Manager Setting

Update root `package.json` to use Bun as primary package manager:

```json
{
  "packageManager": "bun@latest",
  "scripts": {
    "dev": "bun run dev:all",
    "dev:all": "...",
    "dev:frontend": "...",
    "dev:backend": "..."
  }
}
```

This tells Git/Node to use Bun.

---

## Bun Built-in APIs

Bun has many Node.js compatibility APIs built-in:

```typescript
// File system
import { file } from 'bun'
const content = await file('path.txt').text()

// HTTP server
Bun.serve({
  fetch: (req) => new Response('Hello'),
  port: 3000
})

// UUID
import { randomUUID } from 'crypto'
const id = randomUUID()

// SQLite (built-in!)
import Database from 'bun:sqlite'
const db = new Database('path.db')
```

---

## Troubleshooting Bun

### Check Bun Installation
```bash
which bun
bun --version
bun env
```

### Verify package.json
```bash
bun install --dry  # Test without actually installing
```

### Check bun.lockb Integrity
```bash
bun install  # Rebuilds lockfile
```

### Update Bun
```bash
bun upgrade
```

---

## Team Setup

When setting up new developers:

1. Have them install Bun (see installation section)
2. Have them run `bun install` instead of `npm install`
3. Verify with `bun --version`
4. Run `bun run dev:all` to start everything
5. Done! No other changes needed.

---

## Migration Timeline

**Day 1**:
- Install Bun globally
- Delete package-lock.json
- Run `bun install`

**Day 2**:
- Test `bun run dev:all`
- Test all scripts work
- Verify build time improvements

**Day 3**:
- Update team setup docs
- Train team on Bun commands
- Commit bun.lockb to git

**Done!** System now 3x faster.

---

## Rollback

If you need to go back to npm:

```bash
# Remove Bun lockfile
rm bun.lockb

# Install with npm
npm install

# Update scripts to use npm
# (usually no changes needed)
```

---

## Resources

- [Bun Official Docs](https://bun.sh)
- [Bun GitHub](https://github.com/oven-sh/bun)
- [Bun Benchmarks](https://bun.sh/benchmarks)
- [Bun Discord Community](https://discord.gg/xqhDyQpBJe)

---

**Quick Links**:
- Previous: TECH_STACK_UPGRADE.md
- Next: CLOUDFLARE_TUNNELS.md
- Reference: HONO_MIGRATION_GUIDE.md
