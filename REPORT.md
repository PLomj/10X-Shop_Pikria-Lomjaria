# 10X Shop verification report

## Step 17.4 outcome

Ready for final user acceptance of Step 17.4. No confirmed blocking production defect was found by the executed checks. Only README.md, PLAN.md and REPORT.md were edited. Production source, PROJECT_SPEC.md and dependency files remain unchanged. No Git commands, live API requests, browser storage operations or deployment were performed.

### Newly executed verification

| Check | Result |
| --- | --- |
| `npm run lint` | PASS; exit 0; no errors/warnings reported |
| `npm run build` | PASS; exit 0; TypeScript and Vite production build, 143 modules |
| Dependency-free regression checks | 72 PASS / 0 FAIL / 0 SKIP |

Environment: Node.js 24.15.0. Regression batches ran through the persistent Node REPL, using the installed TypeScript compiler to transpile actual current modules into isolated VM contexts. No test framework or persistent test file was added. An initial oversized PowerShell command was rejected by Windows error 206 before any test ran; smaller in-memory batches replaced it. The launcher error was not a product regression failure. One documentation-writing tool invocation also had a JavaScript parsing error before execution; it made no edits and was corrected before writing the approved documents.

Pure utilities executed directly with fixtures. Component functions executed with simulated hooks, queued state processing and JSX objects. Storage was an isolated in-memory Map. Product fetches were mocked; unmatched network access was blocked. Checkout used actual handlers and snapshot creation with controlled save results; the actual storage module was tested separately. Real createOrderSnapshot fixtures covered optional discount fields, serialization, promo and historical arithmetic. The isolated snapshot VM exercised its fallback reference generator; real-browser crypto UUID generation was not tested.

| Area | PASS | FAIL | SKIP |
| --- | --- | --- | --- |
| Auth/Profile | 16 | 0 | 0 |
| Routes | 7 | 0 | 0 |
| Cart | 9 | 0 | 0 |
| Pricing | 8 | 0 | 0 |
| Checkout | 10 | 0 | 0 |
| Orders | 15 | 0 | 0 |
| Reorder | 5 | 0 | 0 |
| Reviews/history | 2 | 0 | 0 |
| Total | 72 | 0 | 0 |

Every registered automated case executed. Browser-only scenarios were outside the automated suite and are not included in these counts. Cases can contain multiple related assertions; counts refer to cases, not assertions. Earlier reported test counts are not added to this total.

### Executed case ledger

