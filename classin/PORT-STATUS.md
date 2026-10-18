# TeachersDeck → ClassIn: port status

Build **classin.1** on top of TeachersDeck **v0.21.0** · follows *Scoping Study: Porting TeachersDeck Suite to ClassIn* (17 Oct 2026).
Round 1 = **Phase 0 tooling + the core of Option 1 ("ClassIn-ready web app")**.

## Where things stand
**Everything that can be built and tested without ClassIn is done and tested in Chromium (80 automated checks, 0 errors). Nothing has run inside ClassIn yet — that is the next step, and it is yours.** The self-test page (`classin-check.html`) is how you run the study's one-hour checklist and send me the result.

The study's big assumption — *"the widgets already run as a normal web page, not only as an extension"* — **holds**. The extension-only code (Drive/Google sign-in, downloads, microphone permission page) is already guarded behind `typeof chrome === 'undefined'`, so the +5–10 day risk the study flagged does not apply.

## Workstreams (study §6.1, Option 1)
| # | Workstream | Status | Notes |
|---|---|---|---|
| 1 | Compatibility testing and fixes in ClassIn's browser | ⏳ **needs you** | Self-test page ready. I cannot reach ClassIn. Fixes follow your report. |
| 2 | Resizable "board mode" + large text | ✅ single widget · ⏳ whole deck | A link with `w=` fills the window (scaled up, or "fill" for Instructions/Agenda/Checklist), follows resizing, A−/A+ and full screen. The *whole deck* in ClassIn's window is not scaled yet (see Round 2). |
| 3 | One-click links, presets, short links, QR | ✅ | 7 widgets take presets (timer, stopwatch, traffic, noise, scoreboard, instructions, agenda). Link builder + QR + 6 lesson packs. 22 short links (`/t5`…) via `_redirects`. |
| 4 | Web licensing without the extension | ⏳ **decision needed** | The existing licence layer (salted key, Cloud Functions check, 7-day offline grace) is `localStorage` + HTTPS, so it already works on the web. **Pro gating is currently off** (`isPro()` returns true for testers), so nothing is enforced. Open: where keys are issued/stored, and whether storage survives closing ClassIn's browser (self-test check 6). |
| 5 | Audio handling and on-screen cues | ✅ built · ⏳ needs real test | The timer **had no sound at all** — now a chime + a full-window "Time's up! · Hết giờ!" flash (the flash works even if remote students hear nothing). One-time "Share audio" hint (≤3 times, 15 s, slim strip). Noise Meter gives ClassIn-specific help when the mic is busy. |
| 6 | Guides, videos, lesson templates (EN/VI) | ✅ written · ⏳ **needs you** | `classin-guide.html` (bilingual), `VIDEO-SCRIPTS.md`, `LESSON-TEMPLATES.md`. **Have a native speaker check the Vietnamese**; you record the videos. |
| 7 | QA across ClassIn versions/devices | ⏳ **needs you** | Chromium automation only (below). |

Not started (by design): Option 2 (API sync) — build only if centres ask and have API access; Option 3 — needs ClassIn partnership talks.

## What changed in the code
New files (all inert outside the ClassIn edition, so the **Chrome extension is unaffected**):
`js/edition.js` (loads first: edition + link presets) · `js/classin.js` (board mode, toolbar, chime/flash, hints) · `css/classin.css` · `classin-check.html` · `classin-links.html` · `classin-guide.html` · `classin/packs.json` · `tools/build_classin.py` · docs in `classin/`.

Edits to existing files — **each marked `// ClassIn port` so you can `grep` them** (`js/app.js`: 12 marked lines; `index.html`: 3 added lines — a stylesheet and two scripts): edition-hidden widgets count as deactivated · the first-run tidy is skipped in this edition · presets are passed to `render()` · `?lang=` · timer/stopwatch/traffic/scoreboard/instructions/agenda/noise read their preset · timer end calls the chime/flash · noise-meter mic-refused help.

**Hidden in the ClassIn edition** (the browser is shared with every student): Meet, Cloud Class, Notes Home, Class Activity, Reward Points, Lesson Planner, Progress Reports, Assignments, Stats, Badges, and the XP pill/chip — student data and personal progress must never appear on the board, and sign-in pop-ups can't work there.

## Choices I made (change any of them)
- **Presets overwrite saved state in that browser** for Scoreboard (team names), Instructions and Agenda — the link is the source of truth.
- **Scoreboard colours are fixed by position** (red, blue, gold, …), so a team *named* "Green" is gold. Existing behaviour; fixing it is small if centres ask.
- **Instructions steps can't contain `|` or `~`** (they are the separators in a link).
- **Short links are 302 redirects** (the long link shows in the address bar) because they work on every host that supports `_redirects`. Plain GitHub Pages doesn't — use full links there.
- **`w=` links only work in the ClassIn edition.** In the normal deck they are ignored, on purpose.
- **Sticky edition:** `?edition=classin` is remembered in the browser (so reopening ClassIn's browser keeps it); `?edition=default` clears it. The hosted site is the ClassIn edition by default (a `<meta>` baked in by the build).

## Test evidence (Chromium, automated)
| Suite | Checks | Covers |
|---|---|---|
| ClassIn edition | 32 | normal deck unchanged · hidden widgets · sticky edition · board mode fits/centres at 1280×720, 800×480, 600×800 · every preset · chime + flash · audio hint · mic available / refused · toolbar |
| Self-test page | 16 | all 8 checks, second-visit persistence, report is complete and valid JSON |
| Link builder | 15 | a link is built for each widget type, **opened in the real app, preset verified** · all 17 pack links · QR · EN/VI |
| Built site | 17 | the hosted build is the ClassIn edition · all 22 short links followed through a `_redirects` emulator · guide EN/VI · extension files absent |

**Not tested, because it can't be:** ClassIn's own browser (it may differ from Chromium), real students hearing audio through ClassIn, the real ClassIn microphone conflict, Windows/Mac differences. That's what the self-test is for.

## What I need from you next
1. **Host the site** (see `DEPLOY.md`; Cloudflare Pages is the easiest) and tell me the address — or send me the report from a local run.
2. **Run the one-hour self-test in ClassIn** and paste the report (`TEST-REPORT-TEMPLATE.md`). Twice: before and after closing/reopening the ClassIn browser.
3. **Answer:** which ClassIn plans show the *Browser* tool? Do you have access to a school account with API access (only matters for Option 2)?
4. **Decide licensing** (#4): switch Pro gating on for the ClassIn edition now, or wait for the test results?
5. **Vietnamese check**: a native speaker reads `classin-guide.html`, `classin-links.html`, the pack titles in `packs.json`, and `VIDEO-SCRIPTS.md`.

## Round 2 candidates (decided by your results)
Scale the **whole deck** to fit ClassIn's window · fixes from the ClassIn compatibility report · enforce Pro for the ClassIn edition · more presets (poll, hall pass, name picker) · scoreboard team colours · a bilingual one-page customer handout · the security/privacy pack outline (study #13) if a centre asks.
