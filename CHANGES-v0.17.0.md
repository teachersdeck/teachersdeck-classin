# TeachersDeck v0.17.0 beta

**Stats & XP now moves like StudentDeck's — and earns badges.** Both are ported from StudentDeck (v0.9.5 animation, v0.9.6 badges).

## Animated Stats & XP
- **On opening, and whenever you change the range:** the cards rise in one after another, bars and trend columns grow, calendar squares pop, rows slide in, the numbers in the tiles count up, and the level bar fills with a glint and a shower of stars.
- **Switching the trend between XP / Activities / Active min** regrows just the columns.
- **Hover:** a card lifts and twinkles; bars grow again and glint; columns lift and show their value; calendar squares twinkle; tiles lift and count up again; the level badge throws a few stars.
- **Reduce motion:** everything is switched off (and numbers/bars appear at once) when your system asks for reduced motion.
- While the pointer is on the page the 10-second refresh waits, so a redraw never restarts what you're looking at; it runs as soon as the pointer leaves.

## Badges for gaining XP — 43 of them, four tiers (bronze, silver, gold, diamond)
- **Milestones** (50 → 5,000 XP total) · **Levels** (3 → 20) · **Streaks** (3 → 100 days) · **Big days** (50 / 100 / 150 XP in one day) · **Variety** (XP from 4 / 7 / 10 different things in one day) · **Habits** (active on 7 / 30 / 100 days)
- **Skills** — 16 badges for teaching, each earned from XP in the matching activities: lessons, assignments, attendance, documents, groups, name picks, scoreboard, polls & exit tickets, games, music & video, language tools, timers, reading, calendar & reports, Class Points, notes home.
- A badge is worked out from the XP numbers TeachersDeck already keeps, so it can't be earned any way XP can't (the daily limits and the 150 XP/day half-rate still apply).
- **When one is earned** a medal pop-up spins in (several queue up; more than three become a "…and N more" message). Click it to jump to the Badges card.
- **🏅 chip in the header**, next to the XP pill, shows how many you have; it wobbles when you earn one. It hides with the XP pill (Settings → Show XP in the header).
- **Badges card** in Stats & XP: how many you've earned, **Next up** (the three closest, with progress), filters (All / Earned / Locked), and every badge by group with its progress or the date earned. A *Badges earned* tile joins the summary tiles.
- **First run with history:** anything your existing XP already qualifies for is awarded quietly (marked "Earned before badges began") with a single message — no flood of pop-ups.

## Notes
- Badges are stored in the same `td_xp_v1` key as the XP, on this device only. Nothing is synced.
- New strings are English and Vietnamese (other languages show English).
