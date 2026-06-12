
  The page still works (shows skeletons), it just can't load data until you connect a real Supabase project.

  To fix it:

  1. Go to supabase.com → create a free account → New Project
  2. Once created, go to Project Settings → API
  3. Copy your Project URL and anon/public key
  4. Open .env in the project and replace the placeholders:

  VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
  VITE_SUPABASE_ANON_KEY=eyJhbGc...

  5. Restart npm run dev
  6. Go to Supabase → SQL Editor → paste and run supabase-schema.sql to create the tables and seed the 6 sample academies

  After that the cards will populate.

