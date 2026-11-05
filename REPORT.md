# 10X Shop final project report

## Objective and architecture

The project demonstrates a shopping journey using React, strict TypeScript, React Router, Vite, and Tailwind CSS. A shared layout renders navigation and an outlet for each page. API functions fetch and validate DummyJSON responses before passing data to the catalog or details page. Components render typed data and use conditional rendering for loading, empty, error, and success states. Effects cancel outdated requests with AbortController.

Cart Context shares immutable item updates, counts, and totals. The cart initializes from validated localStorage data and writes changes back to `shop_cart`. Cart and checkout use the same USD subtotal rule and overall total. Auth Context stores a username in memory. The checkout guard redirects to Login and records the destination for return navigation.

Checkout uses controlled inputs and field-specific validation for full name, email, address, and city. On success it saves a local confirmation with the name, reference, and total before clearing the cart. The confirmation takes precedence over the empty cart state. A submission guard prevents a second order from the same form. No payment or backend order is created.

## Requirements and evidence

PASS means there is direct evidence for the stated check. PARTIAL identifies a feature with remaining interaction checks.

| Area | Status | Evidence and limits |
| --- | --- | --- |
| Architecture, layout, routes and Not Found | PASS | Existing React render checks covered public route selection and the shared layout. See `src/routes/AppRoutes.tsx` and `src/components/layout/Layout.tsx`. |
| Catalog fetching, cards and request states | PARTIAL | Earlier live service check returned 30 products. Render checks covered loading and card markup. Live rendering, empty and failure displays, and retry interaction need browser checks. See `src/api/products.ts` and `src/pages/CatalogPage.tsx`. |
| Product details and gallery | PARTIAL | Earlier live service checks returned distinct products for IDs 1 and 5 and verified a 404. Render checks covered invalid IDs and gallery controls. Image loading, thumbnail clicks, and retry need browser checks. See `src/pages/ProductDetailsPage.tsx` and `src/components/product/ProductGallery.tsx`. |
| Cart updates, totals, empty state and persistence | PARTIAL | Seeded render checks covered count, totals and empty state. Storage checks covered invalid JSON, invalid rows and denied access. User interactions and refresh persistence remain to be checked. See `src/context/CartProvider.tsx`, `src/utils/cartStorage.ts` and `src/pages/CartPage.tsx`. |
| Simulated login and protected checkout | PARTIAL | Render checks verified access decisions and signed-in header markup. Login, logout, return navigation, and refresh need a browser walkthrough. Username-only login follows the approved Step 6 requirement. See `src/pages/LoginPage.tsx`, `src/context/AuthProvider.tsx` and `src/routes/ProtectedRoute.tsx`. |
| Checkout validation, confirmation and cart clearing | PARTIAL | Render checks covered the form, empty-cart state and matching totals. Submission, validation messages, duplicate prevention and cart clearing need interaction checks. See `src/pages/CheckoutPage.tsx`. |
| Strict TypeScript, lint and production output | PASS | Both project configurations now enforce strict mode. `npm run lint` and `npm run build` exited successfully with no warnings reported. No test script is defined. |
| Responsive layout and accessibility | NOT VERIFIED | Source inspection found semantic elements, form labels, image alt text and focus styles. Viewports, contrast, keyboard behavior and announcements need browser checks. |
| Deployment preparation | PARTIAL | Verified `dist/index.html`, CSS and JS, the copied Netlify fallback, and the Vercel rewrite configuration. A local Vite preview returned the app entry for five direct routes and served the built assets. Hosted behavior remains unverified. |

The first HTTP preview check hit a sandbox loopback access restriction. The retry with permission passed. The app uses the public HTTPS DummyJSON endpoint and requires no application environment variables. The tracked-file check found no environment or key files and was not a Git history secret audit.

## Manual browser test plan

Run `npm run dev`, or build and run `npm run preview`. Start signed out with an empty test cart and use sample shipping data such as `Alex Demo`, `alex@example.com`, `10 Sample Street`, and `Tbilisi`.

