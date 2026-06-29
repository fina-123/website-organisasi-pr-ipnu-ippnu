# Backend for IPNU IPPNU

This backend provides a MySQL/MariaDB API for member registrations.

## Setup

1. Install dependencies:
   ```bash
   cd server
   npm install
   ```

2. Configure your database in the root `.env` file:
   ```env
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=
   DB_DATABASE=ipnu_ippnu
   ```

3. Run the database schema in XAMPP/MySQL using `server/schema.sql`.

4. Start the backend:
   ```bash
   cd server
   npm start
   ```

5. Start the frontend as usual from the project root:
   ```bash
   npm run dev
   ```

The frontend will send member registration requests to `http://localhost:4000/api/member-registrations`.

## API Endpoints

### Member Registrations
- `GET /api/member-registrations` — Get all registrations
- `POST /api/member-registrations` — Submit new registration
- `PATCH /api/member-registrations/:id/status` — Approve/reject registration

### Created Accounts (auto-created on approval)
- `GET /api/created-accounts` — List all created accounts (no passwords returned)
- `POST /api/created-accounts/approve` — Approve registration & create account with hashed password
- `POST /api/created-accounts/reset-password` — Reset password (hash stored, password returned once in response)
