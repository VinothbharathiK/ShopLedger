# Stack
- Node.js application using Express 4 and `body-parser` for JSON request bodies.
- Browser UI is static HTML, CSS, and JavaScript served from `public/`.
- Application data is persisted in `data/db.json` through `lib/store.js`.

# Module map
- `routes/customers.js` — lists customers and settlements; records Khata settlements.
- `routes/orders.js` — lists, creates, fetches, and cancels orders.
- `routes/products.js` — lists products and active coupons.
- `routes/reports.js` — dashboard, GST reconciliation, pricing preview, and admin export endpoints.
- `lib/coupons.js` — normalizes, validates, lists, and calculates coupon discounts.
- `lib/dates.js` — formats today’s date and normalizes date keys; derives fiscal years.
- `lib/inventory.js` — product lookup, sellable stock checks, stock changes, and inventory summaries.
- `lib/invoice.js` — computes invoice figures and renders printable HTML invoices.
- `lib/ledger.js` — customer balances, Khata charges, reversals, and settlements.
- `lib/orders.js` — adds, finds, lists, and cancels orders.
- `lib/pricing.js` — calculates checkout subtotal, discount, GST, and totals.
- `lib/reports.js` — computes dashboard summaries and compares invoice figures with stored order figures.
- `lib/store.js` — reads and writes the JSON database and appends audit entries.
- `lib/tax.js` — resolves item GST rates and splits tax into CGST and SGST.

# Commands
- Start the app: `npm start` (runs `node server.js`).
- Run tests: `node --test` (the `package.json` `test` script is a placeholder that exits with an error).

# Rules
1. Write characterization tests before changing behaviour.
2. Change only the module(s) the ticket is about.
3. Tests never read or write `data/db.json`; use in-memory data.
4. Add no dependencies.
5. Make the smallest fix that works.

# Current ticket
- Invoice total and GST breakdown do not match what the customer was billed.
- Allowed files: `lib/invoice.js` (`lib/tax.js` only if truly needed).