| # | Area | Scenario | Result |
| --- | --- | --- | --- |
| 1 | Auth/Profile | Login rejects blank and trims valid input | PASS |
| 2 | Auth/Profile | Signed-out username update rejected | PASS |
| 3 | Auth/Profile | Update trimmed immutable with case/internal spaces preserved | PASS |
| 4 | Auth/Profile | Unchanged update preserves object | PASS |
| 5 | Auth/Profile | Blank update preserves user and auth | PASS |
| 6 | Auth/Profile | Queued Logout prevents accepted update restoring user | PASS |
| 7 | Auth/Profile | Consecutive updates and Logout | PASS |
| 8 | Auth/Profile | No Auth storage access; new mount signed out | PASS |
| 9 | Auth/Profile | Local draft survives equivalent Auth object | PASS |
| 10 | Auth/Profile | Accepted request waits for matching committed username | PASS |
| 11 | Auth/Profile | Typing clears prior success | PASS |
| 12 | Auth/Profile | Blank Profile submission never calls Auth | PASS |
| 13 | Auth/Profile | External change follows clean input but preserves edited draft | PASS |
| 14 | Auth/Profile | Competing update and Logout prevent stale confirmation | PASS |
| 15 | Auth/Profile | Unchanged and rejected saves have accurate feedback | PASS |
| 16 | Auth/Profile | Header reflects committed username and Profile visibility | PASS |
| 17 | Routes | Safe return /profile query/hash | PASS |
| 18 | Routes | Safe return /checkout query/hash | PASS |
| 19 | Routes | Safe return /orders query/hash | PASS |
| 20 | Routes | Safe return /orders/SHOP-123 query/hash | PASS |
| 21 | Routes | Unsafe/malformed return destinations rejected | PASS |
| 22 | Routes | Guard redirect preserves location and authenticated Outlet | PASS |
| 23 | Routes | Four protected routes inside existing guard | PASS |
| 24 | Cart | ADD_ITEM immutable and stock bounded | PASS |
| 25 | Cart | SET_QTY rejects zero fractional and overstock | PASS |
| 26 | Cart | Promo normalize/remove; item removal and CLEAR | PASS |
| 27 | Cart | Legacy storage clamps stock and keeps first duplicate | PASS |
| 28 | Cart | Current storage restores promo and persists shop_cart | PASS |
| 29 | Cart | Malformed and denied storage handled | PASS |
| 30 | Cart | Rapid adds use latest Cart state | PASS |
| 31 | Cart | Zero accepted reorder preserves existing row identity and price | PASS |
| 32 | Cart | Partial reorder refreshes metadata and reports exact repricing | PASS |
| 33 | Pricing | Empty | PASS |
| 34 | Pricing | Discounted units | PASS |
| 35 | Pricing | Multiple items | PASS |
| 36 | Pricing | Below threshold | PASS |
| 37 | Pricing | Exactly threshold | PASS |
| 38 | Pricing | Above threshold | PASS |
| 39 | Pricing | Promo crosses threshold | PASS |
| 40 | Pricing | Promo and cent rounding | PASS |
| 41 | Checkout | Valid seven fields and seven invalid errors | PASS |
| 42 | Checkout | Phone postal country boundaries | PASS |
| 43 | Checkout | Actual and serialized snapshots pass runtime validation | PASS |
| 44 | Checkout | Optional discount and promo snapshot compatible | PASS |
| 45 | Checkout | Snapshot detached from mutable inputs | PASS |
| 46 | Checkout | Save before clear and confirmation total matches Cart | PASS |
| 47 | Checkout | Failed save preserves input Cart promo and exact snapshot across equivalent Cart copies | PASS |
| 48 | Checkout | Field edit invalidates pending snapshot | PASS |
| 49 | Checkout | Already-exists succeeds and reference-conflict preserves Cart | PASS |
| 50 | Checkout | Thrown save failure retains snapshot for retry | PASS |
| 51 | Orders | Missing/empty history succeeds with no write | PASS |
| 52 | Orders | Save and identical repeat idempotent | PASS |
| 53 | Orders | Conflicting same reference rejected | PASS |
| 54 | Orders | Corrupted histories block writes and preserve exact bytes | PASS |
| 55 | Orders | All-invalid history partial not clean empty | PASS |
| 56 | Orders | Stored duplicate and conflict detection | PASS |
| 57 | Orders | Newest-first and deterministic reference tie-break | PASS |
| 58 | Orders | Equivalent ISO instants do not rewrite timestamps | PASS |
| 59 | Orders | Invalid money and inconsistent arithmetic rejected | PASS |
| 60 | Orders | Denied storage quota and generic write errors explicit | PASS |
| 61 | Orders | Exact status boundaries and future dates | PASS |
| 62 | Orders | Derived status never mutates snapshot | PASS |
| 63 | Orders | Timer only updates time retry reloads and cleanup clears timer | PASS |
| 64 | Orders | Unknown clean record NotFound; partial history retains uncertainty warning | PASS |
| 65 | Orders | Saved totals rendered and justPlaced must match loaded reference | PASS |
| 66 | Reorder | Partial success uses current data exact counts and repricing without historical mutation | PASS |
| 67 | Reorder | Network failure cannot add stale historical item | PASS |
| 68 | Reorder | Total failure remains on Details with accessible summary | PASS |
| 69 | Reorder | Repeat click blocked and cancellation before commit prevents mutation/navigation | PASS |
| 70 | Reorder | Full success navigates; Cart feedback persists until Dismiss | PASS |
| 71 | Reviews/history | Future review uses changed author and preserves existing review and order bytes | PASS |
| 72 | Reviews/history | Guest author supported; invalid review never writes | PASS |

## Source-level inspection

