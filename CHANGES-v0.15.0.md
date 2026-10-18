# TeachersDeck v0.15.0 beta

**Closes the loop on what StudentDeck, ParentDeck and AdminDeck already do.** Needs backend v1.3.0 for Notes Home and the
tidy student removal; the activity views work with v1.2.0 (teacher-read rules on `homeworkDone` / `practiceDaily`).

- **📊 Class Activity (new widget, Cloud functions):** this week across the whole class (active students, reading minutes,
  focus sessions, games, idioms, words saved, cards reviewed), every student with 🔥 streak · ✅ homework done / assigned ·
  last active · 📖 reading (students quiet for 3+ days listed first), **homework completion by assignment** (x/y with a
  bar), and a **recent points feed** that now includes students' own reward redemptions (🎁) with their reason — plus a toast
  when a student redeems while the widget is open, so a point drop always has a visible explanation.
- **Cloud Class roster:** a small 🔥 / ✅ / last-active strip under each student.
- **✉️ Notes home (Cloud Class):** a ✉️ button on each roster row opens a composer (🙂 Good news / 🙁 A concern, up to 500
  characters). Sent notes are listed with **📨 Sent → ✅ Read <time>** (the read receipt is written by the parent's
  `markNoteRead`), and can be retracted. Private to that student's parents — the student never sees them.
- **Removing a student now cleans up:** calls the backend's `removeStudentFromClass` (their records, their parents' links and
  class-wide access, notes about them). If that function isn't deployed yet it falls back to the old direct delete.
- **Fixed — changes lost during a sync:** `syncHomework` / `syncCalendar` ignored a change that arrived while a sync was
  already running (it only went up on some later save — e.g. an assignment added right after creating a class could
  never reach students). The newest change is now queued and sent when the running sync finishes.
- Boundary kept: journal text never leaves the student's device and nothing here reads or asks for it. Activity numbers are
  reported by students' own devices — a guide, not a score.
- New strings are in English and Vietnamese; other languages fall back to English. The Manual isn't updated yet.
