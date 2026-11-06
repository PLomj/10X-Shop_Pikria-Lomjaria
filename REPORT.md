# 10X Shop verification report

## DEBUG-LOG — CORE compliance corrections

This section records genuine requirements-compliance corrections, not invented runtime incidents. The original Georgian PRD v1.1 introductory Optimization CORE table requires DEBUG-LOG and basic debugging; section 3, Step 22 asks the student to explain how a problem was found and corrected. No particular log format is specified. Requirement references below refer to ORIGINAL_PRD.md unless identified as archived references.

Evidence provenance: Step 24 reviewed current source and existing records only. No npm scripts, automated runtime checks, browser tests, live API requests or deployment were executed in Step 24. Previously reported results below retain their original attribution and are not new test results. Older stage-specific statements and counts later in this report remain historical.

### Entry 1 — Login Password Requirement

- **Classification:** CORE compliance gap, not a confirmed runtime bug.
- **Issue or gap:** Original PRD section 3, Step 5 requires Username/Password required validation; PROJECT_SPEC.md section 6.4 also specifies both fields.
- **Discovery:** Original PRD reconciliation during Step 20 identified the omitted required field.
- **Diagnosis:** The earlier Login form accepted only Username. The approved earlier simulation did not satisfy the original PRD's two-field form requirement.
- **Correction:** Step 21 added a controlled Password field, typed field-specific validation and first-invalid-field focus in src/pages/LoginPage.tsx and src/types/auth.ts. Both fields reject blank or whitespace-only values; valid submission calls login(trimmedUsername) without passing the password.
- **Verification evidence:** Step 21 implementation results are attributed to the existing implementation report and the user's subsequent confirmation that Step 21 was implemented successfully; no exact test count is asserted here. Step 24 source inspection confirms the required password input, controlled values, associated error messages, focus refs and validation before login. Inspection is not execution of those interactions.
- **Remaining limitations:** Step 21 browser acceptance remains outstanding. Authentication is simulated; src/context/AuthProvider.tsx receives and stores only the username in memory. There is no real password verification or backend authentication. The password stays in local form state and is not passed to AuthProvider.

### Entry 2 — Explicit Typecheck Script

- **Classification:** CORE compliance gap, not a TypeScript compiler failure.
- **Issue or gap:** Original PRD section 3, Step 1 and section 4 explicitly require npm run typecheck; section 3, Step 23 requires strict checking without errors.
- **Discovery:** Step 20 audit identified the missing standalone command.
- **Diagnosis:** The build already performed TypeScript checking through tsc -b, but package.json did not expose a separate typecheck npm script.
- **Correction:** Step 22 added "typecheck": "tsc -b" to package.json, preserving "build": "tsc -b && vite build".
- **Verification evidence:** Previously reported Step 22 results: npm run typecheck PASS, npm run build PASS and npm run lint PASS. The user repeated these results when requesting Step 23. Step 24 source inspection confirms the current scripts; these commands were not rerun here.
- **Remaining limitations:** These are historical checks, not proof that every future source change will typecheck. No new compiler or browser verification is claimed in this documentation step.

### Entry 3 — Error Boundary

- **Classification:** CORE compliance gap, not a documented production crash.
- **Issue or gap:** The original PRD introductory module table explicitly lists Error Boundary under Optimization CORE.
- **Discovery:** Step 20 audit identified the missing application-level boundary.
- **Diagnosis:** No application-level React Error Boundary existed; API request error handling alone does not catch descendant rendering and lifecycle errors.
- **Correction:** Step 23 added the strictly typed native React class in src/components/ui/ErrorBoundary.tsx and mounted it in src/main.tsx as StrictMode → ErrorBoundary → BrowserRouter → App. It renders generic accessible fallback content and a Reload Page action without exposing error details or clearing storage.
- **Verification evidence:** Previously reported Step 23 results: npm run typecheck PASS, npm run build PASS, npm run lint PASS and 9 isolated checks PASS / 0 FAIL. Those checks used actual source with isolated mocks and server rendering; they checked normal rendering, fallback state/content, markup, mocked reload behavior, absence of storage access and mounting structure. Step 24 source inspection confirms the component and placement; it adds no runtime test result.
- **Remaining limitations:** Real-browser descendant error capture, lifecycle error capture and reload behavior remain NOT VERIFIED because the disposable browser harness did not start. The isolated checks do not prove client-side error capture. Error Boundaries do not replace async API handling or event-handler try/catch, and reloading can encounter the same underlying error.