- Auth: src/types/auth.ts and src/context/AuthProvider.tsx expose a username-only AuthUser, existing Login/Logout and updateUsername. It trims/rejects blanks, updates immutably from latest queued state, preserves unchanged identity, and cannot restore null after Logout. Its boolean denotes acceptance, not a committed update. No Auth storage was introduced.
- Profile: src/pages/ProfilePage.tsx holds a draft independently until Save. Feedback requires submitted/committed username equality and is invalidated on editing. Guarded username reconciliation preserves an edited draft and displays an external-change notice. Labels, associated errors, aria-invalid, focus handling and status regions exist; source inspection is not a browser accessibility audit.
- Routes/Header: AppRoutes places Checkout, Profile, Orders and Order Details inside the existing ProtectedRoute. Login allows only approved destinations and retains safe query/hash data. Header consumes committed user state directly and hides Profile when signed out.
- Cart: CartProvider/cartReducer/cartStorage use a typed reducer, immutable updates, stock restrictions, lazy initialization and persistence outside the reducer. Legacy arrays migrate; first valid duplicate IDs are retained and restored quantities clamped to stock. Shared summary and promo survive unrelated Cart operations.
- Pricing: cartCalculations/currency provide a single Cart/Checkout calculation source. Discounted units round before multiplication; 10X10 discounts merchandise 10%; free shipping requires $100 after promo, otherwise $10 for non-empty Cart. Empty Cart total/shipping are zero.
- Checkout: seven controlled fields and validation remain, with touched/submitted errors and first-invalid-field focus. Meaningful purchase input forms a deterministic pending-snapshot key. Equivalent Cart copies reuse a pending snapshot; field edits invalidate it. saveOrder succeeds before confirmation and clearing; failure preserves input, Cart, promo and snapshot. The confirmation retains heading focus and View order.
- Orders: createOrderSnapshot/orderValidation/orderStorage retain detached historical customer, shipping, prices and totals. Runtime validation checks structure and historical arithmetic without current-product fetching. Reads do not repair history; corrupt/duplicate history blocks saves; duplicate writes are idempotent. Original createdAt strings are preserved. No mutable status or payment card fields are persisted.
- Status/history UI: useOrderHistory updates time every 30 seconds without reloading storage on each tick; mount/Retry load history. getOrderStatus uses exact 60,000/180,000 ms boundaries. OrderDetails preserves partial-history uncertainty, requires a matching loaded reference for justPlaced, and renders saved totals.
- Reorder: ReorderButton fetches current products, skips failed/404 items without stale substitution, guards repeated clicks and checks cancellation before commit. addAvailableToCart atomically uses latest Cart state; accepted units may refresh existing pricing with a notice, zero-accepted attempts do not modify the row. Reorder does not save historical orders.
- Reviews: ProductReviews captures the current username or Guest for new submissions; reviewStorage retains existing authors and other products’ valid reviews. Profile changes do not rewrite old reviews.
- Catalog: source confirms debounce, category mode, API sorting, 12-item pagination, URL state and Retry. It still uses text loading; Catalog Skeleton Loading remains open. Product Details has its own skeleton.

These are inspections, not additional passed test cases. Source references are relative to the repository root.

## Evidence provenance

| Evidence | Meaning |
| --- | --- |
| New automated checks | The 72 cases above and this stage’s lint/build. Utility execution and simulated component behavior. |
| Source inspection | Architecture observations above; not counted as extra tests. |
| Previously reported automation | Step 17.2: 14/14; Step 17.3: 33/33; Step 16 final verification: 50/50. Historical reports, not newly rerun totals. |
| User-confirmed browser acceptance | CORE and Step 16 officially completed by the user, including Step 16 final browser regression PASS. Step 17.3 acceptance explicitly confirmed Profile display/edit/save, Header update, normal feedback, blank validation, protection/return navigation, Logout/refresh, mobile/keyboard use and the previously agreed checklist. |
| Unverified in Step 17.4 | No browser operation, live endpoint call, hosted check, real storage fault injection, screen-reader session, or Git/delivery audit. |

Automated regression checks supply known inputs and compare results; they help catch changed calculations and transitions. Browser acceptance checks the running interface: actual navigation, focus, layout, storage and announcements. Calling a simulated handler or examining JSX does not prove these real-browser interactions. User-confirmed browser results retain that attribution.

## Known limitations and approved decisions

- Username-only Login is explicitly approved and differs from PROJECT_SPEC.md section 6.4 username/password wording. PROJECT_SPEC.md was not edited. No password, backend, new Profile field or authentication persistence was added.
- Auth/Profile reset on refresh or Logout. shop_cart, shop_orders and shop_reviews persist per browser profile/site origin. History is shared across simulated usernames; route guards do not provide secure per-user authorization.
- Orders include submitted contact and shipping information; use sample data. There is no payment processor, backend order service or real delivery status.
- Storage read-modify-write is not transactional across tabs. History refreshes on mount/Retry rather than synchronizing continuously. Deleting site data loses local history. Cart storage errors allow in-memory operation; order storage errors block order success/Cart clearing.
- Historical prices/totals/addresses remain fixed. Reorder uses current products and may reprice existing Cart units when adding accepted units, with notice.
- VM simulations do not model the full React scheduler, DOM, browser event dispatch, Strict Mode lifecycle, actual network cancellation or assistive technology. Mock failures are not evidence of real browser fault handling.
- No confirmed product defect was found by the executed checks. Coverage is bounded and does not prove every possible failure path.

