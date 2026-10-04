# StoreRate

StoreRate is a React frontend connected to the Express API and MySQL database in `backend/`. The frontend sends requests to `/api`; during local development, Vite proxies those requests to the backend.

## Run locally

1. Configure `backend/.env` with:

   ```env
   DB_HOST=localhost
   DB_USER=your_mysql_user
   DB_PASSWORD=your_mysql_password
   DB_NAME=store_rating
   JWT_SECRET=replace_with_a_long_random_secret
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=replace_with_a_strong_password
   PORT=4000
   ```

   `DB_NAME` and `PORT` are optional. The MySQL user needs permission to create the database and tables. On startup, the backend initializes the schema and creates the configured admin account if the database does not already contain an admin.

2. In `backend/`, install dependencies and start the API:

   ```sh
   npm install
   npm run dev
   ```

3. In `frontend/`, install dependencies and start Vite:

   ```sh
   npm install
   npm run dev
   ```

   Open the local URL printed by Vite. To use a different backend origin with the development proxy, set `VITE_BACKEND_URL` in `frontend/.env`. For deployments without the proxy, set `VITE_API_BASE_URL` to the API base URL (including `/api`).

## Accounts

- Sign in as an administrator using the `ADMIN_EMAIL` and `ADMIN_PASSWORD` configured for the backend.
- Create customer accounts from the sign-up form.
- Create owner accounts through the authenticated `POST /api/admin/users` endpoint with `"role": "owner"`.
- Authenticated requests use the JWT returned by the backend. The session and token are stored in browser local storage; signing out removes both.

The backend must be running and connected to MySQL for sign-in, sign-up, dashboards, store creation, and ratings to work.
