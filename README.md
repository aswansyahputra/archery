# Horsebow Scoring PWA

Offline-first Progressive Web App for Traditional Archery / Horsebow (FESPATI) scoring and training analysis.

- Live: <https://aswansyahputra.github.io/archery/>
- Default target: FESPATI Lapangan (6-ring, inner `+` tiebreaker), 18 m.
- Other targets: WA 10-zone, WA 5-zone, NFAA, Korean, Turkish, Asiatic.
- Languages: Bahasa Indonesia (default) + English.
- Theme: Light (default) + Dark.

## Stack

- Next.js 14 (App Router) with `output: 'export'` for static GitHub Pages hosting.
- React + `react-router-dom` `HashRouter` (single-page app inside a static export).
- Supabase (Auth via Google OAuth + Postgres tables with RLS).
- Dexie + IndexedDB + outbox queue for offline-first sync (last-writer-wins).
- Tailwind CSS + shadcn/ui-style primitives + Lucide icons.
- i18next + react-i18next (`id` default).
- `@serwist/next` for service worker (precache + runtime caching).
- OpenRouter (BYOK) for AI session analysis.

## Local development

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

To build a static export:

```bash
npm run build
npx serve out
```

## Setup

### 1. Supabase

1. Create a Supabase project.
2. In **SQL Editor**, paste and run `supabase/schema.sql`.
3. In **Authentication → Providers**, enable Google and configure the OAuth credentials.
4. In **Authentication → URL Configuration**, add:
   - `http://localhost:3000` (dev)
   - `https://aswansyahputra.github.io/archery` (prod)
5. In **Settings → API**, copy the project URL and the anon key.

Add the values to GitHub under **Settings → Secrets and variables → Variables**:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. AI (optional)

The app does not require AI to function. To enable the AI Analysis feature:

1. Open the app, go to **Settings** or any completed session.
2. Follow the in-app guide to obtain a free OpenRouter key at <https://openrouter.ai>.
3. Paste the key (starts with `sk-or-…`) into the setup modal. The key is stored only in your browser's localStorage; never sent to Supabase.

## License

MIT.
