# TeachersDeck v0.16.0 beta

**Stats & XP now tracks everything you do — and fills the whole screen.**

## Full-screen widget
Stats & XP opens over the whole page (between the top bar and the dock; it steps aside for the side drawers). Click the XP pill or the widget's dock button to open it; **Esc**, the ✕ or the pill closes it. It cannot be dragged, pinned, minimised or resized, and it is never reopened automatically on a new tab. It sits above the document stage.

## Everything is tracked
Before, only lessons, assignments, attendance and documents counted. Now every widget reports what you do with it, to one activity table (`ACT` in `js/app.js` — add a row to track something new):

- **Planning** — lessons, assignments, calendar events, progress reports
- **Running the class** — daily visit, attendance, name picks, groups made, scoreboard points, poll votes, exit-ticket taps, hall passes, checklist items done, noise-meter sessions, announcements, instruction steps, traffic-light changes, dice rolls
- **Timing & reading** — timers, stopwatches, reading-log entries (manual entries now also count in the Reading stats)
- **Media & files** — documents opened, files added, games, music tracks, video clips, soundboard sounds
- **Language** — text read aloud, conversation cards, idioms, grammar topics
- **Tools** — QR codes, Meet sessions
- **Cloud classroom** — Class Points awarded, notes sent home, rewards added

Widget **opens** are counted too and shown next to the time in each widget.

## XP
Small actions now earn small XP, each with its own **daily limit** (shown, with today's progress, in *How XP works*). Existing rules are unchanged: the 150 XP/day half-rate ceiling, the streak bonus, and the per-document cap. Hitting a limit on the small stuff does not pop up a toast. Dice, traffic light, soundboard and "documents opened" are counted but earn no XP.

## What the screen shows
Level, XP bar, streak and bonus · range chips (Today / 7 days / 30 days / All time) · summary tiles · a 14-day trend you can switch between XP, activities and active minutes · a 15-week activity calendar · everything you did, by category · XP by source · time and opens per widget · *How XP works* with today's progress · top documents · a filterable **activity feed** (repeats within 90 s fold into one line with ×count) · **Export CSV** of every day.

## Notes
- Stored in the same `td_xp_v1` key as before; old data is kept. Days from before this version show lessons, assignments, attendance, time and XP, but no per-widget activity (it wasn't recorded).
- The feed keeps the latest 400 entries.
- New strings are English and Vietnamese (other languages show English).
