# TeachersDeck v0.20.0 beta

**Class Activity is now Student Stats — a full-screen widget with XP, level, badges and the stats ParentDeck reads, animated like StudentDeck.**

## What's new
- **Class Activity → 📊 Student Stats**, full screen (like Stats & XP). Same dock slot and saved placement (the internal id is unchanged), so nothing needs re-adding.
- **Class overview:** animated tiles for the class (Active, XP earned, Homework done, Reading, Focus, Games, Idioms, Words saved, Cards reviewed; Today / 7 days), then **one card per student**: level, **XP (shown only once they've earned some — otherwise "No XP yet")**, class points, XP bar, streak, homework done, reading, last active, a **status chip** (✅ On track / 👀 Needs monitoring / ⚠️ Off track) and their top milestone/level medals. Quiet students (3+ days) are listed first, as before. The homework-completion bars and the recent-points feed (with the "student spent points" toast) are still here.
- **Student dashboard** (click a card): the same stats ParentDeck reads, back in the teacher's hands —
  - **Status card** with ParentDeck's four checks (Homework, Reading, Daily practice, Behaviour), the same thresholds and a "How is this worked out?" note. Behaviour uses 🙁 notes you sent plus point deductions in the last two weeks.
  - **Level ring, XP bar, streak** (with the ×XP bonus and best streak), range chips **Today / 7 days / All time**.
  - **Tiles:** XP earned, homework done, reading, games (started · finished), focus, active time, idioms, words saved, cards reviewed, class points, badges.
  - **Panels:** XP by source, time in each widget, XP last 7 days, game scores, recent XP, homework, and the full **badge gallery** (earned/locked, progress, Next up, All/Earned/Locked filter).
- **Animation like StudentDeck:** cards rise in one after another, numbers count up, the level ring and XP bars fill (with a shower of stars), bars and columns grow, medals pop; hovering a card or tile lifts it. Live updates never replay the entrance or reset your scroll. All of it is off when the system asks to reduce motion.
- English and Vietnamese strings for everything new.

## Things to know
- **Badges are worked out, not synced.** StudentDeck keeps badges on the student's device and doesn't send them. Student Stats applies StudentDeck's own badge rules to the stats it does sync: **XP total and level are exact**; streaks, big days, variety, skills and habits use the last 200 days of synced activity, so an older achievement can be missing. The student cards show only milestone and level medals (the exact ones); the dashboard shows all 36. To show a student's own earned list exactly, StudentDeck would need to sync it.
- A student dashboard reads up to **200 days** of that one student's activity while it is open (the class overview still reads 14 days per student). The extra listener is released when you go back.
- Older StudentDeck versions that don't send an XP total fall back to the XP in the synced days.
- The Cloud Class widget's activity badges are unchanged.
- **Demo mode** now carries StudentDeck v0.9.x-shaped data (XP totals, per-source XP, time per widget, game scores, recent XP, 45 days).
