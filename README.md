# 10X Shop

10X Shop is a front-end diploma project that demonstrates a complete shopping flow with sample product data and simulated checkout.

## Features

- Browse the DummyJSON catalog and open a product detail page with an image gallery when multiple images are available.
- Add products, change quantities, remove items, and review totals. The header shows the total quantity.
- Sign in with a username and return to protected checkout after login.
- Review the order, validate shipping and contact fields, and see a local confirmation after submitting. The cart clears after success.

## Setup and commands

The project uses React 19, strict TypeScript, Vite, React Router, Tailwind CSS v4, and ESLint. The final checks use Node.js 24 and npm.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite.

| Command | Purpose |
| --- | --- |
| `npm run lint` | Check source code and React hook rules. |
| `npm run build` | Check TypeScript and generate production files in `dist`. |
| `npm run preview` | Serve the generated build locally. Run the build first. |

## Project structure

| Folder | Responsibility |
| --- | --- |
| `src/api` | Fetch and validate DummyJSON responses. |
| `src/components` | Shared layout, product cards, gallery, and cart rows. |
| `src/context` | Shared cart and authentication state. |
| `src/pages` | Catalog, product details, cart, login, checkout, and not found. |
| `src/routes` | Route definitions and checkout access guard. |
| `src/types`, `src/utils` | Shared data models, price helpers, and cart storage. |

The app calls [DummyJSON Products](https://dummyjson.com/docs/products) using `GET /products` and `GET /products/{id}`. The catalog displays the default batch and depends on API and image CDN availability. Requests support cancellation and the UI offers retry for recoverable failures.

The cart saves under `shop_cart` in browser localStorage. It is specific to the browser and site origin. Invalid storage falls back safely. Prices display in USD and totals use listed unit prices in cents.

Login accepts any nonblank username for demonstration. Auth state resets on refresh and the route guard controls navigation only. Checkout creates an in-memory confirmation and uses no payment processor or order backend. Form data and confirmations are not persisted. The FULL backlog includes search, filters, pagination, promos, order history, and profile features.

## Deployment

Use the Vite preset on Vercel or Netlify, build with `npm run build`, and publish `dist`. The app requires no application environment variables. Use Node.js 24 to match the verification environment.

- Vercel uses the SPA rewrite in `vercel.json`. [Vercel Vite guidance](https://vercel.com/docs/frameworks/frontend/vite#using-vite-to-make-spas)
- Netlify uses the rule from `public/_redirects`, which Vite copies into `dist`. [Netlify rewrite guidance](https://docs.netlify.com/manage/routing/redirects/rewrites-proxies/)

An SPA fallback serves `index.html` for a direct visit to a client-side route so React Router can handle the URL. After publishing, directly open and refresh `/products/1`, `/cart`, and `/checkout`. Check that a signed-out checkout visit reaches Login and that an unknown path displays the app's Not Found page.

See [PLAN.md](PLAN.md) for review status and [REPORT.md](REPORT.md) for evidence and the manual test plan.
