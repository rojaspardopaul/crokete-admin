# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server at http://localhost:4100
npm run build     # Production build (Vite)
npm run preview   # Preview production build
npm run test      # Run tests with Vitest
```

The dev server proxies `/api/` requests to `http://localhost:5065`. The actual API base URL is configured via env var `VITE_APP_API_BASE_URL` (default: `http://localhost:5055/v1`).

## Environment Setup

Copy `.env.example` to `.env.local` and fill in required values:

- `VITE_APP_API_BASE_URL` — backend API endpoint
- `VITE_APP_API_SOCKET_URL` — WebSocket server for real-time notifications
- `VITE_APP_CLOUD_NAME` + Cloudinary vars — image upload/management
- `VITE_APP_ENCRYPT_PASSWORD` — must be a 32-character hex string for encryption
- `VITE_APP_MYMEMORY_API_KEY` — optional, for in-app translation features

## Architecture

**Crokete Admin** is a React 18 + Vite admin dashboard for a pet-focused e-commerce platform. It uses React Router v5, Redux Toolkit, and React Query (TanStack v5).

### Data Flow

1. **HTTP layer** — `src/services/httpService.js` exports an Axios instance that automatically injects `Authorization: Bearer <token>` and a `company` header on every request. All feature services (e.g., `ProductServices`, `OrderServices`) import this instance.
2. **Server state** — React Query handles all API data fetching, caching, and invalidation.
3. **Global client state** — Redux Toolkit (`src/reduxStore/`) with two slices: `settingSlice` (shop settings, currency, language) and `dynamicDataSlice`. State is persisted to `localStorage` via redux-persist.
4. **UI state** — Four React contexts in `src/context/`: `AdminContext` (logged-in user), `ThemeContext` (light/dark), `SidebarContext`, and `ActionContext`.

### Key Directories

| Path | Purpose |
|------|---------|
| `src/pages/` | Full page components — one file per admin section |
| `src/components/` | Feature-scoped reusable components (product, order, customer, pet, vet, form, modal, drawer…) |
| `src/services/` | ~20 API service modules, one per domain |
| `src/routes/index.js` | Lazy-loaded route definitions |
| `src/routes/sidebar.js` | Sidebar navigation structure |
| `src/config/appConfig.js` | Centralized shop name, default currency, supported languages |
| `src/utils/` | Pure helper functions (currency, orders, product mapping, timezones, translations) |
| `src/lib/` | Shared utilities; `cn()` from `lib/utils.js` for conditional Tailwind class merging |
| `src/hooks/` | Custom React hooks |
| `src/assets/css/` | Global CSS; `tailwind.css` + `custom.css` |

### Routing & Code Splitting

`src/App.jsx` defines two route groups:
- **Public routes**: `/login`, `/forgot-password`, `/reset-password`, `/403`
- **Private routes**: everything else, wrapped in an auth guard

All page imports in `src/routes/index.js` use `React.lazy()` for automatic code splitting.

### Path Aliases

`@/` maps to `./src/` (configured in both `jsconfig.json` and `vite.config.js`). Use this alias for all internal imports.

### UI Components

Uses Radix UI primitives and shadcn/ui (see `components.json`). Icons come from `lucide-react`. Styling is Tailwind CSS.

### Image Uploads

All media is uploaded to Cloudinary. Look for upload helpers in `src/utils/` or service files that reference `VITE_APP_CLOUDINARY_*` env vars.

### Internationalization

`i18next` with a `MyMemory` API integration for auto-translation of new keys. Language files live under `src/assets/` or are fetched dynamically. The active language is stored in Redux.

### Deployment

The app can be deployed to:
- **GCP Cloud Run** — `Dockerfile-cloudrun` (Node 18 build → Nginx Alpine serve) + `cloudbuild-cloudrun.yaml`
- **GCP Cloud Storage** — `deploy-admin.sh` / `deploy-admin.ps1`
- **Vercel** — `vercel.json` present
