# TeachersDeck v0.14.1 beta

- **Fix:** a widget moved to the very top of the screen could not be grabbed — the header bar sat on top of its title bar. The header now lets clicks through its empty space.
- **Files widget:** the remove ✕ on each file is now visible (its icon had no size).
- **PowerPoint / Word / Excel — both ways:**
  - 🖥 button on each Office file launches the desktop app (downloads a copy to Downloads/TeachersDeck and opens it; asks for the optional
    "downloads" permission the first time — edits save to that copy, not the stored file).
  - The expand button shows it in the viewer through Google (when the Google connection is set up).
  - New "PowerPoint / Word / Excel open in" choice sets what clicking the file name does (Google viewer or Desktop app). With no Google connection it uses the desktop app.
  - Inside the viewer, converted files get a "🖥 Open in PowerPoint" button too.
