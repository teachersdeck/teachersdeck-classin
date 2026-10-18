# TeachersDeck v0.14.2 beta

- **New: Notes Home** (Cloud classroom group). Send a note home to one or more students' parents: pick 🙂 or 🙁, write up to 500 characters,
  and see **📨 Sent → ✅ Read** per note once a parent opens it in ParentDeck.
  - Each student gets their own private copy, so read status is per child; students never see notes.
  - A smiley can be sent with no text; a frowny needs a few words.
  - **Sign notes as** (e.g. "Ms. Linh") is set once per teacher, not per class; parents see the class name plus that name.
  - A note can be deleted only while it is unread; once opened it stays (send a follow-up instead).
  - Students sharing a name show the same ⚠️ marker as the Cloud Class roster, because a note to the wrong family is the mistake that matters.
  - English and Vietnamese.
- **Renamed:** the app-tray group "Cloud functions" is now **"Cloud classroom"** (all 8 languages). Meet, Lesson Planner and Cloud Class are still in it.
- **Remove student now cleans up fully:** it calls the new `removeStudentFromClass` function, which also deletes that student's notes, points
  history and parent links (a plain delete left these behind, and kept the parent's access to the class). If the backend hasn't been
  updated yet, it falls back to the old delete so the button keeps working. The confirmation now mentions notes sent home.
- Manual: added a Notes Home entry.

**Needs backend v1.3.0** (`sendNotesHome`, `markNoteRead`, `removeStudentFromClass`, new rules and an index) for Notes Home to send, and
**ParentDeck** with its matching Notes Home widget for parents to receive and mark notes as read. Until ParentDeck is updated, notes
can be sent but will always show 📨 Sent.

Also in the backend v1.3.0: Firestore rules for **Progress Reports** (`students/{id}/progressReports`) — the Progress Reports widget in
v0.14.0 writes there, but the v1.2.0 rules file had no rule for that path, so Firestore would refuse it.
