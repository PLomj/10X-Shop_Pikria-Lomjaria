# 10X Shop — Project Specification

## 1. Project Overview

**Project:** 10X Shop  
**Type:** Individual Front-end Diploma Project  
**Original specification:** 10X Shop PRD v1.1 (2026)  
**Application:** Single Page Application (SPA)

Build a responsive online store using React and TypeScript.

The application must allow customers to browse products, view product details, manage a shopping cart, log in using a simple local form, and complete a simulated checkout.

The implementation must follow the original 10X Shop PRD.

## 2. Development Priorities

The project has two implementation levels:

### CORE — Mandatory

Complete all CORE requirements before implementing FULL features.

### FULL — Extended

Implement FULL requirements only after CORE is complete and verified, and after user approval.

Do not introduce optional features that delay mandatory functionality.

## 3. Technology Stack

- React 19
- TypeScript with strict mode
- Vite
- React Router
- Tailwind CSS v4
- ESLint
- DummyJSON REST API
- React Context API
- React Hooks: useState, useEffect, useContext
- Browser localStorage where appropriate
- Git and GitHub

Use functional React components.

Avoid `any` types.

Use immutable state updates.

Do not introduce Redux, Zustand, Next.js, or additional frameworks unless explicitly approved.

## 4. Current Project Status

The project already exists in the `online-store` directory.

Completed:

- React + TypeScript + Vite initialized.
- ESLint selected.
- Dependencies installed.
- TypeScript dependency compatibility issue resolved.
- Vite development server successfully started.
- Default Vite demo UI removed.
- Basic App component displays the project title.

Do not recreate the project.

Inspect the actual project files before making changes.

## 5. Required Application Routes

| Route           | Page            | Access    | Priority |
| --------------- | --------------- | --------- | -------- |
| `/`             | Product Catalog | Public    | CORE     |
| `/products/:id` | Product Details | Public    | CORE     |
| `/cart`         | Shopping Cart   | Public    | CORE     |
| `/login`        | Login           | Public    | CORE     |
| `/checkout`     | Checkout        | Protected | CORE     |
| `*`             | Not Found       | Public    | CORE     |
| `/orders`       | Order History   | Protected | FULL     |
| `/orders/:id`   | Order Details   | Protected | FULL     |
| `/profile`      | User Profile    | Protected | FULL     |

Use React Router and a shared layout with Header and Footer.

## 6. CORE Functional Requirements

### 6.1 Product Catalog

- Fetch products from DummyJSON API.
- Define TypeScript interfaces for API responses.
- Display products using reusable ProductCard components.
- Display product image, title, and price.
- Allow navigation to Product Details.
- Allow adding products to the cart.
- Handle loading, error, and empty states.

### 6.2 Product Details

- Use the product ID from the URL.
- Fetch the selected product from DummyJSON.
- Display product information, including image, title, description, and price.
- Allow adding the product to the cart.
- Handle invalid product IDs and API failures.

### 6.3 Shopping Cart

- Add products to the cart.
- Update product quantities.
- Remove products.
- Calculate totals correctly.
- Require positive integer quantities.
- Update the UI without page reloads.
- Manage shared cart state using React Context.
- Use immutable updates.
- Persist the cart using localStorage where implemented.

### 6.4 Login

- Implement a local controlled login form.
- Use username and password fields.
- Validate required fields.
- Store simple authentication state in React Context.
- Protect the Checkout route.
- Redirect unauthenticated users to Login.
- Return users to Checkout after login.

A real authentication backend is not required.

Do not store passwords in localStorage.

### 6.5 Checkout

- Implement a controlled form.
- Required fields:
  - fullName
  - email
  - address
  - city
- Validate required fields.
- Display the cart total.
- Simulate order placement locally.
- Display an order confirmation.
- Clear the cart after successful checkout.

Real payments and banking integrations are not required.

### 6.6 Global Requirements

- Shared Header and Footer.
- Navigation between routes.
- 404 Not Found page.
- Responsive layout.
- Accessible interactive elements.
- Reusable React components.
- Correct TypeScript typing.
- Conditional rendering.
- Proper React list keys.
- At least one meaningful use of props.children composition.

## 7. FULL Functional Requirements

Implement only after CORE completion and approval.

### Catalog Enhancements