### Entry 4 — Historical Sorting and Pagination Correction

- **Classification:** FULL requirements-compliance correction, retained as a historical debugging example; not an additional CORE requirement.
- **Issue or gap:** The earlier plan used page-local sorting and 10-item pagination rather than the API sorting and 12-item page requirements recorded in the archived P2.6/P2.7 audit.
- **Discovery:** Original-PRD comparison during Step 11.5 exposed the mismatch.
- **Diagnosis:** Sorting only the loaded page cannot provide globally ordered paginated results; the planned page size also differed from the recorded requirement.
- **Correction:** API sorting and a shared page size of 12 replaced the earlier approach; changing sort resets pagination while preserving the active mode. Relevant source: src/api/products.ts and src/pages/CatalogPage.tsx.
- **Verification evidence:** See the existing [PRD P2.6 and P2.7 correction](#prd-p26-and-p27-correction) record below for the original endpoint checks, parameter checks, lint/build results and execution context. Those historical checks were not rerun in Step 24.
- **Remaining limitations:** The archived endpoint observations are historical, not current service guarantees. Its pending browser statements describe that earlier stage. The standalone client sorting utility is only a fallback for endpoints proven unable to sort and cannot provide global ordering across unloaded pages. P2.6/P2.7 are the archived audit's references; the available ORIGINAL_PRD.md section 3, Step 9 classifies sorting/pagination as FULL without reproducing that detailed numbering.

## Current outcome: Step 18.2

Recommendation: PASS for final user acceptance of Step 18.2 and completion of Step 18. Catalog Skeleton Loading is implemented, targeted verification passed, and documentation is reconciled. No confirmed blocking Catalog defect was found. Step 17 was completed and accepted by the user. No Step 19 work began.

Only README.md, PLAN.md and REPORT.md were edited in Step 18.2. Production source, PROJECT_SPEC.md, API services, types, configuration and dependencies were not modified. No Git commands, installations, live API calls, real browser/storage operations or deployment were performed. Build commands regenerated their normal output.

### Newly executed results

| Command/check | Result |
| --- | --- |
| npm run lint | PASS, exit 0, no reported errors/warnings |
| npm run build | PASS, exit 0; TypeScript and Vite, 144 modules |
| Targeted dependency-free Catalog checks | 31 PASS / 0 FAIL / 0 SKIP |

| Area | PASS | FAIL | SKIP |
| --- | --- | --- | --- |
| Structure | 6 | 0 | 0 |
| Transitions | 9 | 0 | 0 |
| Catalog behavior | 15 | 0 | 0 |
| Rendered markup | 1 | 0 | 0 |
| Total | 31 | 0 | 0 |

All 31 registered cases executed in this stage. Browser-only scenarios are outside this count, not implicitly passed or skipped automated cases. Step 18.1 also reported 31 passes, but those are a separate historical execution, not the source of this new result and not added to it. Step 17.4’s historical 72 cases were not rerun as a full suite here.

### Execution method and limits

Freshly loaded actual current TypeScript modules were transpiled in memory using the already installed TypeScript compiler and evaluated in isolated VM contexts. The existing dependency-free harness was reused with a new, separate result ledger. Each Catalog test created new simulated hooks, controlled deferred API responses, effect dependency cleanups, a virtual 400 ms timer and a simulated URL/history store. The skeleton also ran through actual React server rendering; that checks emitted HTML, not browser layout or screen-reader behavior.

No dependency, framework or permanent test file was added. Fetch was mocked/blocked and no browser storage was used. Component state timing, request cancellation and Back/Forward tests are simulations: they do not prove real React scheduling, browser events, network timing or assistive-technology output. Types are checked by the production TypeScript build; runtime structure checks alone do not prove a TypeScript contract.

### New executed case ledger

| # | Area | Scenario | Result |
| --- | --- | --- | --- |
| 1 | Structure | One status with screen-reader-only loading message | PASS |
| 2 | Structure | 12 hidden decorative list cards with unique keys | PASS |
| 3 | Structure | Responsive grid classes match actual ProductGrid | PASS |
| 4 | Structure | Square image/title/description/price/action shapes | PASS |
| 5 | Structure | No interactive focusable image or animated elements | PASS |
| 6 | Structure | Typed props control count and searching announcement | PASS |
| 7 | Transitions | Initial Catalog loading uses existing page size and message | PASS |
| 8 | Transitions | Success replaces skeleton with grid and pagination | PASS |
| 9 | Transitions | Product error replaces skeleton with alert and Retry | PASS |
| 10 | Transitions | Retry starts new request/skeleton and then succeeds | PASS |
| 11 | Transitions | Empty Catalog shows empty state without skeleton/pagination | PASS |
| 12 | Transitions | Empty search retains feedback and Clear search | PASS |
| 13 | Transitions | Out-of-range page shows recovery not skeleton | PASS |
| 14 | Transitions | Short final page shows actual product count | PASS |
| 15 | Transitions | Category loading does not block default product results | PASS |
| 16 | Catalog behavior | 400 ms debounce trims query without category refetch | PASS |
| 17 | Catalog behavior | Rapid query edits replace debounce timer | PASS |
| 18 | Catalog behavior | Obsolete success cannot overwrite newer search result | PASS |
| 19 | Catalog behavior | Obsolete failure cannot overwrite newer search result | PASS |
| 20 | Catalog behavior | Unmount aborts category/product requests without late state updates | PASS |
| 21 | Catalog behavior | Unmount clears pending debounce before it changes URL | PASS |
| 22 | Catalog behavior | Selected category waits for validation and preserves sort/page | PASS |
| 23 | Catalog behavior | Category failure keeps independent feedback and retry recovers | PASS |
| 24 | Catalog behavior | Unknown category canonicalizes URL without invalid fetch | PASS |
| 25 | Catalog behavior | Category selection clears search/resets page and preserves sort | PASS |
| 26 | Catalog behavior | Sort resets page and preserves category and unrelated URL parameters | PASS |
| 27 | Catalog behavior | Pagination preserves search/sort and avoids unchanged-page refetch | PASS |
| 28 | Catalog behavior | Clearing search restores Catalog preserving sort | PASS |
| 29 | Catalog behavior | Simulated Back/Forward does not revive abandoned search drafts | PASS |
| 30 | Catalog behavior | Empty category preserves category-specific empty message | PASS |
| 31 | Rendered markup | Actual React server markup has one status and twelve hidden noninteractive cards | PASS |

### Source inspection and contract

- ProductGridSkeleton accepts typed count/message props, renders a fixed decorative list with no data fetching, images, animation or interaction, and uses exactly one status region with an sr-only message. The list is aria-hidden; there are no focusable placeholders.
- Skeleton and ProductGrid share grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3. Square image, text, price/rating and action shapes approximate ProductCard. Placeholder heights are approximate; arbitrary real content/result counts can still shift layout.
- Catalog passes count={productPageSize}; the actual API service constant remains 12. It retains !currentResult and the original query-dependent Loading products…/Searching products… strings.
- No new loading state, hook, API abstraction or dependency was introduced. Existing request keys, effects, AbortController, query/category/sort/page handling, empty/error/retry and unavailable-page handling remain.
- The skeleton can appear while debounce is pending or a selected category awaits validation. A category load failure can leave skeletons visible with independent category error/Retry until category recovery; this preserves the existing lifecycle. A settled product request error replaces skeletons with its error/Retry.

These are source-level findings, not extra passed cases. Inspected files: src/components/product/ProductGridSkeleton.tsx, src/pages/CatalogPage.tsx, src/components/product/ProductGrid.tsx, src/components/product/ProductCard.tsx, src/api/products.ts, src/types/product.ts and src/utils/catalogSearchParams.ts.

### Evidence provenance

| Evidence | Attribution |
| --- | --- |
| Step 18.2 new automation | 31 PASS / 0 FAIL / 0 SKIP plus fresh lint/build above. No browser tests. |
| Source-level inspection | Contract findings above; not added to automated counts. |
| Step 18.1 historical automation | 31 PASS / 0 FAIL / 0 SKIP and lint/build PASS, as previously reported. |
| User-confirmed browser acceptance | User confirmed Step 18.1 works successfully in the browser. This is general acceptance; the message did not enumerate every viewport, fault, keyboard or screen-reader scenario. |
| Prior stage evidence | Step 17 accepted; earlier 72-case regression evidence and Step 16/Profile browser confirmations are retained below as historical records. |

Automated checks compare controlled inputs and outputs; browser acceptance checks the running interface and real interactions. Actual server-rendered markup is stronger evidence than a mock JSX shape for HTML output, but still cannot establish visual rendering or accessible announcement timing.

### Remaining unverified browser and delivery scenarios

1. Screen-reader loading announcements, timing and repeated query transitions.
2. Every specific mobile/tablet/desktop viewport and layout movement under throttled loading; general browser success does not enumerate these.
3. Real network failure/cancellation races, product Retry and category-error recovery in a browser.
4. Full browser Back/Forward, keyboard-focus and post-loading Product Details/Add to Cart regression, unless separately confirmed in detail.
5. Current hosted direct-route behavior after deployment. No host was contacted or updated here.
6. Original-PRD delivery evidence: repository/commit count, Issues, PRs and demonstration materials. No Git operations were performed.

Known broader limitations remain: external product/image availability, browser-shared nontransactional storage, simulated status and payments, and no secure per-user order isolation. Login now requires both Username and Password following Step 21, superseding the earlier username-only form. Authentication remains simulated and session-only: AuthProvider receives and stores only the username; no real password verification or backend authentication is implemented. These limitations were not changed by the Catalog loading UI. Theme preferences and OOP services remain explicitly optional. Completing this feature does not establish audited compliance with every original-PRD detail.

### Documentation reconciliation and acceptance

README now describes Catalog skeleton behavior and separately sourced results. PLAN records accepted Step 17, implemented/browser-confirmed Step 18.1 and verified Step 18.2; Catalog Skeleton Loading is removed from current outstanding requirements. REPORT contains this current ledger and preserves prior evidence below. No production correction was needed. Final user review of Step 18.2 remains pending.

Suggested commit: docs: record Catalog skeleton verification and completion.

## Historical Step 17.4 record (superseded where noted)

The following report is retained as historical evidence. Its “Catalog Skeleton Loading outstanding/text loading” and “Step 17 awaiting acceptance” statements describe the state then, not the current project. Step 17 has since been accepted; Step 18 implemented the skeleton and the current verification above supersedes those statuses. The historical 72-case count remains separate.

Its earlier username-only Login form descriptions and approved password exception are superseded by Step 21, which added the required Password field. They are retained below as historical records, not current form behavior. The username-only AuthUser and in-memory AuthProvider API remain unchanged.

### Step 17.4 outcome

Ready for final user acceptance of Step 17.4. No confirmed blocking production defect was found by the executed checks. Only README.md, PLAN.md and REPORT.md were edited. Production source, PROJECT_SPEC.md and dependency files remain unchanged. No Git commands, live API requests, browser storage operations or deployment were performed.

#### Newly executed verification

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

#### Executed case ledger

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

### Source-level inspection

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

### Evidence provenance

| Evidence | Meaning |
| --- | --- |
| New automated checks | The 72 cases above and this stage’s lint/build. Utility execution and simulated component behavior. |
| Source inspection | Architecture observations above; not counted as extra tests. |
| Previously reported automation | Step 17.2: 14/14; Step 17.3: 33/33; Step 16 final verification: 50/50. Historical reports, not newly rerun totals. |
| User-confirmed browser acceptance | CORE and Step 16 officially completed by the user, including Step 16 final browser regression PASS. Step 17.3 acceptance explicitly confirmed Profile display/edit/save, Header update, normal feedback, blank validation, protection/return navigation, Logout/refresh, mobile/keyboard use and the previously agreed checklist. |
| Unverified in Step 17.4 | No browser operation, live endpoint call, hosted check, real storage fault injection, screen-reader session, or Git/delivery audit. |

Automated regression checks supply known inputs and compare results; they help catch changed calculations and transitions. Browser acceptance checks the running interface: actual navigation, focus, layout, storage and announcements. Calling a simulated handler or examining JSX does not prove these real-browser interactions. User-confirmed browser results retain that attribution.

### Known limitations and approved decisions

- Username-only Login is explicitly approved and differs from PROJECT_SPEC.md section 6.4 username/password wording. PROJECT_SPEC.md was not edited. No password, backend, new Profile field or authentication persistence was added.
- Auth/Profile reset on refresh or Logout. shop_cart, shop_orders and shop_reviews persist per browser profile/site origin. History is shared across simulated usernames; route guards do not provide secure per-user authorization.
- Orders include submitted contact and shipping information; use sample data. There is no payment processor, backend order service or real delivery status.
- Storage read-modify-write is not transactional across tabs. History refreshes on mount/Retry rather than synchronizing continuously. Deleting site data loses local history. Cart storage errors allow in-memory operation; order storage errors block order success/Cart clearing.
- Historical prices/totals/addresses remain fixed. Reorder uses current products and may reprice existing Cart units when adding accepted units, with notice.
- VM simulations do not model the full React scheduler, DOM, browser event dispatch, Strict Mode lifecycle, actual network cancellation or assistive technology. Mock failures are not evidence of real browser fault handling.
- No confirmed product defect was found by the executed checks. Coverage is bounded and does not prove every possible failure path.

### Remaining browser-only and delivery checks

The agreed Step 17.3 browser checklist is user-confirmed PASS; it is not universally pending. The following remain unverified in this stage:

1. Real storage quota/access faults during Checkout and retry in a disposable browser profile.
2. Browser network timing for Reorder cancellation, partial failures and repricing announcements.
3. External Auth changes while a Profile draft is edited; simulated logic passed, but normal UI has no separate concurrent editor.
4. Screen-reader announcement timing, contrast audit and fresh full responsive regression at 375, 768 and 1440 px beyond the user-confirmed Profile checks.
5. Multi-tab storage races, a documented architectural limitation.
6. Current hosted direct-route refresh and Login return after any future approved deployment. Netlify deployment is user-reported, not contacted here.
7. Repository/commit count, Issues, PRs, demo/presentation materials and original-PRD delivery evidence; no Git commands were run.

Useful future journey: Catalog → Product Details → Cart → Login → Checkout → confirmation → View order → Reorder → Cart; then Profile save → Header update → Logout → protected-route return. Compare old review authors and saved order totals before/after Profile editing. Use disposable sample data for fault tests.

### Remaining FULL work and final acceptance

Catalog Skeleton Loading (PROJECT_SPEC.md section 7) is outstanding and needs separate approval; Retry already exists. Theme preferences and OOP services are explicitly optional. Section 14 delivery evidence remains unaudited. The original PRD was not found in the earlier repository audit, so omitted detailed criteria must not be invented or waived.

Step 17.4 executed verification and documentation are complete; final user acceptance is pending. No next stage started. Suggested commit: `docs: reconcile project status and Step 17 regression evidence`.

### Historical evidence retained

The following records are earlier observations, not Step 17.4 executions or claims about current live services.

- CORE established shared layout, routes, typed fetching, gallery, persistent Cart, simulated Login, Checkout and confirmation. Its manual journey covered quantities, refresh, Login return, validation, Cart clearing and responsive/keyboard review. Later user sign-off supersedes old universally pending browser labels and the old four-field/nonpersisted-order description.
- Early service checks returned 30 default products, distinct details for IDs 1 and 5 and a nonexistent-product 404. The default-batch observation is historical; current pagination requests 12.
- Earlier deployment preparation reported dist assets, Netlify fallback and Vercel rewrite checks. A permitted local preview reportedly served the app for five direct routes after a sandbox loopback restriction. This is not current hosted verification.
- The earlier tracked-file/environment check was not a Git-history secret audit. No Git operations occurred in Step 17.4.

#### Archived sorting/pagination correction

The archived section below preserves useful earlier evidence verbatim. Endpoint counts, live calls and sandbox retries are historical. Its final references to pending browser checks describe that earlier stage; they do not override subsequent user sign-offs or the provenance table above.

### PRD P2.6 and P2.7 correction

The approved correction supersedes the earlier page-local sorting plan. Catalog requests now use a shared page size of 12. Sort selection is part of the request state and resets to page 1 while preserving the active Search or Category mode. Default omits sorting parameters. Other options map to API sortBy and order parameters.

Live endpoint checks confirmed price ascending, price descending, and rating descending ordering across the complete default, phone-search and smartphones-category result sets. Sorted pages at skips 0 and 12 matched slices of the respective complete sorted API responses. Title sorting also produced consistent server page slices, with server collation differing from plain JavaScript localeCompare. Its numeric-looking titles can appear in natural numeric order. The API title order is preserved.

The standalone sortProducts utility is retained only as a documented fallback for endpoints proven unable to sort. Catalog currently uses server sorting for all three modes. Network failures continue to use error and Retry behavior. Sorting a loaded page alone cannot provide globally ordered pagination, so any future fallback must explicitly disclose that limitation.

After the correction, lint and build passed. Mocked checks covered all four non-default API parameter mappings, omission for Default, and 12-item pagination defaults in all modes. Live calls through the updated functions confirmed ascending prices across pages 1 and 2. Observed totals were 194 catalog items, 23 phone search results, and 16 smartphones, producing 17, 2, and 2 pages. Search and Category final pages contained 11 and 4 items. The sandbox initially blocked DNS; the approved retry with network access passed.

A controlled handler check confirmed sorting from page 2 resets to page 1 and preserves the active Search or Category mode. Mode changes retained the chosen sort. Browser interaction and hosted regression checks remain pending. Existing historical browser checklists above describe CORE review and should be supplemented by the current pagination and sorting checks.


