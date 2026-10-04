# StoreRate

StoreRate is a frontend-only prototype. It runs without a backend and stores its demo accounts, stores, ratings, and signed-in session in this browser's `localStorage`.

## Run locally

```sh
npm install
npm run dev
```

## Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@storerate.com` | `Admin@123` |
| Owner | `owner@storerate.com` | `Owner@123` |
| Customer | `user@storerate.com` | `User@123` |

- Admins can browse stores and add stores, optionally assigning an existing owner.
- Owners can browse all stores and all registered users.
- Customers can browse stores and submit or update ratings.
- New sign-ups create customer accounts.

Demo data is saved locally in the browser and is not shared with other browsers. Clear the `storerate_demo_database` and `storerate_session` local storage entries to reset the demo.

**This local authentication is for demonstration only.** It is not a secure substitute for a backend: browser storage and the demo passwords can be inspected or changed by the browser user. Do not use it for real accounts or sensitive information.