## Remaining browser-only and delivery checks

The agreed Step 17.3 browser checklist is user-confirmed PASS; it is not universally pending. The following remain unverified in this stage:

1. Real storage quota/access faults during Checkout and retry in a disposable browser profile.
2. Browser network timing for Reorder cancellation, partial failures and repricing announcements.
3. External Auth changes while a Profile draft is edited; simulated logic passed, but normal UI has no separate concurrent editor.
4. Screen-reader announcement timing, contrast audit and fresh full responsive regression at 375, 768 and 1440 px beyond the user-confirmed Profile checks.
5. Multi-tab storage races, a documented architectural limitation.
6. Current hosted direct-route refresh and Login return after any future approved deployment. Netlify deployment is user-reported, not contacted here.
7. Repository/commit count, Issues, PRs, demo/presentation materials and original-PRD delivery evidence; no Git commands were run.

Useful future journey: Catalog → Product Details → Cart → Login → Checkout → confirmation → View order → Reorder → Cart; then Profile save → Header update → Logout → protected-route return. Compare old review authors and saved order totals before/after Profile editing. Use disposable sample data for fault tests.

## Remaining FULL work and final acceptance

Catalog Skeleton Loading (PROJECT_SPEC.md section 7) is outstanding and needs separate approval; Retry already exists. Theme preferences and OOP services are explicitly optional. Section 14 delivery evidence remains unaudited. The original PRD was not found in the earlier repository audit, so omitted detailed criteria must not be invented or waived.

Step 17.4 executed verification and documentation are complete; final user acceptance is pending. No next stage started. Suggested commit: `docs: reconcile project status and Step 17 regression evidence`.

## Historical evidence retained

The following records are earlier observations, not Step 17.4 executions or claims about current live services.

- CORE established shared layout, routes, typed fetching, gallery, persistent Cart, simulated Login, Checkout and confirmation. Its manual journey covered quantities, refresh, Login return, validation, Cart clearing and responsive/keyboard review. Later user sign-off supersedes old universally pending browser labels and the old four-field/nonpersisted-order description.
- Early service checks returned 30 default products, distinct details for IDs 1 and 5 and a nonexistent-product 404. The default-batch observation is historical; current pagination requests 12.
- Earlier deployment preparation reported dist assets, Netlify fallback and Vercel rewrite checks. A permitted local preview reportedly served the app for five direct routes after a sandbox loopback restriction. This is not current hosted verification.
- The earlier tracked-file/environment check was not a Git-history secret audit. No Git operations occurred in Step 17.4.

### Archived sorting/pagination correction

The archived section below preserves useful earlier evidence verbatim. Endpoint counts, live calls and sandbox retries are historical. Its final references to pending browser checks describe that earlier stage; they do not override subsequent user sign-offs or the provenance table above.

## PRD P2.6 and P2.7 correction

The approved correction supersedes the earlier page-local sorting plan. Catalog requests now use a shared page size of 12. Sort selection is part of the request state and resets to page 1 while preserving the active Search or Category mode. Default omits sorting parameters. Other options map to API sortBy and order parameters.

Live endpoint checks confirmed price ascending, price descending, and rating descending ordering across the complete default, phone-search and smartphones-category result sets. Sorted pages at skips 0 and 12 matched slices of the respective complete sorted API responses. Title sorting also produced consistent server page slices, with server collation differing from plain JavaScript localeCompare. Its numeric-looking titles can appear in natural numeric order. The API title order is preserved.

The standalone sortProducts utility is retained only as a documented fallback for endpoints proven unable to sort. Catalog currently uses server sorting for all three modes. Network failures continue to use error and Retry behavior. Sorting a loaded page alone cannot provide globally ordered pagination, so any future fallback must explicitly disclose that limitation.

After the correction, lint and build passed. Mocked checks covered all four non-default API parameter mappings, omission for Default, and 12-item pagination defaults in all modes. Live calls through the updated functions confirmed ascending prices across pages 1 and 2. Observed totals were 194 catalog items, 23 phone search results, and 16 smartphones, producing 17, 2, and 2 pages. Search and Category final pages contained 11 and 4 items. The sandbox initially blocked DNS; the approved retry with network access passed.

A controlled handler check confirmed sorting from page 2 resets to page 1 and preserves the active Search or Category mode. Mode changes retained the chosen sort. Browser interaction and hosted regression checks remain pending. Existing historical browser checklists above describe CORE review and should be supplemented by the current pagination and sorting checks.

