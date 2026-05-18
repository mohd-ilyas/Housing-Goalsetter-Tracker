# AlignX

Enterprise Goal Alignment & Quarterly Performance Tracking Platform

## Demo accounts

- employee@alignx.com
- manager@alignx.com
- admin@alignx.com

Use the in-app demo mode switcher to move instantly between Employee, Manager, and Admin without signing out.

## Run

```bash
npm install
npm run dev
```

## Supabase

The app runs in polished demo mode with seeded data. Supabase client wiring is in `src/services/supabase.ts`; set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to connect a project. A production-ready starter schema is included in `supabase.schema.sql`.
