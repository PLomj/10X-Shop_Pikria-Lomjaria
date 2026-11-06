# 10X Shop

10X Shop is a React + TypeScript front-end learning and diploma project with a complete shopping journey, DummyJSON products, simulated authentication, browser-local orders and Profile editing. CORE is complete by user sign-off. FULL features through Step 17 are implemented as listed below; Catalog Skeleton Loading remains outstanding.

## Setup and commands

The stack is React 19, strict TypeScript, Vite, React Router, Tailwind CSS v4, React Context and ESLint. Step 17.4 verification used Node.js 24.15.0.

```sh
npm ci
npm run dev
```

Open the URL printed by Vite.

| Command | Purpose |
| --- | --- |
| `npm run lint` | Check source and hook rules. |
| `npm run build` | Check TypeScript and generate `dist`. |
| `npm run preview` | Serve the generated build after building. |

No test script or framework is configured. Step 17.4 used dependency-free, in-memory checks; see [REPORT.md](REPORT.md).

## Implemented functionality

- Catalog: product cards, Add to Cart, 400 ms debounced search, categories, API price/rating/title sorting, 12-item pagination, URL state, cancellation, loading/error/empty states and retry. Search and category are separate modes; search takes precedence if both are supplied. Committed search/category/sort changes reset page 1.
- Product Details: responsive gallery, discounted prices, stock-aware quantities, Add to Cart, Description/Reviews tabs, local reviews, related products, skeleton, not-found handling and retry.
- Cart: typed reducer, stock limits, quantities/removal, confirmed clearing, Header badge, promo Apply/Remove, shared calculations and persistence.
- Checkout: Full name, Email, Phone, Address, City, Postal code and Country; controlled validation, error focus, save-before-clear, retryable storage failures, detailed confirmation and View order.
- Orders: protected history/details, validated persistence, recovery warnings, historical snapshots, simulated statuses and current-data Reorder. Results report accepted/skipped quantities and repricing of existing Cart units.
- Profile: protected username display/editing, trimmed validation, unsaved draft preservation, committed-state feedback and immediate Header synchronization.
- Shared responsive Header/Footer, keyboard/form accessibility patterns and Not Found.

## Routes

| Route | Access |
| --- | --- |
| `/` | Public Catalog |
| `/products/:id` | Public Product Details |
| `/cart` | Public Cart |
| `/login` | Public simulated Login |
| `/checkout` | Protected |
| `/orders` | Protected history |
| `/orders/:id` | Protected details; id is a saved reference |
| `/profile` | Protected Profile |
| Other paths | Not Found |

## Authentication and Profile

Login accepts any nonblank username. Username-only simulated Login is explicitly approved and differs from PROJECT_SPEC.md section 6.4 username/password wording. No password, real account identity, backend or authentication persistence exists; the specification was not changed.

Auth/Profile live only in React memory. Refresh signs out; Cart and Orders remain. Profile edits trim surrounding whitespace, preserve internal whitespace/case, and do not rewrite old reviews or orders. Future reviews use the current username. Typing updates a local draft until Save.

`updateUsername(username): boolean` means request acceptance, not a committed transition. Profile success additionally requires matching committed Auth state. Protected routes control UI navigation, not secure authorization or per-user storage.

## Pricing and storage

Cart and Checkout share `calculateCartSummary()`. Prices are USD; discounted unit prices round to cents before multiplication. Calculations use integer cents where practical.

1. Subtotal = discounted unit prices × quantities, summed.
2. Promo `10X10`, accepted case-insensitively after trimming, discounts merchandise 10%, rounded to cents.
3. Shipping is free at $100 merchandise after promo; otherwise $10 for a non-empty Cart.
4. Empty Cart shipping/total are $0. Total = subtotal − promo discount + shipping. Shipping is not discounted.

| Storage | Contents |
| --- | --- |
| React memory | Auth username; resets on refresh/Logout. |
| `shop_cart` localStorage | Items and promo; supports legacy arrays, clamps restored quantities to stock, keeps first valid duplicate ID. |
| `shop_orders` localStorage | Historical customer/shipping details, items, prices, discounts and totals. Shared across simulated usernames within the browser profile/site origin. |
| `shop_reviews` localStorage | Local reviews and captured author names. |

Order validation checks structure and historical arithmetic without current-product reconstruction. Corrupt/duplicate history produces explicit errors/recovery warnings and blocks saves instead of overwriting history. Identical saves are idempotent. Cart storage failures leave the live Cart usable but may prevent persistence.

Statuses are derived, not stored: less than 60 seconds Processing; 60–180 seconds inclusive Shipped; more than 180 seconds Delivered; future timestamps Processing. A 30-second timer updates time only; history loads on mount or explicit Retry.

## Architecture and API

| Folder | Responsibility |
| --- | --- |
| `src/api` | Typed DummyJSON requests and response validation. |
| `src/components` | Layout, product, Cart, Checkout, Orders and shared controls. |
| `src/context` | Auth and reducer-based Cart state. |
| `src/hooks` | Order history and clock lifecycle. |
| `src/pages`, `src/routes` | Pages, routing and shared guard. |
| `src/types`, `src/utils` | Contracts, pricing, validation, URL state, snapshots and storage. |

Endpoints on https://dummyjson.com: GET /products, /products/{id}, /products/search?q=..., /products/categories and /products/category/{slug}. Catalog requests use limit/skip and sortBy/order as appropriate. API/image availability is external. No live API requests were made in Step 17.4.

## Verification and limitations

- Step 17.4: lint PASS, TypeScript/build PASS, 72 automated cases PASS / 0 FAIL / 0 SKIP. Hook/JSX simulations are not browser tests.
- Step 16 final browser regression and Step 17.3 Profile browser acceptance were user-confirmed PASS. Step 17.4 operated no browser.
- Real storage fault injection, screen-reader announcements, multi-tab concurrency and current hosted behavior were not verified here.
- Storage is browser-local and nontransactional across tabs; deleting site data loses history. Saved orders contain submitted contact/address data; use sample data for this educational project.
- Reorder may reprice existing units when new units are accepted into the row, with a notice. Zero-accepted attempts leave it unchanged.
- Catalog Skeleton Loading remains a separate FULL follow-up. Catalog Retry exists; Product Details already has a skeleton.
- Theme preferences and OOP services are optional. Issues, PRs, demonstration materials and meaningful commit count remain unaudited; no Git commands were run.

## Deployment

Netlify deployment is user-reported, not contacted or redeployed in Step 17.4. Local configuration builds with `npm run build` and publishes `dist` without application environment variables. `public/_redirects` supplies Netlify SPA fallback; `vercel.json` provides an alternative rewrite configuration.

After a future approved deployment, test direct visits/refresh for Product Details, Cart, Checkout, Orders, Order Details, Profile and an unknown route. Protected destinations should reach Login and return safely afterward.

See [PLAN.md](PLAN.md) for status and [REPORT.md](REPORT.md) for evidence provenance and remaining checks.
