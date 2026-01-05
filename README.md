# KurimaSense — Precision Agriculture Dashboard (starter)

This repository contains a Next.js (App Router) dashboard starter for precision agriculture.

Quick start (after creating the repo locally):

1. Install dependencies (see commands below).
2. Run the dev server:
   - `npm run dev` (or `pnpm dev` / `yarn dev`)
3. Create a branch and add the UI + map fixes as shown below, then push.

Dependencies required (examples):
- next, react, react-dom
- typescript, @types/node, @types/react
- tailwindcss, postcss, autoprefixer
- react-leaflet, leaflet, react-leaflet-draw, leaflet-draw
- framer-motion, lucide-react

See the repository root and the `app/` directory for the application code.

If the repository is empty, follow the exact commands in the repository setup section.

Deployment
----------

- Local development: `npm run dev`
- Build: `npm run build`

Environment
-----------

- Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_API_URL` for API calls.

Vercel
------

1. Create a new project on Vercel and link this repository.
2. In the Vercel dashboard, add `NEXT_PUBLIC_API_URL` under Project > Settings > Environment Variables.
3. Vercel will detect this as a Next.js app and run `npm run build` automatically.