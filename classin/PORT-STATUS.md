# TeachersDeck → ClassIn: port status

Build **classin.1** on top of TeachersDeck **v0.21.0** · follows *Scoping Study: Porting TeachersDeck Suite to ClassIn* (17 Oct 2026).
Round 1 = **Phase 0 tooling + the core of Option 1 ("ClassIn-ready web app")**.

## Where things stand
**Update 2026-10-19: the first real ClassIn run is in, and it's 8/8 PASS.** See `classin/test-reports/2026-10-19-first-classin-run.md` for the full writeup. Headline: the site loads and runs correctly inside ClassIn's own browser, Vietnamese text is correct, the mic works alongside ClassIn's own mic use with no conflict, the timer chime reaches students when ClassIn's "Share audio" is on, settings survive closing and reopening the browser, and performance is smooth (60fps). Still open: Test A (chime with Share audio OFF) wasn't answered, and the computer/ClassIn-plan/student-device details from `TEST-REPORT-TEMPLATE.md` weren't sent yet.

Everything that can be built and tested without ClassIn was already done in Chromium (80 automated checks, 0 errors) before this run.

The study's big assumption — *"the widgets already run as a normal web page, not only as an extension"* — **holds**. The extension-only code (Drive/Google sign-in, downloads, microphone permission page) is already guarded behind `typeof chrome === 'undefined'`, so the +5–10 day risk the study flagged does not apply.

## Workstreams (study §6.1, Option 1)
| # | Workstream | Status | Notes |
|---|---|---|---|
| 1 | Compatibility testing and fixes in ClassIn's browser | ✅ first run passed (8/8) | Ran inside ClassIn's real browser 2026-10-19, see `classin/test-reports/`. No fixes needed yet; broader device/version coverage still open (workstream 7). |
| 2 | Resizable "board mode" + large text | ✅ single widget · ✅ whole deck (2026-10-19, four rounds of fixes same day, see below) | A link with `w=` fills the window (scaled up, or "fill" for Instructions/Agenda/Checklist), follows resizing, A−/A+ and full screen. **Round 2: the whole deck now scales too** — opening the ClassIn edition without `w=` fits every open widget's own bounding box to the real browser window (floor 480×360, clamped 0.35×–2.2×). Widgets stay open, draggable and resizable — dragging divides pointer movement by the current fit scale so the cursor still tracks 1:1 (`js/app.js`'s `moveGesture`, marked `// ClassIn port`). |
| 3 | One-click links, presets, short links, QR | ✅ | 7 widgets take presets (timer, stopwatch, traffic, noise, scoreboard, instructions, agenda). Link builder + QR + 6 lesson packs. 22 short links (`/t5`…) via `_redirects`. |
| 4 | Web licensing without the extension | ✅ decided: stays off for now | The existing licence layer (salted key, Cloud Functions check, 7-day offline grace) is `localStorage` + HTTPS, so it already works on the web, and storage is confirmed to survive closing/reopening ClassIn's browser (check 6, 2026-10-19). **Decided 2026-10-19: Pro gating stays off** (`isPro()` returns true for testers) — every widget stays open and unlocked while testing continues. Revisit once the Vietnamese check and broader device coverage are done. Still open: where keys would be issued/stored, whenever gating is turned on. |
| 5 | Audio handling and on-screen cues | ✅ built · ✅ real test mostly passed | The timer **had no sound at all** — now a chime + a full-window "Time's up! · Hết giờ!" flash (the flash works even if remote students hear nothing). Real test confirms the chime reaches students when ClassIn's "Share audio" is on; the OFF case (flash-only fallback) wasn't directly confirmed yet. One-time "Share audio" hint (≤3 times, 15 s, slim strip) — confirmed showing. Noise Meter gives ClassIn-specific help when the mic is busy, and real-test confirms no conflict with ClassIn's own mic use. |
| 6 | Guides, videos, lesson templates (EN/VI) | ✅ written · ⏳ **needs you** | `classin-guide.html` (bilingual), `VIDEO-SCRIPTS.md`, `LESSON-TEMPLATES.md`. **Have a native speaker check the Vietnamese**; you record the videos. |
| 7 | QA across ClassIn versions/devices | ⏳ **needs you** | Chromium automation only (below). |

