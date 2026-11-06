Deployed URL - https://10-x-shop-pikria-lomjaria.vercel.app/

# 10X Shop

10X Shop is a React + TypeScript front-end learning and diploma project with a complete shopping journey, DummyJSON products, simulated authentication, browser-local orders and Profile editing. Implemented features include Catalog Skeleton Loading and the CORE compliance corrections in Steps 21–24. Step 25A reconciles documentation and verifies local commands; final browser, hosted and submission checks remain pending. This is not a claim of complete submission readiness or implementation of every FULL requirement.

## Project links

- Configured GitHub repository: [PLomj/10X-Shop_Pikria-Lomjaria](https://github.com/PLomj/10X-Shop_Pikria-Lomjaria). This URL comes from local origin configuration; public accessibility and the pushed revision have not been verified in Step 25A.
- Live URL: **PENDING — the actual Netlify/Vercel URL has not been supplied or confirmed.** No deployment URL is inferred from the repository name.

## Setup and commands

The stack is React 19, strict TypeScript, Vite, React Router, Tailwind CSS v4, React Context and ESLint. Step 17.4 verification used Node.js 24.15.0.

```sh
npm ci
npm run dev
```

Open the URL printed by Vite.

| Command             | Purpose                                                 |
| ------------------- | ------------------------------------------------------- |
| `npm run typecheck` | Run the standalone TypeScript project check (`tsc -b`). |
| `npm run lint`      | Check source and hook rules.                            |
| `npm run build`     | Check TypeScript and generate `dist`.                   |
| `npm run preview`   | Serve the generated build after building.               |

No test script or framework is configured. Steps 17.4 and 18.2 used dependency-free, in-memory checks; see [REPORT.md](REPORT.md) for separately attributed results.

## Implemented functionality

- Catalog: product cards, Add to Cart, 400 ms debounced search, categories, API price/rating/title sorting, 12-item pagination, URL state, cancellation, accessible static skeleton loading, error/empty states and retry. Search and category are separate modes; search takes precedence if both are supplied. Committed search/category/sort changes reset page 1.
- Product Details: responsive gallery, discounted prices, stock-aware quantities, Add to Cart, Description/Reviews tabs, local reviews, related products, skeleton, not-found handling and retry.
- Cart: typed reducer, stock limits, quantities/removal, confirmed clearing, Header badge, promo Apply/Remove, shared calculations and persistence.
- Checkout: Full name, Email, Phone, Address, City, Postal code and Country; controlled validation, error focus, save-before-clear, retryable storage failures, detailed confirmation and View order.
- Orders: protected history/details, validated persistence, recovery warnings, historical snapshots, simulated statuses and current-data Reorder. Results report accepted/skipped quantities and repricing of existing Cart units.
- Profile: protected username display/editing, trimmed validation, unsaved draft preservation, committed-state feedback and immediate Header synchronization.
- Shared responsive Header/Footer, keyboard/form accessibility patterns and Not Found.
- Application-level native React Error Boundary outside BrowserRouter: generic accessible fallback and Reload Page action, without clearing stored data. Actual browser error capture/reload remains NOT VERIFIED.

## Catalog loading

Catalog renders 12 static neutral placeholder cards using the existing productPageSize. The skeleton matches the real grid: one column by default, two at sm and three at lg, with gap-5. It approximates square images, titles, descriptions, prices/ratings and action areas without fake products, images, animation or interactive elements.

ProductGridSkeleton uses one role="status" and a screen-reader-only Loading products… or Searching products… message; its decorative cards are aria-hidden. It replaces the old paragraph under the existing !currentResult condition, without new loading state, fetching hooks or API behavior. It can appear while search is debouncing and while a selected category awaits validation. Category errors/Retry remain independently visible; successful, empty, unavailable-page and product-error states replace the skeleton as before. Twelve cards represent page capacity, not a guaranteed result count.

## Routes

| Route           | Access                                     |
| --------------- | ------------------------------------------ |
| `/`             | Public Catalog                             |
| `/products/:id` | Public Product Details                     |
| `/cart`         | Public Cart                                |
| `/login`        | Public simulated Login                     |
| `/checkout`     | Protected                                  |
| `/orders`       | Protected history                          |
| `/orders/:id`   | Protected details; id is a saved reference |
| `/profile`      | Protected Profile                          |
| Other paths     | Not Found                                  |

## Authentication and Profile

Login requires both Username and Password and rejects empty or whitespace-only values. Step 21 added controlled Password input, field-specific errors and first-invalid-field focus while preserving keyboard submission and safe return navigation. Authentication is simulated: only the trimmed username enters Auth Context. The password is used only for required-field validation in local form state; it is not passed to AuthProvider or persisted. There is no real password verification, backend authentication or persistent account session.

Auth/Profile live only in React memory. Refresh signs out; Cart and Orders remain. Profile edits trim surrounding whitespace, preserve internal whitespace/case, and do not rewrite old reviews or orders. Future reviews use the current username. Typing updates a local draft until Save.

`updateUsername(username): boolean` means request acceptance, not a committed transition. Profile success additionally requires matching committed Auth state. Protected routes control UI navigation, not secure authorization or per-user storage.

## Pricing and storage

Cart and Checkout share `calculateCartSummary()`. Prices are USD; discounted unit prices round to cents before multiplication. Calculations use integer cents where practical.

1. Subtotal = discounted unit prices × quantities, summed.
2. Promo `10X10`, accepted case-insensitively after trimming, discounts merchandise 10%, rounded to cents.
3. Shipping is free at $100 merchandise after promo; otherwise $10 for a non-empty Cart.
4. Empty Cart shipping/total are $0. Total = subtotal − promo discount + shipping. Shipping is not discounted.

| Storage                     | Contents                                                                                                                                             |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| React memory                | Auth username; resets on refresh/Logout.                                                                                                             |
| `shop_cart` localStorage    | Items and promo; supports legacy arrays, clamps restored quantities to stock, keeps first valid duplicate ID.                                        |
| `shop_orders` localStorage  | Historical customer/shipping details, items, prices, discounts and totals. Shared across simulated usernames within the browser profile/site origin. |
| `shop_reviews` localStorage | Local reviews and captured author names.                                                                                                             |

Order validation checks structure and historical arithmetic without current-product reconstruction. Corrupt/duplicate history produces explicit errors/recovery warnings and blocks saves instead of overwriting history. Identical saves are idempotent. Cart storage failures leave the live Cart usable but may prevent persistence.

Statuses are derived, not stored: less than 60 seconds Processing; 60–180 seconds inclusive Shipped; more than 180 seconds Delivered; future timestamps Processing. A 30-second timer updates time only; history loads on mount or explicit Retry.

## Architecture and API

| Folder                    | Responsibility                                                    |
| ------------------------- | ----------------------------------------------------------------- |
| `src/api`                 | Typed DummyJSON requests and response validation.                 |
| `src/components`          | Layout, product, Cart, Checkout, Orders and shared controls.      |
| `src/context`             | Auth and reducer-based Cart state.                                |
| `src/hooks`               | Order history and clock lifecycle.                                |
| `src/pages`, `src/routes` | Pages, routing and shared guard.                                  |
| `src/types`, `src/utils`  | Contracts, pricing, validation, URL state, snapshots and storage. |

Endpoints on https://dummyjson.com: GET /products, /products/{id}, /products/search?q=..., /products/categories and /products/category/{slug}. Catalog requests use limit/skip and sortBy/order as appropriate. API/image availability is external. No live API requests were made in Steps 17.4 or 18.2.

## Verification and limitations

- Step 25A newly executed: `npm run typecheck`, `npm run build` and `npm run lint` each PASS, exit 0. Build transformed 145 modules. No new functional automated suite ran. The in-app browser could not reach a temporary local preview (`net::ERR_CONNECTION_TIMED_OUT`); no browser acceptance case completed. The preview was closed, with no source edits or existing user storage access.
- Historical Step 22: typecheck/build/lint PASS as previously reported. Historical Step 23: the same three commands PASS and 9 isolated checks PASS; browser descendant/lifecycle error capture and reload remain NOT VERIFIED. Step 21 implementation success is previously reported; its browser validation/focus/Enter acceptance remains outstanding.
- Historical Step 18.2: lint PASS, TypeScript/build PASS, 31 Catalog cases PASS / 0 FAIL / 0 SKIP (6 structure, 9 transitions, 15 Catalog behavior, 1 React server-markup case). Hook/timer/URL simulations and server markup are not browser tests.
- Historical Step 18.1: 31 PASS / 0 FAIL / 0 SKIP and lint/build PASS. The user confirmed it works successfully in the browser; that general confirmation does not establish every screen-reader, viewport or fault scenario.
- Historical Step 17.4: lint/build PASS and 72 PASS / 0 FAIL / 0 SKIP; Step 17 is accepted. Historical suites remain separate and were not rerun in Step 25A.
- Step 16 final browser regression and Step 17.3 Profile browser acceptance were user-confirmed PASS. Steps 17.4 and 18.2 operated no browser.
- Real storage fault injection, screen-reader announcements, multi-tab concurrency and current hosted behavior were not verified here.
- Storage is browser-local and nontransactional across tabs; deleting site data loses history. Saved orders contain submitted contact/address data; use sample data for this educational project.
- Reorder may reprice existing units when new units are accepted into the row, with a notice. Zero-accepted attempts leave it unchanged.
- Catalog Skeleton Loading is implemented and verified in Step 18; Product Details retains its separate skeleton. Exact card heights/result counts vary, so loading placeholders do not eliminate all layout movement.
- Theme preferences and OOP services are optional. Issues, PRs, demonstration materials and meaningful commit count remain unaudited; no Git commands were run.

## Deployment

Netlify deployment is user-reported. No hosted site was contacted or redeployed in Step 25A, and the actual live URL remains pending above. Local configuration builds with `npm run build` and publishes `dist` without application environment variables. `public/_redirects` supplies Netlify SPA fallback; `vercel.json` provides an alternative rewrite configuration. Local configuration does not verify hosting dashboard settings or the deployed revision.

After a future approved deployment, test direct visits/refresh for Product Details, Cart, Checkout, Orders, Order Details, Profile and an unknown route. Protected destinations should reach Login and return safely afterward.

Before submission, verify the public repository, final pushed/deployed revision, live URL, direct `/products/5` refresh, 375px CORE layouts and complete shopping journey. The original PRD section 4 deadline is November 6, 2026, 23:59 Georgia time; repository submission through the required form remains unverified. No Git, deployment or submission action was performed in Step 25A.

See [PLAN.md](PLAN.md) for status and [REPORT.md](REPORT.md) for evidence provenance and remaining checks, including [DEBUG-LOG](REPORT.md#debug-log--core-compliance-corrections).
