# TeachersDeck v0.15.1 beta

**A merge of two parallel builds.** v0.14.2 (Notes Home widget, "Cloud classroom" rename, tidy student removal) and v0.15.0
(Class Activity, roster activity strips, its own Notes Home, sync fix) were both built from v0.14.1 and never saw each other.
This build keeps everything from both; the only judgement call is Notes Home, below.

**Kept from v0.15.0**
- 📊 **Class Activity** widget, the 🔥 / ✅ / last-active strip on each Cloud Class roster row, the shared per-student listener pool
  behind them, and the recent-points feed with a toast when a student redeems a reward.
- **Fix — changes lost during a sync:** `syncHomework` / `syncCalendar` no longer drop a change that arrives while a sync is already
  running; the newest one is queued and sent when the running sync finishes.
- Remove student passes the class to `removeStudentFromClass` and only falls back to the old direct delete when that function is
  genuinely not deployed (its own "Student not found." / "Not your class." answers are shown, not swallowed).

**Kept from v0.14.2**
- ✉️ **Notes Home** widget (multi-student send, sign-off name, sent/read history with filter, take-back while unread).
- App-tray group renamed **"Cloud functions" → "Cloud classroom"** (all 8 languages). Class Activity, Notes Home, Meet, Lesson Planner
  and Cloud Class all sit in it.
- Remove-student confirmation mentions notes sent home. Manual entry for Notes Home.

**Reconciled: Notes Home (the one real overlap)**
Both builds had a Notes Home. They could not both stand: v0.15.0 sent by writing the note straight to the database, but the backend
(v1.3.0) deliberately refuses client writes to notes — one send can address many students, so the server must check every recipient
really is in the teacher's class (`sendNotesHome`). Left as it was, v0.15.0's Send button would have been refused. Two composers
and two histories for one feature would also have been confusing. So there is **one** Notes Home widget, and v0.15.0's ✉️ button on
each roster row is kept as a shortcut that opens it with that student already ticked. v0.15.0's separate in-roster composer and
note list were removed (their styles and strings too). Borrowed from it: the "private to each student's parents" reassurance line.

Where the two builds differed and this build chose:
- **Note text:** a smiley may be sent with no text; a frowny needs some (v0.15.0 required text for both).
- **Taking back a note:** only while it is unread; once a parent opens it, it stays (v0.15.0 showed a retract button on every note).
- **Face names:** 🙂 Smiley / 🙁 Frowny, as originally asked (v0.15.0 called them "Good news" / "A concern").
If you would rather have v0.15.0's choice on any of these, each is a one-line change here plus a matching line in the backend.

**Needs backend v1.3.0** (`sendNotesHome`, `markNoteRead`, `removeStudentFromClass`, rules, index). Class Activity only needs the
teacher-read rules from v1.2.0. **ParentDeck** needs its matching Notes Home widget before notes can show as Read.

Manual: Notes Home entry updated; Class Activity entry added.