Not started (by design): Option 2 (API sync) — build only if centres ask and have API access; Option 3 — needs ClassIn partnership talks.

### Whole-deck scaling: four rounds of fixes (2026-10-19)
Workstream 2's "whole deck" scaling (opening the ClassIn edition without `?w=`) went through four rounds the same day it shipped, each found by hand-testing (two of them only showed up live, not in local testing):
1. **"Can't drag past the left edge / size gets bigger each widget opened."** Cause: `#wall` itself was resized to match content, which also shrank the coordinate space drags are clamped to. Fixed: `#wall` is never resized, only visually scaled.
2. **Still stuck after fix 1.** Cause: the scale was anchored at the content's own bounding-box centre, which moves every time a widget is dragged — so the next re-fit recentred the view back on top of it, undoing the drag. Fixed: freeze that centre, only recompute it when a widget opens/closes.
3. **Still stuck after fix 2, confirmed on the live site.** Cause: the frozen centre still wasn't tied to the real screen edges — a widget's saved position could reach the wall's true edge while its on-screen position fell short. Fixed properly: anchor the scale at the wall's own fixed top-left corner `(0,0)`, a point that always renders at screen `(0,0)` regardless of scale — nothing to freeze or recentre. `moveGesture`'s drag clamp (`app.js`) now divides its margin by the current scale to match. Verified directly via `getBoundingClientRect()` in a real browser, not just reasoning: a dragged widget reaches `screenLeft: 0` and holds there.
4. **"Scale jumps and widgets jump left when a new widget opens."** Expected consequence of fix 3's fixed-corner anchor: any scale change moves everything but the corner itself. Fixed: the scale now only changes when content actually no longer fits (opening a widget that still fits within the current view changes nothing), and `#wall`'s CSS transition smooths out the changes that do happen.

Current state verified: opening a widget that already fits leaves every other widget's position and scale byte-identical; opening/dragging to something that doesn't fit smoothly rescales and keeps everything on-screen; dragging reaches the true screen edges on both sides.

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

**Not tested before 2026-10-19, because it couldn't be:** ClassIn's own browser, real students hearing audio through ClassIn, the real ClassIn microphone conflict, Windows/Mac differences. The first real-ClassIn self-test run now covers all of these once, on one Windows machine — still open: other devices/OSes/ClassIn versions, and Mac.

## What I need from you next
1. ~~Host the site~~ — done: live at https://teachersdeck.github.io/teachersdeck-classin/ (GitHub Pages; short links don't work there, use full links).
2. ~~Run the one-hour self-test in ClassIn~~ — done once, 8/8 pass, see `classin/test-reports/2026-10-19-first-classin-run.md`. Still welcome: a second run on a different device/OS, and an answer for Test A (chime with Share audio OFF — did the flash alone work?).
3. **Answer:** which ClassIn plans show the *Browser* tool? (the account tested with does — which plan is it on?) Do you have access to a school account with API access (only matters for Option 2)?
4. ~~Decide licensing~~ — **decided 2026-10-19: Pro gating stays OFF.** Keep every widget open and unlocked while testing continues; revisit once the Vietnamese check (next item) and broader device coverage are done.
5. **Vietnamese check**: still open, blocked on finding a native speaker to read `classin-guide.html`, `classin-links.html`, the pack titles in `packs.json`, and `VIDEO-SCRIPTS.md`. Not urgent — doesn't block anything else.
6. **Fill in the rest of `TEST-REPORT-TEMPLATE.md`** for the 2026-10-19 run: computer spec, ClassIn version/plan, student device, and screenshots of the timer flash and the Instructions widget in Vietnamese.

## Round 2 candidates (decided by your results)
~~Scale the whole deck to fit ClassIn's window~~ — done 2026-10-19, see workstream 2. Remaining: fixes from the ClassIn compatibility report (none needed yet) · enforce Pro for the ClassIn edition (parked, see workstream 4) · more presets (poll, hall pass, name picker) · scoreboard team colours · a bilingual one-page customer handout · the security/privacy pack outline (study #13) if a centre asks.
