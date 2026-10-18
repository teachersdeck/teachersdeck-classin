# TeachersDeck v0.15.2 beta

**School themes from AdminDeck.** AdminDeck v0.5.0 can send a background — one of the six built-in themes or a photo — plus the dim
setting to the classes its admin chooses. This build receives it.

- When the class that is open is linked to a Cloud Class (Cloud Class widget) and you are signed in, TeachersDeck watches
  `classes/{id}/adminTheme/current`. Each **new** version is applied **once**, as that class's background (a photo is saved like one you
  uploaded yourself), with a toast: "Your school sent a new background for this class".
- After that it is an ordinary background. Change it whenever you like; it is not re-applied until the admin sends a newer version.
- **Settings → Accept school themes from AdminDeck** (on by default) switches this off.
- Nothing else changed. No Firebase configured, or no linked class: nothing happens.

**Needs** AdminDeck v0.5.0 with backend function `adminPushTheme` (functions/adminTheme.js in the AdminDeck zip, for backend v1.5.0) **and one
Firestore rule** that lets a class's teacher read `classes/{classId}/adminTheme/{doc}` (the rule is in that file's header). Without the rule
TeachersDeck's read is refused and it silently does nothing.

New strings are English and Vietnamese (other languages show English).
