# ClassIn self-test report — 2026-10-19 (first real run)

Build: classin.1 · Taken: 2026-10-19T05:19:10.410Z · Page visits: 2
Page: https://teachersdeck.github.io/teachersdeck-classin/classin-check.html

**Result: 8/8 PASS**, run inside ClassIn's actual Browser tool (confirmed by the UA string — no Claude/Electron preview markers, a real ClassIn-embedded Chrome 155). This is the first time the port has been tested inside ClassIn itself; everything that could only be checked there now has a real result.

## Headline findings
- **The site loads and runs correctly inside ClassIn's browser.** Secure context, fullscreen, resize tracking, audioContext, getUserMedia, IndexedDB, Service Worker — all available (check 1, 2).
- **Vietnamese text renders correctly** on both the teacher and student device — no missing accents or boxes (check 3).
- **Microphone works alongside ClassIn's own mic use** — no conflict. Device: Internal Microphone (Conexant ISST Audio), max level 0.0521 (check 4). Note: `permission` reports `"prompt"` rather than `"granted"` — likely ClassIn's browser doesn't support the Permissions API query for microphone and always reports `prompt`; not a problem since the mic worked.
- **Timer chime reaches students only when ClassIn's "Share audio" is ON** — confirms the documented fallback design (the on-screen flash covers the case when it's off). Test A (Share audio OFF) was not completed this run — result shows `—` rather than yes/no, so "does the flash alone work when audio isn't shared" is still unconfirmed by a direct answer (check 5).
- **Settings persist across closing and reopening the ClassIn browser** — localStorage, cookies, and IndexedDB all survived a second visit. This directly answers the licensing open question: **storage does survive**, so a web-based Pro licence will stick (check 6).
- **Performance is smooth**: 60fps average, 16.8ms p95 frame time, 0 frames over 50ms, 165ms CPU benchmark (check 7).
- **Real TeachersDeck links work when pasted into ClassIn's browser** (check 8).

## Still open from `TEST-REPORT-TEMPLATE.md`
Not included in this report — worth getting for the full picture:
- Computer spec (Windows/Mac, age, RAM) and ClassIn version/plan (does it show a **Browser** tool? — relevant to Step 3, decision 2 in the testing doc)
- Student device type and whether they were in-room or remote
- Screenshots of the timer "Time's up" flash and the Instructions widget in Vietnamese on the student device
- Any one-line "what felt slow / confusing" notes

## Raw report JSON
See the chat message pasted 2026-10-19 for the full `classin-check.html` JSON payload (all 8 checks, timestamps, and raw env/mic/audio/perf data).
