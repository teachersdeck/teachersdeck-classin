# TeachersDeck v0.18.0 beta

**Manage widgets — deactivate the redundant ones, bring them back any time.**

## What it does
A *deactivated* widget disappears from every dock, the app tray and the dock settings, can't be opened, and is closed if it was open. Its code and saved data stay, and one switch in **Manage widgets** brings it back. The choice is global (all classes), stored in `td_widgets_v1`.

Open it from **Settings → Manage widgets…** or from the button at the bottom of the app tray. It lists all 39 widgets in three groups, each with the reason it's there and how much you've actually used it (opens and time in the last 30 days, or when you last used it), plus a switch:

- **Recommended to deactivate (10)** — Stopwatch, Dice, Video Player, Soundboard, Exit Ticket, Google Meet, Days-Until Countdown, Reading Timer & Log, Unit Converter, Announcements Board. Each overlaps something that stays (Timer, Poll, Calendar, Agenda Board, Music Player, Files…), only launches something the browser already does, or is mostly a novelty.
- **Best to keep (17)** — the daily essentials plus the StudentDeck-connected workflow: Clock, Timer, Name Picker, Group Maker, Scoreboard, Poll, Attendance, Traffic Light, Noise Meter, Agenda Board, Files, Calendar, Assignments, Progress Reports, Lesson Planner, Cloud Class, Notes Home.
- **Worth keeping (12)** — distinct and good for the right lesson: Checklist, Games, Music Player, Hall Pass, QR Code, Text-to-Speech Reader, Conversation Cards, Idiom of the Day, Grammar Reference, Instructions, Class Activity, Stats & XP.

Buttons: **Apply recommendations** (skips any you use), **Reactivate all**, **Fill free dock slots** (moves widgets that only live in the app tray into any free dock slot; only shown when there is one).

## First launch of this version
The ten recommended widgets that you have **never used** (no recorded time or opens, not open now) are deactivated once, with one message. Anything you do use stays on, and is tagged "You use this" in Manage widgets. On a brand-new install the deactivated widgets don't take dock slots, so the bottom dock fills with the ten best.

## Notes
- Existing dock placements are left alone, so deactivating can leave gaps in a dock — use *Fill free dock slots*.
- Reactivating a widget that was deactivated before it ever had a dock slot gives it the first free slot (otherwise it stays in the app tray).
- Strings are English and Vietnamese (other languages show English).