| Step | Action | Expected result |
| --- | --- | --- |
| 1 | Open Catalog | Products display with titles, images, prices, and Add to Cart. |
| 2 | Select a product title | The link targets the matching product ID. |
| 3 | Open Product Details | The URL and product details match the selection. |
| 4 | Add the product to Cart | Feedback appears and the header count increases by one. |
| 5 | Increase quantity in Cart | The same row increments and its subtotal and the total increase. |
| 6 | Add another product | Cart shows two distinct rows and the header counts all units. |
| 7 | Remove one product | Its row disappears and totals and count decrease. |
| 8 | Refresh the browser | The page renders and the simulated session resets. |
| 9 | Confirm Cart persistence | The remaining product, quantity, and total are restored. |
| 10 | Click Proceed to Checkout | The app requests the protected checkout route. |
| 11 | Log in when prompted | Login rejects a blank username and accepts a nonblank one. |
| 12 | Return to Checkout | The login flow returns to the requested checkout route. |
| 13 | Verify summary and total | Titles, quantities, subtotals, and total match Cart. |
| 14 | Submit blank fields and then an invalid email | Neither attempt places an order. |
| 15 | Verify validation errors | Errors appear by the relevant fields and entered values remain. |
| 16 | Submit valid sample details | One simulated order is created. |
| 17 | Verify confirmation | Customer name, order reference, and original total are visible. |
| 18 | Open Cart | Cart is empty and the checkout link is absent. |
| 19 | Verify header count | Header shows Cart (0). |
| 20 | Return to Catalog | Catalog remains accessible and loads products. |

Repeat the visual review at **375, 768, and 1440 px**. Check that header navigation wraps, the grid adapts, product details and checkout columns stack on mobile, cart controls remain usable, forms and confirmation fit, and the footer is reachable without horizontal scrolling. Tab through links, gallery buttons, cart controls and form fields. Check visible focus, label association, error messages, image alternatives, and text and control contrast.

Also check an invalid ID, a nonexistent product, a product with several images, a failed request followed by Retry, corrupted cart storage in a disposable browser session, logout on Checkout, and a direct visit to a protected route. After deployment, refresh nested routes and confirm that React Router receives them.

## Limitations and future work

The catalog depends on DummyJSON and shows its default batch. The cart is browser-local, login resets on refresh, and order confirmations exist only for the current page session. Full browser acceptance and hosted verification remain open. Future FULL work includes search, filters, pagination, richer product information, stock rules, promotions, shipping, order history, and profile management.

## PRD P2.6 and P2.7 correction

The approved correction supersedes the earlier page-local sorting plan. Catalog requests now use a shared page size of 12. Sort selection is part of the request state and resets to page 1 while preserving the active Search or Category mode. Default omits sorting parameters. Other options map to API sortBy and order parameters.

Live endpoint checks confirmed price ascending, price descending, and rating descending ordering across the complete default, phone-search and smartphones-category result sets. Sorted pages at skips 0 and 12 matched slices of the respective complete sorted API responses. Title sorting also produced consistent server page slices, with server collation differing from plain JavaScript localeCompare. Its numeric-looking titles can appear in natural numeric order. The API title order is preserved.

The standalone sortProducts utility is retained only as a documented fallback for endpoints proven unable to sort. Catalog currently uses server sorting for all three modes. Network failures continue to use error and Retry behavior. Sorting a loaded page alone cannot provide globally ordered pagination, so any future fallback must explicitly disclose that limitation.

After the correction, lint and build passed. Mocked checks covered all four non-default API parameter mappings, omission for Default, and 12-item pagination defaults in all modes. Live calls through the updated functions confirmed ascending prices across pages 1 and 2. Observed totals were 194 catalog items, 23 phone search results, and 16 smartphones, producing 17, 2, and 2 pages. Search and Category final pages contained 11 and 4 items. The sandbox initially blocked DNS; the approved retry with network access passed.

A controlled handler check confirmed sorting from page 2 resets to page 1 and preserves the active Search or Category mode. Mode changes retained the chosen sort. Browser interaction and hosted regression checks remain pending. Existing historical browser checklists above describe CORE review and should be supplemented by the current pagination and sorting checks.
