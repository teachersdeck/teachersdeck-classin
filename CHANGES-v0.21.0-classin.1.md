# TeachersDeck v0.21.0 — ClassIn edition, round 1 (build classin.1)

Adds a hosted **ClassIn web edition** alongside the Chrome extension, following the ClassIn scoping study. See `classin/PORT-STATUS.md` for the full status, decisions and what is needed next.

- **Board mode:** `?edition=classin&w=<widget>` opens one widget filling ClassIn's browser window, with presets (`min`, `sec`, `go`, `light`, `teams`, `title`, `steps`, `schedule`, …), `lang=vi`, `scale=`, and a small fading toolbar (A−/A+, full screen, test sound, all widgets).
- **Sound:** the timer now chimes and flashes the whole window "Time's up! · Hết giờ!" (ClassIn edition only); one-time Share-audio hint; Noise Meter explains a refused microphone.
- **Hidden in this edition** (shared board): Meet, Cloud Class, Notes Home, Class Activity, Reward Points, Lesson Planner, Progress Reports, Assignments, Stats, Badges, XP pill.
- **Tools:** `classin-check.html` (the self-test), `classin-links.html` (link builder, QR, lesson packs), `classin-guide.html` (EN/VI), `tools/build_classin.py` (builds + checks the hosted site; short links in `_redirects`).
- The Chrome extension build is unchanged: all new code is inert unless the ClassIn edition is on.