- Product search.
- Debounced search.
- Category filtering.
- Price sorting.
- Pagination.
- URL-based search and filter state.
- Skeleton loading and retry interactions.

### Product Enhancements

- Product image gallery.
- Reviews.
- Related products.
- Additional product information and states.

### Cart Enhancements

- Stock restrictions.
- Promo code support, including `10X10`.
- Extended discount calculations.
- Shipping calculations.

### Checkout Enhancements

- Additional shipping and contact fields.
- Extended form validation.
- More detailed confirmation states.

### Orders

- Order history.
- Order details.
- Local order persistence.
- Order status display.

### Profile

- Profile information.
- Profile editing.
- Logout.
- Optional theme preferences.

### Additional Architecture

- Custom hooks where justified.
- Extended data models.
- Optional OOP-based services.
- Improved performance and accessibility.

## 8. API Requirements

Base URL:

`https://dummyjson.com`

Important endpoints:

- `GET /products`
- `GET /products/{id}`
- `GET /products/search?q=...`
- `GET /products/categories`
- `GET /products/category/{slug}`

The CORE catalog uses product data from the API.

The API response must be correctly typed.

Do not invent product data when the API is available.

Do not implement a backend server unless explicitly approved.

## 9. TypeScript Requirements

Define reusable types and interfaces for:

- Product
- ProductsResponse
- CartItem
- CartState
- AuthUser
- LoginFormValues
- Checkout form values

Additional order and review models can be introduced when needed.

Use strict TypeScript.

Avoid unnecessary type assertions.

Explain new TypeScript concepts when introducing them.

## 10. Suggested Project Architecture

```text
src/
  api/
  types/
  context/
  components/
    ui/
    layout/
    product/
    cart/
  pages/
  routes/
  utils/
```

Additional directories may be introduced when necessary.

Follow separation of concerns.

Do not put the entire application inside App.tsx.

Avoid unnecessary abstraction in CORE.

## 11. React Requirements

Use:

- Functional components
- Typed props
- useState
- useEffect
- useContext
- Context providers
- Controlled forms
- Conditional rendering
- Array map with stable keys
- Immutable state updates
- Component composition
- Event handlers and callback props

Explain the data flow when introducing state management.

## 12. Styling Requirements

Use Tailwind CSS v4 for the application UI.

Create a responsive design for mobile and desktop screens.

Keep styling consistent across pages.

Use semantic HTML and accessible controls.

Do not add unnecessary UI libraries without approval.

## 13. Quality and Verification

After each implementation step:

1. Check TypeScript errors.
2. Run ESLint.
3. Verify the development build.
4. Test the implemented functionality.
5. Check relevant loading and error states.
6. Explain what changed.
7. Identify any remaining issues.

Before CORE completion, verify the complete customer journey:

Catalog → Product Details → Cart → Login → Checkout → Confirmation.

## 14. Documentation and Delivery

Maintain documentation appropriate to the original PRD, including:

- README.md
- PLAN.md
- REPORT.md
- GitHub repository
- Deployment information

Document setup instructions, implemented features, testing results, and known limitations.

Additional FULL process requirements, such as Issues, Pull Requests, and demonstration materials, should be handled in the FULL phase.

## 15. Codex Collaboration Rules

Always read AGENTS.md before beginning work.

Before implementing a feature:

1. Explain the goal.
2. Identify relevant files.
3. Explain the proposed approach.
4. Wait for user approval.
5. Implement only the approved step.
6. Run appropriate checks.
7. Summarize the changes.
8. Explain important React and TypeScript concepts.
9. Wait before proceeding.

Do not implement multiple major features in a single step.

Do not silently change the architecture or install dependencies.

## 16. Source of Truth

This file is a working summary of the original 10X Shop PRD v1.1.

The original PRD contains more detailed acceptance criteria, field definitions, API parameters, validation rules, and technical requirements.

If the original PRD is available in the repository, consult it for exact implementation details.

If this summary conflicts with the original PRD, the original PRD takes precedence.

Never assume that an omitted requirement is optional.

## 17. Immediate Next Task

Do not implement features yet.

First:

1. Read AGENTS.md and PROJECT_SPEC.md.
2. Inspect the existing project.
3. Verify the installed dependencies and TypeScript configuration.
4. Compare the existing code against CORE requirements.
5. Propose a step-by-step CORE implementation plan.
6. Wait for approval before making changes.
