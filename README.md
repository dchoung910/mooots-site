# mooots.app

The Mooots teaser site: one page with a waitlist, plus Privacy and Terms. Plain HTML/CSS/JS, hosted free on GitHub Pages at **mooots.app**.

| File | What it is |
|---|---|
| `index.html` | Teaser page with the waitlist form |
| `privacy.html`, `terms.html` | Privacy Policy and Terms |
| `404.html` | "Nobody's here" page |
| `assets/site.css` | All styles (colors and type match the app) |
| `assets/waitlist.js` | Phone formatting, validation, sending to the sheet |
| `apps-script/Code.gs` | Google Apps Script that saves signups to a Google Sheet |
| `fonts/` | Albert Sans, self-hosted (SIL Open Font License, see `fonts/OFL.txt`) |
| `CNAME` | Tells GitHub Pages to serve the site at mooots.app |

No cookies, analytics or third-party requests. Nothing private belongs in this repo: it's public.

## Preview locally

Open `index.html` in a browser. The form shows "Signups aren't open yet" until the sheet is connected.

## Connect the waitlist sheet (once)

1. In Google Drive, create a sheet named **Mooots Waitlist**.
2. **Extensions → Apps Script.** Replace the starter code with `apps-script/Code.gs` and save.
3. **Deploy → New deployment** → type **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Authorize when asked, then copy the **Web app URL**.
5. Paste it into `ENDPOINT` at the top of `assets/waitlist.js`, commit and push.

Signups land in the **Waitlist** tab: time joined, phone, the consent wording they agreed to, and a status column. If you edit `Code.gs` later, use **Deploy → Manage deployments → Edit → New version** so the URL stays the same.

If your Google Workspace account doesn't allow "Anyone" access, ask the Workspace admin (you) to allow it under Apps Script sharing settings, or create the sheet with a personal Google account.

## Go live on GitHub Pages

1. Push this repo to GitHub as a **public** repo.
2. Repo **Settings → Pages**: Source **Deploy from a branch**, branch **main**, folder **/ (root)**.
3. Custom domain: `mooots.app` (already in `CNAME`). Once the DNS check passes, tick **Enforce HTTPS**.

### DNS at Squarespace (domains.squarespace.com → mooots.app → DNS)

Remove Squarespace's default website records, then add:

| Type | Host | Value |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | dchoung910.github.io |

**Don't touch the MX records.** They deliver contact@mooots.app email.

## Before going live

- Replace `[GO-LIVE DATE]` in `privacy.html` and `terms.html`.
- Connect the waitlist sheet (above).
- Before sending any texts: register the sending number with carriers (10DLC) and name the SMS provider in the Privacy Policy.
