# TeachersDeck v0.15.3 beta

**Demo mode — show the Cloud features without a Firebase project.**

Turn it on with **Settings → Try the Cloud demo**, or add `?demo=1` to the page address. Turn it off with **Exit the Cloud demo** (Settings, or in
the demo panel) or `?demo=0`.

You are signed in as a pretend teacher with **Class 5A** already linked to a pretend cloud class: 12 students, three rewards, a points history, five
assignments and three calendar events, three Notes Home notes (one already read), and two weeks of student activity (two students have been quiet
for five days). **Class 3B** is there too, so *pick an existing class* can be shown. Cloud Class, Class Activity and Notes Home open on first
launch. Everything works for real against it: award points, send a note to parents, set ranking visibility, regenerate a join code, add or hide a
reward, remove a student, send a progress report, edit assignments and the calendar.

A gold **🎬 Cloud demo** tab (bottom left) opens a panel with:
- a **live log of every Cloud call** — the function name, what it did, and who would see it in StudentDeck / ParentDeck (colour-coded: you, student, parent);
- buttons that **play the other side** so the teacher's widgets update live: *Student joins* (appears in the roster), *Students practise* (Class
  Activity numbers and homework bars move), *Student redeems* (a feed line and a toast), *Parent opens a note* (Notes Home shows it as read, and it
  can no longer be deleted);
- *Reset demo* and *Exit demo*.

**Your real deck is never touched.** The app runs on a throw-away in-memory copy of localStorage (your classes, settings and Pro license are not
read or changed), the demo class has its own id so a background picked in the demo never overwrites your own, nothing is sent anywhere, and
everything resets on reload. Two small caveats: the Firebase SDK still starts in the background as it always does (the demo replaces every
Cloud function afterwards, so nothing is read or written), and media uploaded to the library during the demo is stored for real, because the
library is shared by all classes.

If the browser refuses to let the demo use temporary storage it does not start (rather than risk your real data).

Also: the "Cloud Class isn't set up yet" message in the Cloud widgets now has a **Try the demo** button.
New strings are English and Vietnamese (other languages show English). Nothing else changed.
