# TeachersDeck v0.14.0 beta — what changed

Merge this into your README's Version history (the uploaded v0.13.1 zip had no README / tools folder, so none was overwritten).

- **Files widget / document viewer — ported from StudentDeck v0.7.0–0.7.3**
  - The document now fills the window. The app header and the document toolbar share one slim, see-through row
    (if the buttons won't fit beside the header and top drawer, the toolbar drops to its own row automatically).
    The bottom dock tucks down to a thin edge while a document is open (hover the bottom edge to bring it up).
  - **⛶** full screen · **▴** hides toolbar and header for a bare document (**▾** brings them back).
  - **🛠 PDF tools**: Chrome's PDF toolbar and thumbnail sidebar are hidden by default; the button brings them back (remembered).
  - **Per-document time**: "⏱ 12m here · 40m today · 3/8 XP" in the toolbar, ⏱ total beside each file, **Sort by** (last opened / most time / date added).
  - **"Still reading?"** card pauses the document clock after 15 min without input.
  - **📎 Track**: optionally log document time to the Reading Log (one 📄 entry per document per day). Off by default in TeachersDeck.
  - Not ported: the Homework link (StudentDeck-only) and the v0.7.2 SDCloud fix (StudentDeck-only).
- **Stats & XP — ported, without Class/reward points**
  - Header XP pill (level, bar, total; Settings → "Show XP in the header") and a new **📈 Stats & XP** widget (click the pill).
  - XP sources: daily visit 5 (cap 5), reading documents (1 per 5 active min, max 8/document/day, cap 20), lesson saved to calendar 10 (cap 30),
    assignment posted 5 (cap 20), attendance taken for today 5 (cap 5). Streak multiplier up to ×1.5; half XP after 150 XP in a day.
  - Time in every open widget is tracked automatically. Stored under its own key `td_xp_v1` (shared across classes, local only, not synced).
- **Widget categories** in the app tray: Time · Media · Classroom tools · **Language** · Cloud functions.
  Language holds Conversation Starter Cards, Idiom of the Day, Grammar Quick-Reference and Text-to-Speech Reader.
