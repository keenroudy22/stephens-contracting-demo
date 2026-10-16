# Stephen's Contracting — public demo

Sample-only showcase: a contractor website and a browser-local quoting application. No sign-in, backend, customer messaging or connection to the private office.

## Try it

Open the published GitHub Pages homepage. Choose **View the website** or **Try the quoting software**.

The quoting tool starts with a sample 30 × 40 ft deck priced under a conditional frame-reuse scenario. It supports new jobs, editable cost lines and pricing, customer records, templates, ten saved revisions per job, duplicate, reversible archive, manual statuses, backup/import, and customer quote printing. Repair and room-remodel templates have zero-cost allowances so users supply their own pricing.

All quote data stays in browser localStorage under `stephens-public-demo-v1`. Use fictional information. Export a backup before changing browsers or clearing site data. Import validates the full workspace and merges new copies; it does not overwrite existing records or business settings. Reset exports a recovery file first. Conflicting tabs block further writes until reload. No email or payment is sent. Public website inquiries download a brief only.

## Limits and assumptions

- 100 jobs, 150 cost lines per job, 200 customers, 30 templates, ten revisions per job, 2.5 million characters per saved workspace.
- Browser storage availability and quotas apply. Errors are shown instead of claiming a successful save.
- Retail references were researched October 15, 2026. Local delivery, stock and summer 2027 pricing are not confirmed. Quantities and labor are editable assumptions, not structural designs.
- The $33,724.92 deck example requires inspection of the existing structure; new treated-wood and composite scenarios are different.
- Customer printouts omit internal unit costs, margins, markup and private notes. They remain clearly labeled demo estimates.
- Business details, payment terms, service offerings and imagery require confirmation. No invented testimonials. Deck imagery is an AI concept, and the bathroom image is attributed stock photography, not completed company work.

## Source and deployment

`index.html` is the demo entry page, `website/` the contractor website, and `quote/` the interactive demo. The `estimate.js` and `scenarios.js` modules preserve the researched reference calculations. `model.js` owns validation, sample records and revision/template helpers. `app.js` owns the interface and local persistence.

GitHub Pages serves the root of `main`; `.nojekyll` disables Jekyll processing. All internal asset paths are relative for project-subdirectory hosting. No environment variables, credentials, private records or private application source are included.

Run `npm install`, then `npm test`. Tests cover pricing, markup vs margin, validation, separate jobs, reload, customers, templates, revisions, archived jobs, print privacy, corrupted storage, and competing tabs. Browser QA is performed against the published demo without a local server.
