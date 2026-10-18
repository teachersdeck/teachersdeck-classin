# Deploying the ClassIn web edition

The ClassIn edition is a **static website** — no server code, no database of its own. You build a folder, upload it, and point a domain at it.

## 1 · Build
```
python3 tools/build_classin.py
```
Creates `build/classin-site/` (the website) and `dist/teachersdeck-classin-site-<version>-classin.1.zip` (the same, zipped). It **checks itself**: if a page refers to a missing file, a short link points at a widget that doesn't exist, or an extension-only file leaked in, it prints the problem and stops.

## 2 · Choose a host
| Host | Short links (`/t5`) | Security headers | Cost | Verdict |
|---|---|---|---|---|
| **Cloudflare Pages** | yes (`_redirects`) | yes (`_headers`) | free tier is plenty | **recommended** |
| Netlify | yes | yes | free tier | good |
| GitHub Pages | **no** | no | free | works, but use the full links (the builder makes them) |

It must be served over **https**. Browsers only allow the microphone on https (or localhost), and the Noise Meter needs it.

## 3 · Upload (Cloudflare Pages, "Direct Upload")
1. Cloudflare dashboard → *Workers & Pages* → *Create* → *Pages* → *Upload assets*.
2. Name the project, drag in the **contents** of `build/classin-site/` (or the unzipped zip), deploy.
3. *Custom domains* → add your domain (for example `board.yourcentre.vn`). Wait for the certificate (a few minutes).
4. Open `https://YOUR-SITE/` — it should open the TeachersDeck deck with **no** Meet / Cloud Class buttons. Open `https://YOUR-SITE/t5` — a 5-minute timer should start by itself.

## 4 · Check it, then run the self-test in ClassIn
1. `https://YOUR-SITE/classin-check.html` — open it **inside ClassIn's browser** and follow the 8 checks (see `TEST-REPORT-TEMPLATE.md`).
2. `https://YOUR-SITE/classin-links.html` — make a link, paste it into ClassIn's browser.

## 5 · Each round
Claude changes the code → you rebuild → upload → re-run the check page → send the report. Keep the repository in **your own** account (one-person dependency risk, study §9).

## Notes
- **No secrets are in this build.** `js/firebase-config.js` holds the public web configuration that Firebase is designed to expose; the ClassIn edition hides every widget that signs in. When the API-sync option (study Option 2) is built, ClassIn school secret keys go in the host's *environment variables / server settings*, **never** in these files and never in chat.
- The page still loads Firebase's scripts from Google (`gstatic.com`). Harmless offline-first, but mention it in the privacy pack (study workstream 13).
- Updating the site does not touch a teacher's saved settings: they live in the ClassIn browser's own storage (self-test check 6 tells you whether that storage survives closing the browser).
