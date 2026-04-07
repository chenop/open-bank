# Open-Bank: Children's Banking Web App

## Context
Building a parental banking app ("open-bank") for managing children's financial accounts, investments, and securities trading. Starting with a Next.js web app deployed on Vercel, with plans to add a React Native mobile app later that consumes the same API.

## Stack
- **Frontend:** Next.js 15 (App Router) + React 19 + Tailwind CSS 4
- **Backend:** Next.js API Routes (REST, JSON)
- **Database:** MongoDB Atlas (via Mongoose 8)
- **Deployment:** Vercel
- **Language:** TypeScript
- **UI Components:** shadcn/ui (Radix primitives + Tailwind)
- **Key libs:** TanStack Query 5, Zod, date-fns, bcryptjs, jsonwebtoken

## Project Location
`/Users/chenop/MyProjects/open-bank` (new directory)

---

## Data Models

### Account
- `name`, `avatarColor`, `shareToken?`, `permissions`, timestamps
- **Balance is never stored** — always computed as `SUM(transactions.amount)`
- **`permissions`** (object) — controls what the child can do via shared URL:
  - `canDeposit`: boolean (default: false)
  - `canWithdraw`: boolean (default: false)
  - `canInvest`: boolean (default: false)
  - `canBuySecurities`: boolean (default: false)

### Transaction (core model — source of truth)
- `account` (ref), `type` (enum), `amount` (signed: +deposit, -withdraw), `description?`, `relatedInvestment?`, `relatedHolding?`, timestamps
- Types: `deposit`, `withdraw`, `invest`, `uninvest`, `buy_security`, `sell_security`, `interest`

### Investment
- `account` (ref), `principalAmount`, `annualRate` (default 0.05), `startDate`, `redeemedAt?`, `redeemedAmount?`
- Current value computed: `principal * (1 + rate) ^ years`

### Holding (Securities)
- `account` (ref), `symbol`, `name`, `quantity`, `costPerUnit`, `purchaseDate`, `soldAt?`, `soldPrice?`

---

## API Routes

| Method | Route | Purpose |
|--------|-------|---------|
| POST | `/api/auth` | Verify admin PIN, return JWT |
| GET/POST | `/api/accounts` | List / create accounts |
| GET/PUT/DELETE | `/api/accounts/[id]` | Single account CRUD |
| POST | `/api/accounts/[id]/share` | Generate share token |
| GET/POST | `/api/accounts/[id]/transactions` | List / create transactions |
| GET/POST | `/api/accounts/[id]/investments` | List / create investments |
| PUT | `/api/accounts/[id]/investments/[investId]` | Redeem investment |
| GET/POST | `/api/accounts/[id]/securities` | List / buy securities |
| POST/PUT/DELETE | `/api/accounts/[id]/securities/[holdId]` | Sell / edit / delete |
| GET | `/api/securities/price?symbol=X` | Fetch TASE price |
| GET | `/api/shared/[token]` | Account data via share token (no admin auth) |
| POST | `/api/shared/[token]/transactions` | Child creates transaction (if permitted) |
| POST | `/api/shared/[token]/investments` | Child creates investment (if permitted) |
| POST | `/api/shared/[token]/securities` | Child buys security (if permitted) |

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Login (PIN input) |
| `/dashboard` | Account list / overview |
| `/accounts/[id]` | Account detail: balance, quick actions, tabbed view |
| `/accounts/[id]/transactions` | Full transaction history |
| `/accounts/[id]/investments` | Investment management |
| `/accounts/[id]/securities` | Securities/holdings management |
| `/shared/[token]` | Child's view — sees account, can act based on permissions |

---

## Auth & Access Model
Two access levels:

1. **Admin (parent)** — PIN login, full access to all accounts and operations
   - Simple PIN (4-6 digits) verified against hashed env var
   - JWT token (30-day expiry) stored in localStorage
   - All `/api/accounts/*` routes require admin JWT

2. **Child** — accesses via shared URL (`/shared/[token]`), no login required
   - Can view their account (balance, transactions, investments, holdings)
   - Can perform actions based on **per-account permissions** set by parent:
     - `canDeposit` — create deposit transactions
     - `canWithdraw` — create withdrawal transactions
     - `canInvest` — create fixed-rate investments
     - `canBuySecurities` — buy TASE securities
   - Parent configures permissions in account settings
   - API enforces permissions: shared routes check `account.permissions` before allowing writes

## Env Variables
- `MONGODB_URI` — MongoDB Atlas connection string
- `JWT_SECRET` — JWT signing key
- `ADMIN_PIN_HASH` — bcrypt hash of admin PIN
- `TASE_API_KEY` — TASE API key (if needed)

---

## Implementation Phases

### Phase 1: Foundation
- `npx create-next-app@latest open-bank --typescript --tailwind --app --src-dir`
- MongoDB connection singleton
- All Mongoose models + TypeScript types
- API error-handling wrapper
- Root layout with RTL (`dir="rtl"`, Hebrew font)
- TanStack Query + Auth providers
- shadcn/ui setup + components (Button, Card, Input, Dialog, Avatar, custom Spinner)

### Phase 2: Auth + Accounts
- PIN auth API + login page
- Account CRUD API routes
- Dashboard with AccountList + AccountForm
- Share token generation

### Phase 3: Cash Management
- Deposit/withdraw API + balance computation (aggregate SUM)
- Account detail page with balance display
- DepositForm + WithdrawForm dialogs
- TransactionList with color-coded type badges

### Phase 4: Investments
- Compound interest calculation (`src/lib/interest.ts`)
- Investment API routes (create, list, redeem)
- Investment UI components
- Auto-created invest/uninvest transactions

### Phase 5: Securities / TASE
- TASE price fetching utility (with 5-15 min cache)
- Securities API routes (buy, sell, edit, delete)
- Securities UI components with live P&L
- Auto-created buy_security/sell_security transactions

### Phase 6: Child View + Permissions
- Per-account permissions settings UI (parent toggles in account settings)
- Child shared view page with permitted actions
- Shared API routes with permission checks
- Loading skeletons, animations
- Responsive design pass
- Error + empty states

### Phase 7: Testing + Deploy
- **Client-side tests** (driver + spec pattern):
  - Each component gets `ComponentName.driver.tsx` + `ComponentName.spec.tsx`
  - **Driver**: renders the component, mocks API calls, exposes helpers to query by `data-testid`
  - **Spec**: uses the driver to assert on rendered output and user interactions
  - Mock API at the fetch/network level (no mocking react-query internals)
  - Assert existence and content via `data-testid` attributes on components
- API integration tests (builder pattern)
- Unit tests for interest calc, balance
- Vercel deployment with env vars
- MongoDB Atlas connectivity test

---

## Key Design Decisions
1. **Balance = derived data** — never stored, always `SUM(transactions.amount)`
2. **Atomic compound operations** — buy security = Holding + Transaction in one Mongoose session
3. **Interest computed, not stored** — only persisted on redemption
4. **TASE prices cached** — 5-15 min TTL to avoid rate limits
5. **API is React Native-ready** — pure REST/JSON, no Next.js UI coupling. Future RN app just changes `BASE_URL`

## Verification
1. Run `npm run dev` and test all CRUD flows manually
2. Run `npm test` for unit + integration tests
3. Deploy to Vercel, verify MongoDB Atlas connection
4. Test RTL layout in browser
5. Test shared view with generated token
