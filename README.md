
  # Website Organisasi IPNU IPPNU

  This is a code bundle for Website Organisasi IPNU IPPNU. The original project is available at https://www.figma.com/design/uYlLRTQNV8ifT6IUmObS0J/Website-Organisasi-IPNU-IPPNU.

  ## Running the code

  Run `npm i` to install the dependencies.

Copy `.env.example` to `.env` and fill in your Supabase project values:

```bash
cp .env.example .env
```

Then set:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Create the Supabase table for member registrations using the SQL schema at `supabase/schema.sql`.

Run `npm run dev` to start the development server.

  