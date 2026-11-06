# 10X Shop project plan

## CORE

CORE is complete by user sign-off, retaining the explicitly approved username-only Login exception to PROJECT_SPEC.md section 6.4.

| Step | Status |
| --- | --- |
| 1. Router/Tailwind | Complete |
| 2. Shared layout/routes | Complete |
| 3. DummyJSON Catalog | Complete |
| 4. Product Details | Complete |
| 5. Persistent Cart | Complete |
| 6. Simulated Login/Checkout guard | Complete; username only by approval |
| 7. Checkout/confirmation | Complete; later extended with saved orders |
| 8. Verification/docs/deployment readiness | CORE accepted; Netlify deployment user-reported. Hosted behavior not rechecked in Step 17.4. |

## FULL implementation and verification

| Step | Scope | Status/evidence |
| --- | --- | --- |
| 9 | Search/debounce/request states | Implemented; source inspected |
| 10 | Categories/filtering | Implemented; source inspected |
| 11 | Sorting/pagination | Implemented; API sorting and 12-item pages supersede page-local sorting |
| 12 | URL state/history/shareable links | Implemented; source inspected |
| 13 | Advanced Product Details/reviews/related products/tabs | Completed previously; source inspected |
| 14 | Cart reducer/persistence/stock/promo/shared pricing/controls | Implemented; targeted Step 17.4 checks passed |
| 15 | Seven-field Checkout/validation/submission/confirmation | Implemented; targeted Step 17.4 checks passed |
| 16 | Orders/storage/status/Reorder | Officially completed by user; targeted Step 17.4 checks passed |
| 17.1 | Profile contract | Approved: username only, memory only |
| 17.2 | Typed updateUsername API | Implemented; prior 14/14 checks and lint/build reported PASS |
| 17.3 | Profile UI/route/redirects/Header | Implemented; prior 33/33 checks and lint/build reported PASS; browser acceptance user-confirmed PASS |
| 17.4 | Regression and documentation | 72/72 new checks and lint/build PASS; docs reconciled; awaiting final user acceptance |

Earlier counts are historical and not added to the new 72-case total. Simulated component checks are not browser acceptance. See [REPORT.md](REPORT.md).

## Remaining work requiring separate approval

| Item | Specification | Status |
| --- | --- | --- |
| Catalog Skeleton Loading | Section 7 Catalog | Outstanding; text loading and Retry exist. Product Details skeleton is separate. |
| Delivery evidence/materials | Section 14 | Issues, PRs, demonstration materials, repository/commit evidence and current hosted verification unaudited here. Confirm original PRD criteria before declaring complete. |
| Continued accessibility/performance review | Sections 7, 12, 13 | Ongoing quality work; simulated coverage is bounded. |
| Theme preferences | Section 7 Profile | Explicitly optional; not started |
| OOP services | Section 7 Architecture | Explicitly optional; avoid replacing working utilities unnecessarily |

The original PRD was not found in the earlier repository audit. PROJECT_SPEC.md is a summary; omitted details must not automatically be waived. Its old initial-status text and password wording are left unchanged, with the actual approved implementation explained in README/REPORT.

## Review process

1. Step 17.4 changes only README, PLAN and REPORT.
2. Execute actual-source checks using isolated storage/API fixtures; no live network/browser storage.
3. Report failures and request approval before source corrections. No confirmed production defect was found in the executed checks.
4. Attribute user browser acceptance separately from new automation.
5. Stop for final review; do not begin another feature, deploy, install dependencies or execute Git automatically.

The goal of more than 40 meaningful commits is a user workflow goal, not a verified count. No artificial commit splitting is proposed. Suggested commit: `docs: reconcile project status and Step 17 regression evidence`.

## Historical planning context

The original CORE order—router/layout, Catalog, Product Details, Cart, Login, Checkout, verification—remains useful. Earlier statements that FULL work was future and all browser acceptance pending are superseded above. The original client-side sorting plan was superseded by the approved API sorting/12-item pagination correction.
