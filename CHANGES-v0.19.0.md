# TeachersDeck v0.19.0 beta

**Class Builder — one widget for classes, students, picking, grouping and going cloud.**

## What's new
- **New widget: 🏗️ Class Builder** (in the Best-to-keep group; it takes a free dock slot on upgrade). Four tabs:
  - **Classes** — switch, rename, copy and delete classes (moved here from Settings), and **create a new class with its students**: Họ / Tên đệm / Tên plus an optional English name, row by row or by pasting a list (`Nguyễn Văn An, Andy`, `Nguyễn Văn An (Andy)` or just `Nguyễn Văn An`).
  - **Students** — edit the open class's students the same way; sort by given name (Vietnamese order); choose how names appear everywhere: *Vietnamese (English)*, *English when there is one*, or *Vietnamese only*.
  - **Pick & Groups** — the Name Picker and Group Maker, drawing from this class.
  - **Cloud** — convert the class to a cloud class (or link an existing one), copy/regenerate the student and parent codes, print per-student join slips, and see the class as **StudentDeck**, **ParentDeck** and **AdminDeck** tables (each has a Copy table button).
- **Top-right class switcher** now shows each class's student count and ☁️, has **＋ New class…**, and **Manage classes…** opens Class Builder. Settings → Classes is now a one-line summary with an **Open Class Builder…** button.
- Students are stored as `state.students`; `state.roster` (what Name Picker, Group Maker, Attendance and Hall Pass read) is derived from it. Existing classes are migrated automatically with their names unchanged. **Renaming a student moves their Attendance and Hall Pass records with them.**
- The "Add students under Settings → Class list" messages (which pointed at a screen that no longer existed) now say Class Builder (English and Vietnamese).

## What the cloud tables show (and don't)
A cloud student record only exists once the student joins with the class code, and TeachersDeck can't create it. So:
- **StudentDeck** — each student on your list: joined or not, points, level, streak, last active; plus anyone who joined but isn't on your list (one click to add). Matching ignores accents, capitals and spaces; the join slips tell students exactly how to type their name.
- **ParentDeck** — notes you've sent per student (sent / unread / latest) and the parent code. Which parents have linked is not visible to the teacher side.
- **AdminDeck** — the class record as TeachersDeck can see it (cloud ID, codes, ranking visibility, assignments and calendar events shared, whether a school theme arrived). AdminDeck's own view lives in AdminDeck.

## Changed behaviour
- **Copy this class** no longer copies the cloud link, so two local classes can't write to the same cloud class.
- The top bar's class menu no longer scrolls Settings to the Classes section.

## Notes
- Strings are English and Vietnamese (other languages show English for the new text).
