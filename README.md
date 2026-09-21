# TeachersDeck
Chrome extension based Teachers Resource for Classroom Management

# TeachersDeck — v0.6.9

TeachersDeck, a classroom-management app, built plain HTML/CSS/JS so it can run
either as a normal web page or as a Chrome new-tab extension with no rewrite.

The current version number always lives in two places, kept in sync by
hand: `js/app.js` (`const APP_VERSION = '...'`, shown at the bottom of the
Settings drawer) and `manifest.json` (`"version"`, used by Chrome). Bump
both together and add a line under **Version history** below whenever you
ship a change.

## Version history
- **v0.6.9** — **Fixed widget dragging.** Reported symptom: a panel moves a
  pixel or two and then stops. Reproduced in headless Chromium — with a real
  mouse drag the panel didn't move *at all*.
  - **Root cause**: `makeDraggable()`'s `pointerdown` handler called
    `wall.appendChild(el)` to bring the panel to the front. `el` is already in
    `wall`, so that removes and re-inserts the node — and per the Pointer
    Events spec, re-inserting the element that holds the pointer capture
    releases the capture and fires `pointercancel`, which ran the drag's own
    `end()` on the first move. Whatever pixels landed before that arrived were
    the "moves a little bit".
  - Panels are now brought forward with a **z-index counter** (`topZ` /
    `bringToFront()`) — no DOM move, so nothing disturbs the capture. Clicking
    anywhere on a panel also raises it.
  - The **whole title bar** drags, not just the 20px grip (the grip stays as
    the visual affordance); the minimise/close buttons are excluded so they
    still click. `.widget-head` got `cursor:grab` / `:active` grabbing and
    `touch-action:none`.
  - Drag and resize now share **one window-level gesture tracker** (`gesture`,
    `startGesture/moveGesture/endGesture`) rather than per-widget `pointermove`
    listeners, so a lost capture can't strand a drag and closing a widget can't
    leave handlers behind. `blur` ends a gesture too.
  - Positions are read from `offsetLeft/offsetTop` (wall-relative, the same
    frame the saved `left/top` are written in) instead of
    `getBoundingClientRect()`, which was viewport-relative.
  - Panels are **clamped to the wall**: never past the top or left edge, and
    always at least ~150×44px on screen at the right/bottom, so a panel shoved
    off the edge can still be grabbed by its grip and dragged back.
  - The **resize corner** was nearly invisible at 14px/0.35 opacity — now 18px,
    0.4 opacity, full opacity on hover, `touch-action:none`.
  - Verified in Chromium: drag by grip / title / bar, resize, values persisted
    to `state.layout` and surviving reload, clamping and recovery from
    off-screen, z-order stacking with two panels, minimise/close still
    clickable, body inputs still usable, touch-pointer drag, and no leftover
    handlers after repeated open/close — zero console errors.
- **v0.6.8** — Added `manual.html`, a teacher-facing instruction manual that
  ships in the project root next to this README. Self-contained single HTML
  file (no build step, no external assets beyond the same Google Fonts link
  the app uses, and it degrades to system fonts offline), styled with the
  app's own palette and using the real widget icons pulled from `ICONS` in
  `js/app.js`. Covers: the three install routes (double-click, Chrome
  "Load unpacked" new-tab extension, local web server) and what each one
  costs you, a tour of the docks/tray/panels, classes, theme + layout +
  language settings, all 30 widgets one by one (what it's for, how to drive
  it, and its real limits — mic needs a secure context, YouTube opens in a
  tab, currency rates are fixed not live, built-in games need http(s)),
  Free vs Pro and the licence box, where the data lives and what erases it,
  and a troubleshooting section. Two things it states plainly rather than
  papering over: this build is unlocked for testing, and the "Settings →
  Class list" editor that Attendance / Group Maker / Hall Pass point at
  doesn't exist yet (the orphaned Name Picker roster UI), so those three run
  on the shipped sample list. **Keep it in sync** with the app the same way
  as this README when widgets or settings change. Version bumped in
  `js/app.js`, `manifest.json` and the manual's own header (it reads
  `APP_VERSION` at build time from `build_manual.py`-style generation — in
  practice, just edit the two places it appears in `manual.html`).
- **v0.6.7** — **Classes.** A teacher with several classes a day can now keep one
  deck per class and switch between them from the top bar.
  - **Class pill** (`#class-pill-wrap` in the header, registered in `PILLS` as
    id `classes`) shows the class that's open; clicking it drops a menu listing
    every class plus "Manage classes…". Like the language and theme pills it can
    sit in the top pill row or be hidden, from Settings → Top bar pills
    (`pill-place-classes`).
  - **Settings → Classes** (first section, `#classes-section`): rename any class
    inline, "Open" to switch to it, × to delete it, a name box + **Create & open**
    to add one, and **Copy this class** to clone the current deck (same widgets,
    layout and theme) for a second section.
  - **What's per class:** everything in `state` — roster, which widgets are open
    and where, layout mode, dock/drawer placement, theme + background image,
    checklist, scoreboard, attendance, agenda, poll, announcements, language,
    date system. **Shared across classes** (one teacher, one browser): the
    IndexedDB media library (files, games, music, videos, sounds), the school
    logo, and the Pro license.
  - **Storage:** a new index key `td_classes_v1` = `{active, list:[{id,name}]}`.
    The existing `ww_state_v1` key is now simply class one — **anyone upgrading
    keeps their current deck untouched and finds it as their first class**.
    Classes added afterwards live in `ww_state_v1::<id>`. Background images are
    per class too (`background` for the first class, `background::<id>` after),
    via the `state.activeBgId` field that already existed.
  - **Switching reloads the page** on purpose (`switchClass()` saves the class
    you're leaving, points the index at the new one, then `location.reload()`),
    so every widget re-initialises from its own state instead of hot-swapping
    4,000 lines of live UI. Deleting the class you're in opens the next one;
    deleting any other class doesn't reload. The last remaining class can't be
    deleted. Cap of `MAX_CLASSES = 12`.
  - "Reset everything" now clears every class's state and the index, not just
    the open one.
  - **Not Pro-gated** — that's a pricing call, not a code one. To make multiple
    classes a Pro feature later, gate `addClass()` and the "Create & open" /
    "Copy this class" buttons on `isPro()`, the same way the background/logo
    uploads are.
  - Verified in Chromium (Playwright): create, rename, switch, copy, delete
    (active and non-active), last-class guard, per-class roster/theme/open-widgets
    isolation, per-class background images kept separately in IndexedDB, pill
    moved between header and pill row (menu flips side and stays on screen),
    pill hidden/shown, menu closes on outside click and Escape, labels follow the
    language switch, and state surviving a plain reload — zero console errors.
- **v0.6.6** — Background upload now always changes the background. Reported
  symptom: after v0.6.5, picking a background image showed "Couldn't save that
  image — try a smaller file…" and the background never changed. Reproduced in a
  real headless Chromium: it is **not** about file size (a fresh profile accepted
  a 36 MB PNG). The failure happens when storage is unavailable — e.g. the app
  running inside a sandboxed/embedded preview (no IndexedDB/localStorage; that
  reproduces the exact toast) — and, separately, a stale tab from an older build
  holding the DB open makes the v1→v2 upgrade hang with no message. Changes:
  - The chosen image is now painted **immediately from the picked file**, same
    single-slot loader as before (id `'background'`, `center/cover no-repeat`,
    no gallery). Saving to IndexedDB happens afterwards, best-effort, with a 6 s
    timeout. If it can't be saved the background still stays for the session and
    a new `bg_not_saved` toast says it won't survive a reload (instead of
    aborting the change).
  - `saveState()` no longer throws when localStorage is blocked, so theme presets,
    the dim toggle and everything else that calls it keep working in a sandboxed
    preview (before, the throw skipped whatever ran after it).
  - `idb.open()` releases its connection on `versionchange`, so an open tab can no
    longer block a future DB upgrade.
  - If `state.customBg` is set but the saved image can't be read, the layer falls
    back to the selected theme instead of staying blank.
  - `bg_upload_failed` (still used by the logo upload) reworded — it blamed file
    size, which was never the cause — and error toasts stay up 5 s instead of
    2.2 s. `toast(msg, ms)` takes an optional duration.
  - **Deliberately kept the IndexedDB version at 2.** Reverting to `open(..., 1)`
    would throw `VersionError` in any browser that already opened v2 and break
    every widget that uses IndexedDB (Files, Games, Music, Video, Soundboard).
  - Verified in Chromium (Playwright): fresh profile (small, 23 MB JPG, 36 MB PNG,
    persists across reload, preset switch clears it); sandboxed iframe (image
    applies, "won't be remembered" toast, dim/preset still work); stale v1 tab
    holding the DB (image applies at once, toast after 6 s, works again after
    the stale tab closes).
- **v0.6.5** — Reverted v0.6.4's background gallery UI back to a single-slot
  loader (upload replaces the one custom background again, no "Your
  backgrounds" swatch grid, no per-image remove button). Removed
  `buildCustomBgGrid()`/`genBgId()`, the `#theme-custom-bgs` grid and
  `.swatch-wrap`/`.swatch-remove` CSS, and the now-unused `your_backgrounds`/
  `remove_bg`/`bg_removed` i18n keys. **Kept** the actual v0.6.4 bug fix,
  since reverting that would silently reintroduce the original problem:
  `idb.open()` is still on DB version 2 (not back to the hardcoded 1 that
  caused uploads to fail forever for anyone whose local DB predated the
  `images` store), and both upload handlers still try/catch and show
  `bg_upload_failed` on a real failure instead of doing nothing. A saved
  state from v0.6.4 (which had a `customBgList` array) is migrated on load —
  whichever background was last active becomes the one single background
  again, and the list field is dropped. Verified with a headless jsdom +
  fake-indexeddb smoke test across three starting states (fresh install,
  pre-v0.6.4 legacy, v0.6.4 gallery state): upload correctly overwrites
  rather than appending in all three, with zero thrown errors.
- **v0.6.4** — Fixed background-image upload and added a background gallery:
  - **Root-cause fix**: `idb.open()` hardcoded `indexedDB.open('TeachersDeck', 1)` even as
    object stores (`images`, `games`, `music`, `videos`, `sounds`) were added over several
    versions. `onupgradeneeded` only fires when the requested version is *higher* than
    whatever's already on disk, so a browser profile whose "TeachersDeck" DB was first
    created before a given store existed would silently be missing it forever — any
    `idb.put()`/`idb.get()` against that store then rejects, and since the old upload
    handlers didn't catch that rejection, nothing visibly happened. Bumped the DB version
    to 2, which forces the (already idempotent, `contains()`-guarded) store-creation logic
    to run once for everyone. Also added an explicit rejection when `indexedDB` itself is
    undefined (e.g. some sandboxed/embedded browsing contexts), and `req.onblocked`/`req.onerror`
    now reject with a real error instead of the raw event.
  - **Visible failure instead of silent failure**: both the background and logo upload
    handlers now wrap `idb.put()` in try/catch and show a `bg_upload_failed` toast on
    failure (with a hint to try a different browser/window if testing from an embedded
    preview), instead of just doing nothing.
  - **Background gallery**: uploading a background no longer overwrites the previous one.
    Each upload gets its own id (`genBgId()`) and is appended to `state.customBgList`;
    the theme drawer now shows a "Your backgrounds" swatch grid (`#theme-custom-bgs`,
    built by `buildCustomBgGrid()`) below the upload row so any previously uploaded image
    can be clicked back into use, each with a small × to remove it. Removing the active
    one falls back to the next saved custom background, or to the preset swatches if none
    are left. Existing single-background users (old `state.customBg === true` shape) are
    migrated automatically — their one image becomes the first gallery entry, nothing is
    lost.
  - Verified with a headless jsdom + fake-indexeddb smoke test: fresh-install upload,
    legacy single-background migration, a second upload alongside the first, and removal
    — all run with zero thrown errors. As always, that's not a substitute for clicking
    through it in a real browser.
- **v0.6.3** — Extended v0.5.0's testing-mode unlock to cover Pro features
  outside the widget list. `PRO_WIDGET_IDS` being emptied only unlocks
  widgets gated through `isProWidget()`; it does nothing for the three
  Pro features gated directly on `isPro()` — custom background photo,
  custom school logo, and left/right drawer customization. `isPro()` is
  now temporarily forced to `true`, so those are unlocked too, with the
  real check commented directly above it, same as the existing
  `PRO_WIDGET_IDS` pattern. **Full list of what's unlocked for testing and
  needs re-locking before shipping:**
  - 25 Pro widgets: Traffic Light, Dice, Checklist, Scoreboard, Poll, Noise
    Meter, Music Player, Video Player, Soundboard, Games (the original 10),
    plus Wave 1's 15 — Attendance Tracker, Group Maker, Exit Ticket, Agenda
    Board, QR Code Generator, Days-Until Countdown, Hall Pass Tracker,
    Reading Timer & Log, Text-to-Speech Reader, Unit Converter,
    Announcements Board, Instructions Display, Conversation Starter Cards,
    Idiom of the Day, Grammar Quick-Reference.
  - 3 license-gated features: custom background photo, custom school logo,
    left/right drawer customization.
  - To re-lock everything before a real release: swap `PRO_WIDGET_IDS`
    back to its commented full list (in the comment block just above its
    declaration), and swap `isPro()` back to its commented real
    implementation (checking `state.license.pro`) directly above it.
- **v0.6.2** — Moved the app-tray line onto the dock itself: `#app-tray-tab`
  and `#dock` are now both inside a single `.dock-wrap` container, with the
  tab as a flush flex child sitting directly on the dock's top edge
  (`margin-bottom:-1px` so the borders merge) instead of a separately
  fixed-positioned element with a gap above the dock. Centering and the
  bottom offset moved from `.dock` to `.dock-wrap`; `.dock` itself is no
  longer `position:fixed`. The hover-collapsible slide-down animation is
  unaffected — it's a transform on `.dock` alone, so the tab stays put
  exactly where it was while the dock tucks away beneath it.
- **v0.6.1** — Two fixes/tweaks to v0.6.0's layout modes and app tray:
  - **Side dock cap enforced.** `ensureDockPlacement()`'s first-run migration
    used to split every non-bottom widget 50/50 into the left/right drawers
    with no regard for `DOCK_CAPS` (5 each) — with 30 widgets registered,
    that meant 10+ widgets could land in a single 5-slot drawer. It now fills
    the bottom dock to its own cap first, then alternates into left/right up
    to their 5-widget caps, sending any further overflow to `'hidden'`
    (still reachable via the app tray). `widgetsFor()` also now defensively
    slices to `DOCK_CAPS[loc]` at render time, so anyone whose saved state
    already had more than 5 in a side drawer sees it corrected immediately
    without needing to reset anything.
  - **App tray tab redesign.** The up-arrow above the bottom dock is now a
    plain horizontal line (`.app-tray-tab-line`), matching the drag-handle
    bar used to close the tray sheet itself, instead of a chevron that
    flipped on open/close.
- **v0.6.0** — Layout modes + app tray:
  - **App tray**: a small arrow tab now sits just above the bottom dock.
    Tapping it slides up an Android-style bottom sheet listing *every*
    widget (`#app-tray-grid`, built by `buildAppTray()`), regardless of its
    dock placement — the one guaranteed way to reach a widget whose drawer
    is currently hidden. Click a tile to open/close that widget, same as any
    dock button; click the handle, click outside the sheet, or press Escape
    to close it.
  - **Layout modes** (`state.layoutMode`, `LAYOUT_MODES` in `js/app.js`): a
    new "Layout mode" picker at the top of the Settings drawer offers three
    presets:
    - *Compact* — only the bottom dock is shown (left/right drawers forced
      off); use the app tray arrow to reach everything else.
    - *Comfortable* — bottom, left and right docks are all forced on (the
      previous default multi-dock look).
    - *Custom* — hands control back to the existing per-widget "Dock
      buttons" placement list and the "Show left/right drawer" toggles,
      which are greyed out and disabled while Compact/Comfortable is active
      (a small note explains they're set by the layout mode above).
    Switching modes only changes which docks are *visible* — it never
    touches a widget's saved dock assignment (`state.dockPlacement`), so
    flipping back to Custom restores exactly what was set before.
  - Existing saves (no `layoutMode` in their state yet) migrate to *Custom*
    so nobody's current left/right drawer setup changes on upgrade; brand
    new installs default to *Comfortable*.
  - The "Show left drawer" / "Show right drawer" toggles from v0.5 and
    earlier are unchanged in behavior — they now simply only take effect in
    Custom mode.
- **v0.5.0** — Wave 1 of the widget roadmap: 15 new widgets, all registered as Pro
  (Attendance Tracker, Group Maker, Exit Ticket, Agenda Board, QR Code Generator,
  Days-Until Countdown, Hall Pass Tracker, Reading Timer & Log, Text-to-Speech
  Reader, Unit Converter, Announcements Board, Instructions Display, Conversation
  Starter Cards, Idiom of the Day, and Grammar Quick-Reference). All are
  local-only, following the existing storage/i18n/toast conventions in
  `js/app.js`.
  - **QR Code Generator** vendors `qrcode-generator` v2.0.4 by Kazuhiko Arase
    (MIT license) as `js/qrcode-lib.js`, loaded before `js/app.js` — the QR is
    built and rendered as an SVG entirely on-device, no network call.
  - **Unit Converter**'s currency mode uses a small fixed rate table
    (`UC_CURRENCY` in `js/app.js`) rather than a live feed, since this app has
    no backend — it's clearly labeled as an approximate, not-live rate and is
    meant for rough classroom estimates, not real transactions. Update the
    table by hand if the rates drift too far.
  - **Instructions Display** ships text-only steps for now — the roadmap's
    "optional image per step" is a follow-up, not included in this pass.
  - **Testing mode**: `PRO_WIDGET_IDS` is temporarily set to `[]` so every
    widget (the 10 pre-existing Pro ones and all 15 new Wave 1 widgets) is
    unlocked for trying out. The full intended list is left commented
    directly above it in `js/app.js` — swap the two lines back once Wave 1
    has been tested, to re-lock everything behind Pro.
  - Verified with a headless smoke test (jsdom): all 30 widgets — old and
    new — open, run their setup, and close without throwing, and a handful
    of interactions were exercised directly (attendance toggle, group
    shuffle, QR generation, countdown date, hall pass send/return, reading
    log entry, unit conversion, posting an announcement, adding an
    instruction step, cycling conversation cards/idioms/grammar topics, exit
    ticket tally, agenda field, TTS invocation). This is not the same as
    clicking through it by hand in a real browser — do that pass before
    relying on it in a classroom.
- **v0.4.7** — Debugged the whole app end-to-end (served the project with a
  real local web server and checked every href/src/fetch path against actual
  files — all resolved with no 404s). The Classroom Word Wheel → Scoreboard
  score hand-off (`td_scoreboard_transfer` in localStorage) was confirmed
  working correctly when the project is served as real files and the app
  tab is open. The most likely real-world cause of a "404 on click": built-in
  games (fetched from `games/games.json`) only work when TeachersDeck is
  served as actual files (a local web server or the Chrome extension) — they
  can't work from the single-file published artifact link, and a game
  uploaded standalone through the Games widget's own picker loses its
  sibling files (e.g. instructions.html) since it only carries the one
  uploaded file. Hardened against this either way: clicking a built-in
  game tile or its "?" instructions button now does a HEAD check first and
  shows a clear toast instead of silently opening a broken/blank tab.
- **v0.4.6** — Reverted all dock buttons (bottom dock, top widget dock, left
  drawer, right drawer) from the trapezoid "folder tab" shape back to
  plain rounded rectangles.
- **v0.4.5** — Games' "click to add an HTML game" control now shows the
  same "Browse" button as v0.4.4's Files/Video/Music/Soundboard change.
  Only the Calendar's .ics import still uses the older text+"+" style.
- **v0.4.4** — Files, Video Player, Music Player, and Soundboard's "click to
  add a file" controls now show a real "Browse" button (icon + label,
  app-styled) instead of clickable placeholder text with a small "+" next
  to it — same underlying file picker, just a clearer, more obviously
  clickable control. Games and the Calendar's .ics import still use the
  older text+"+" style for now.
- **v0.4.3** — Moved the **Settings** button out of the bottom dock and into
  the top pill row, pinned as the last (rightmost) pill — alongside the
  language and theme pills, but always visible and not reassignable from the
  "Top bar pills" picker (it doesn't compete for the 5-slot cap). Follows the
  bottom dock's hover-open/pinned-open behavior along with the other pills.
- **v0.4.2** — Classroom Word Wheel's "Send scores" button now actually
  works: it used to try opening a `classroom_scoreboard.html` file that was
  never part of the game's folder (a 404). It now hands its team scores
  straight to TeachersDeck's own built-in Scoreboard widget via a small
  `localStorage` handoff (same-origin, no extra file needed) — the widget
  picks it up live if it's already open, opens itself if it isn't, and
  applies it on next load if the app tab wasn't open yet when scores were
  sent. `games/README.md` documents the handoff so any future game with its
  own scoring can use the same mechanism.
- **v0.4.1** — Registered the **Classroom Word Wheel** game (dropped into
  `games/Classroom-Word-Wheel/`) in `games.json`, so it now shows up as a
  Built-in games tile — it was sitting in the folder but wasn't listed yet.
  Also wired up the `instructions` field for real: a built-in game tile now
  gets a small "?" button when it has one, opening that file in a new tab.
  `games/README.md` now documents this game as the house style to follow
  for future TeachersDeck games (visual theme, host/setup panel pattern,
  sound design, scoreboard conventions) — see "House style for TeachersDeck
  games" in there.
- **v0.4.0** — Six changes:
  1. **Video Player: delete button for saved clips.** Each clip in the "My
     files" list now has a "−" button to remove it, matching the Music
     Player's track list.
  2. **Music Player: delete button changed to a "−" sign** (was an "X"
     icon) — same functionality, clearer at a glance.
  3. **Every "click to add a file" control now has a small circular "+"
     button next to the text**, across Files, Games, Music Player, Video
     Player, Soundboard, and the Calendar's .ics import. The whole label
     still opens the file picker either way — this just makes it obvious
     at a glance that it's clickable.
  4. **Fixed the Timer's Reset button.** Reset used to clear the countdown
     display but silently kept the last duration cached, so hitting Start
     right after Reset would jump straight back into counting down from
     that old number. Reset now clears the cached duration too — Start
     does nothing until you add time again with +1m/+5m.
  5. **Stopwatch: added a Lap button.** Available while running, it
     records a split; a scrollable list shows each lap's split time and
     running total, most recent on top. Reset clears the lap list along
     with the stopwatch itself.
  6. **New `games/` folder** for dropping in ready-made HTML games plus
     whatever else they need (images, a separate script file, an
     instructions handout) — a second path into the Games widget alongside
     its own single-file upload button. See `games/README.md`; a working
     example game ships in `games/example-guess-the-number/`.
- **v0.3.1** — The IndexedDB database is now named `TeachersDeck`, finishing
  the rename that v0.2.2 deliberately left alone. **This is a one-way break:**
  anyone with data in the old `widget-wall` database (uploaded files, custom
  background/logo images) will see an empty library on this build — there's
  no migration, by request. The app also does a one-time cleanup on load that
  deletes the old `widget-wall` database if it's still sitting in the
  browser, so nothing orphaned lingers.
- **v0.3.0** — Four changes:
  1. **Fixed the language/theme pills disappearing.** The top pill drawer was
     moving the live language-toggle and theme-button elements into itself,
     then wiping its own container on every rebuild — which destroyed those
     elements outright the next time you switched language or touched a
     drawer setting, and they never came back. It now only ever moves those
     elements between containers, never destroys them.
  2. **New top widget dock.** A left-justified row of up to 5 icon-only
     widget launchers, sitting right after the "TeachersDeck" brand name in
     the header — a fourth home for widgets alongside the bottom dock and
     left/right drawers. Pick it from Settings → Dock buttons like any other
     placement.
  3. **YouTube links now open in a new browser tab** instead of playing in
     an embedded iframe, in both the Music Player's Stream tab and the Video
     Player's YouTube tab. This sidesteps YouTube's embed-referer rules
     entirely (see the retired "Error 153" note below) — a full tab always
     just works, regardless of ad-blockers or how the app is being served.
     The widget shows a small "Open in YouTube" card so you can relaunch the
     link later without retyping it.
  4. **Folder-tab styling for the bottom, left, right, and (new) top widget
     docks.** Each widget launcher is now a trapezoidal tab — flush against
     the edge it "hangs" from and tapering toward the canvas — with
     overlapping tabs and the active/hovered one popping forward, so the
     whole set reads like tabs on a folder rather than plain icon buttons.
     (The language/theme pill drawer keeps its original pill look — it's a
     toggle row, not a widget launcher.)
- **v0.2.2** — Renamed the app from Widget Wall to **TeachersDeck** everywhere
  user-facing: browser tab title, header brand mark, extension name/description
  in `manifest.json`, and this README. The `teachersdeck` folder replaces the
  old `widget-wall` folder name (update your Chrome extension's "Load unpacked"
  selection to point at the new folder). Internally, the IndexedDB database is
  still named `widget-wall` on purpose — renaming it would create a *new*,
  empty database and silently wipe every teacher's saved layout, theme, roster,
  and uploaded files. That's a one-way data migration to do carefully later,
  not something to fold into a cosmetic rename.
- **v0.2.1** — Fixed the top drawer: it was splitting pills into a
  top-left/top-right pair, and top-left sat directly over the brand mark
  in the header, which is why the language-switch pill effectively
  disappeared there. The top drawer is now a single left-justified group,
  capped at 5, anchored at the top-right so it never overlaps the brand.
- **v0.2** — Widget drawers. The bottom dock now holds up to 10 widgets;
  new left and right drawers hold up to 5 each (for scaling toward 50+
  widgets); a new top drawer holds "pill" toggles (language switch, theme
  button — room for 5 more). All three are on by default and can be
  turned off, reassigned, or set to auto-hide-and-reveal-on-hover from
  Settings → *Side & top drawers*. Settings now also shows the app version.
- **v0.1** — Core shell: dock, draggable/resizable widgets, theme drawer,
  settings drawer, first 16 widgets, EN/VI-first localization.

## Run it now (standalone web app)
Just open `index.html` in Chrome. Everything works locally — no server needed.

## Turn it into a Chrome extension (new tab override)
1. In Chrome, go to `chrome://extensions`, enable **Developer mode**.
2. Click **Load unpacked** and select this `teachersdeck` folder.
3. Open a new tab — TeachersDeck replaces Chrome's default new tab page.

The same `index.html` powers both, so anything you build in the browser
version carries straight over to the extension version.

## What's included in this shell
- **Dock** at the bottom to open/close widgets, styled after the reference site.
- **Draggable, resizable widget panels** — position and size are saved per
  browser (localStorage), so the layout is remembered next time.
- **Theme drawer**: six preset backgrounds, plus upload-your-own background
  image and a school/company logo overlay (stored in this browser's
  IndexedDB — not uploaded anywhere).
- **Classes**: one deck per class (roster, widgets, layout, theme all
  separate), switched from the class pill in the top bar; managed in Settings
  → Classes.
- **Settings drawer**: editable class roster (used by Name Picker), reset
  layout, reset everything.
- **Working widgets**: Clock, Timer, Stopwatch, Traffic Light, Dice,
  Checklist, Name Picker, Files, Games.
- **Files widget**: teachers add PDFs / PowerPoint / Word / Excel files,
  stored locally in the browser (IndexedDB) and opened in a new tab. PDFs
  render with Chrome's built-in PDF viewer. Office files currently open via
  the browser's/OS's default handler — true in-page rendering (so a .pptx
  or .docx displays inline in a widget, not just downloads) is a separate
  next step; see below.
- **Games widget**: add a self-contained `.html` game file and launch it in
  a new tab. Games written in Java or Python won't run in a browser as-is —
  they'd need converting to HTML/JS (or a Python-in-browser runtime like
  Pyodide, or a Java-to-web toolchain), which is a bigger separate task.

## Widget drawers (bottom / left / right / top) + top widget dock
Built for scaling past 16 widgets toward 50+ without crowding one bar:

- **Bottom dock** — up to 10 widget launchers (unchanged from v0.1).
- **Left drawer** — up to 5 widget launchers, vertical, hugs the left edge.
- **Right drawer** — up to 5 widget launchers, vertical, hugs the right edge.
- **Top widget dock** (new in v0.3.0) — up to 5 widget launchers, icon-only,
  left-justified right after the "TeachersDeck" brand name in the header.
  Always visible (no on/off setting, unlike the drawers below) — pick it
  from **Settings → Dock buttons** like any other placement.
- **Top pill drawer** — a separate thing from the widget dock above; not for
  widgets at all, it's for "pill" toggles like the language switch and theme
  button, shown as a single left-justified row (up to 5 pills) anchored at
  the top-right, clear of the brand mark. When this drawer is turned off,
  those two pills just sit inline in the header like they did in v0.1.

All four widget launchers (bottom, left, right, top) share the same
**folder-tab look**: each button is a trapezoid, flush against the edge it
"hangs" from and tapering toward the canvas, with tabs overlapping slightly
and the active/hovered one popping forward — like tabs on a folder rather
than plain buttons. The pill drawer keeps its original pill styling, since
it's a toggle row, not a widget launcher.

Every widget lives in exactly one of bottom / left / right / top / hidden —
**Settings → Dock buttons** has a dropdown per widget to move it, and each
location enforces its cap (moving a 6th widget into a 5-slot dock is
rejected with a toast). On upgrade from a v0.1 save, the first 10 widgets
(registry order) stay on the bottom dock and the rest are split evenly
into the left/right drawers, so nothing that used to be reachable
disappears; the new top widget dock starts empty until you assign
something to it.

**Settings → Side & top drawers** controls (these govern the left/right
widget drawers and the top *pill* drawer — the new top *widget* dock has
no visibility toggle, since it's always on):
- Show left / right / top drawer — on by default; turn any of them off to
  reclaim that edge of the screen entirely.
- Open drawers on hover — off by default (drawers you've made visible just
  stay fully open, like the bottom dock always has). Turn it on and the
  bottom dock plus every visible edge drawer — pill drawer, left, and
  right — tucks away to a thin strip at its edge and slides fully into
  view when the mouse reaches that edge, collapsing again when the mouse
  leaves. (The new top widget dock sits inline in the header rather than
  floating, so it doesn't tuck away — it's always fully visible.)

## Free vs Pro

TeachersDeck now ships with a Free tier and a paid Pro tier, unlocked from
**Settings → TeachersDeck Pro** (at the top of the Settings drawer).

- **Free**: clock, timer, stopwatch, built-in calendar, lesson files.
- **Pro**: traffic light, dice, checklist, scoreboard, poll, noise meter,
  games, music & video player, soundboard, custom background photo, custom
  school logo, and left/right drawer customization. Edit the
  `PRO_WIDGET_IDS` array in `js/app.js` to change this split.

The Name Picker widget (and its "Class list" roster setting) has been
removed from this version.

There's no backend or account system — Pro is unlocked with an **offline
license key** (format `TDPRO-XXXX-XXXX-XXXX`) validated client-side, so it
works with the "no login, no setup" design of the app. That also means it's
not hardened DRM: the checksum lives in the shipped JS, so a determined user
could read `PRO_LICENSE_SALT` in `js/app.js` and mint their own key. It's
enough to stop casual free-riding, not a determined bypass. For stronger
protection, keys would need to be issued and checked by a small server
instead (e.g. a Stripe webhook calling a license API).

**To go live, fill in these placeholders near the top of `js/app.js`:**

| Constant | What to set it to |
|---|---|
| `PRO_PRICE_USD` / `PRO_PRICE_VND` | Your real Pro price |
| `HSBC_ACCOUNT_NUMBER` / `HSBC_ACCOUNT_NAME` | Your HSBC Vietnam VietQR account details (shown first, as a bank-transfer QR code via the public img.vietqr.io API) |
| `STRIPE_PAYMENT_LINK` | A Stripe Payment Link URL (dashboard.stripe.com/payment-links) — or swap in another Asian processor's checkout link (Xendit, PayerMax, 2Checkout, PayPal.me, Wise, etc.) — no backend required either way |

After a customer pays, generate them a key by running `generateLicenseKey()`
in the browser console (uses the same checksum the app validates against)
and email it to them; they paste it into Settings → TeachersDeck Pro.

## Storage model (important for a classroom tool)
Everything — layout, theme, roster, checklist, uploaded files/games/logo —
is stored **only in that browser, on that device**, using `localStorage`
and `IndexedDB`. Nothing is uploaded anywhere. That matches "teacher
uploads/stores files locally" from the brief, but also means:
- Clearing browser data wipes it.
- It doesn't sync between a teacher's classroom computer and, say, their
  laptop at home — that would need real cloud storage (Google Drive,
  OneDrive, or your own server) as a later phase.

## Soundboard widget
A grid of one-tap attention-getter sound effects — a bell, applause, a
drumroll, whatever mp3/wav clips you add. Tap a tile to play it
immediately (it stops whatever was playing and starts the new one, so
sounds don't overlap), the playing tile pulses, and there's a Stop
button plus a volume slider. Add sounds the same way as everywhere else
in this app — pick the files, they're stored in this browser only.

## Music Player & Video Player widgets
Two widgets, each with tabs for different sources.

**Music Player** — "My files" tab, "Stream" tab (YouTube/SoundCloud), "Spotify" tab.
**Video Player** — "My files" tab, "YouTube" tab.

A few things worth knowing about what's really possible here, browser security being what it is:

- **"Import my Windows Media Player / iTunes playlist" isn't something a browser can do.**
  Those playlists (.wpl, iTunes library files, etc.) just point to file paths on your
  computer, and no browser will let a web page silently reach into your file system and
  follow those paths — that's a deliberate, unavoidable security boundary. The practical
  equivalent: use "Add music files" / "Add video files" and select the actual song or
  video files you'd normally play in those apps. Once added, they're stored in this
  browser (not uploaded anywhere) and play back with playlist controls (click to play,
  auto-advances to the next track when one ends).
- **YouTube** opens in a new browser tab rather than playing inside the widget —
  paste a video or playlist link in the Stream/YouTube tab, hit Play, and it
  launches on youtube.com in its own tab. This is deliberate: embedded YouTube
  players need a real HTTP referer to work at all (see the old "Error 153"
  note below, which no longer applies), and a full new tab always just works,
  with no dependence on how the app is being served or which ad-blockers are
  installed. The card left behind in the widget has an "Open in YouTube" link
  in case the tab didn't open (e.g. a popup blocker) or you want to relaunch it later.
- **SoundCloud** (Music Player's Stream tab) also works with no setup for public
  tracks and playlists — paste the link and it embeds SoundCloud's player.
- **Spotify is the one real limitation.** Playing Spotify tracks *inside* this widget
  would need a Spotify Premium account and your own registered Spotify developer app
  (OAuth sign-in) — Spotify doesn't allow embedded playback without that, similar to
  why Google Calendar needed its own OAuth flow. What's built instead: paste your
  playlist link and "Open in Spotify" launches it in the Spotify app or web player.
  If real in-widget Spotify playback (with your own Premium account connected) is
  something you want, that's a bigger, separate piece of work — happy to scope it out
  if you'd like to go there.

### (Retired) Troubleshooting: YouTube "Error 153"
Earlier versions embedded YouTube in an iframe inside the widget, which could
fail with error 153 because YouTube's embed rules need a real HTTP referer —
something a plain double-clicked `index.html` file, some ad-blockers, or a
video with embedding disabled by its uploader could all break. Since YouTube
links now open in their own browser tab instead of an iframe, none of that
applies anymore — this note is kept only as build history.

## Poll widget
A quick show-of-hands tally tool: set a question and 2–8 options under the
gear icon, then tap an option once per vote as hands go up (or however you
want to count them). Results show as live bars with vote counts, and
"Reset votes" clears the tally for the next question while keeping the
question and options in place. There's no student-device voting here —
everything runs on this one screen — since real-time multi-device voting
would need a backend server to sync votes between devices, which this
browser-only app intentionally doesn't have.

## Noise Meter widget (microphone)
Shows a live, color-coded noise level (green/amber/red) with an
approximate decibel number, using your device's microphone.

- Click "Enable microphone" — your browser will ask for microphone
  permission the first time.
- **Important — this needs a "secure context" to work at all**: opening
  `index.html` by double-clicking the file will NOT allow microphone
  access (browsers block it for plain local files). To use this widget,
  either:
  1. Load the app as the unpacked Chrome extension (see "Turn it into a
     Chrome extension" above) — extension pages count as secure, or
  2. Serve the folder over `http://localhost` (e.g. `python3 -m http.server`
     from inside the `teachersdeck` folder, then open `http://localhost:8000`).
  If neither is set up, the widget shows a message explaining this instead
  of a broken mic prompt.
- **The reading is approximate, not a calibrated sound level meter.**
  Browsers have no way to read true, calibrated decibels (dB SPL) from a
  microphone — that needs hardware calibration a laptop or classroom
  device doesn't have. What's shown is a relative loudness reading scaled
  to look like a familiar dB range, useful for "is the class louder than
  a minute ago" feedback, not for any measurement that needs to be exact.
- The microphone turns off automatically when you close the widget.

## Date system (Gregorian / Lunar)
Settings → Date system lets you choose how dates display everywhere:
**Gregorian** (default), **Lunar**, or **Both**. This uses the
Vietnamese/Chinese lunisolar calendar (calculated astronomically, tuned
for Vietnam's UTC+7), not a stored table, so it's accurate for any year.

- **Clock widget**: shows the lunar date instead of (or alongside) the
  Gregorian date.
- **Calendar widget**: each day in the month grid gets a small lunar
  day/month number, and the selected day's heading includes the lunar
  date too. The month grid itself still navigates by Gregorian months —
  a full lunar-month view (where the grid itself is laid out by lunar
  months, with their 29/30-day lengths and leap months) is a bigger,
  separate change if that's ever wanted.
- Changing this setting updates any open Clock or Calendar widget
  immediately.

## Calendar widget
A month-view calendar with its own gear icon (top-right of the widget) for
managing events.

- **Browse**: arrows move month to month; tap a day to see its events below
  the grid; the `+` button quick-adds an event on the selected day.
- **Manage** (gear icon): add, edit, or delete any event — title, date,
  time (optional), a reminder offset, and notes. There's also a full list
  of every event with quick edit/delete/"Add to Google Calendar" actions.
- **Popup reminders**: if an event has a reminder set, a dismissable popup
  appears in the app when it's due — this works as long as the browser tab
  is open, even if the Calendar widget itself isn't. There's also an
  optional "Enable desktop notifications" button that asks the browser for
  permission to also show an OS-level notification, for when the tab is in
  the background.
- **Google Calendar, two directions**:
  - *Push a local event to Google Calendar*: the calendar icon next to any
    event in the manage list opens Google Calendar's "add event" page,
    pre-filled, in a new tab.
  - *Pull events in from Google Calendar*: real live two-way sync needs
    Google's official API and an OAuth sign-in flow, which isn't something
    a browser-only, no-backend app like this can do safely. Instead,
    export a calendar or event from Google Calendar as an **.ics file**
    (Settings menu in Google Calendar → Export) and add that file under
    the gear icon's "Import from Google Calendar" section — it's parsed
    entirely in the browser and added as local events. If a two-way,
    always-in-sync Google Calendar connection becomes a priority, that's
    a separate, larger project (it needs a backend to hold the OAuth
    credentials) — worth a dedicated conversation if you want to go there.

## Localization
The whole interface — dock labels, drawers, widget text, toasts — is
translatable. Two languages are picked as "quick" languages and shown as
a toggle pill in the top bar (default: English / Vietnamese, since that's
the primary classroom mix). Switching that toggle re-labels the entire
app instantly, without losing anything a widget is in the middle of
(a running Timer keeps counting, for example).

- **Quick switch**: the `EN` / `VI` pill top-right.
- **Change the pair**: Settings → Language → pick any two of the built-in
  languages (English, Vietnamese, Spanish, French, Chinese, Japanese,
  Korean, Tagalog) for the two quick-switch slots.
- **Add another language**: open `js/app.js`, find the `LANGS` array near
  the top and add `{ code:'xx', name:'Your Language' }`, then add an
  `xx:'...'` translation to each entry in the `STRINGS` object right
  below it. Everything else (dock, drawers, widgets) picks it up
  automatically — no other code changes needed. Untranslated keys
  silently fall back to English rather than showing blank text.
- Student names, checklist items, and file/game names are treated as the
  teacher's own data and are never auto-translated.

## Suggested next phases
1. **In-page Office/PDF viewers** — render PDFs, PPTX, DOCX, XLSX *inside*
   a widget instead of opening a new tab (pdf.js for PDF; libraries or
   Office Online embedding for PPTX/DOCX/XLSX — each has real trade-offs
   worth discussing before picking one).
2. **True Chrome extension polish** — icons, options page, packaging for
   the Chrome Web Store.
3. **Cloud sync** (optional) — Google Drive/OneDrive so a teacher's wall
   and files follow them between devices.
4. **More widgets** — whatever else comes up as you use it (attendance,
   recipes, instructions, etc. were on the reference site's dock).

## File structure
```
teachersdeck/
  index.html        the whole app shell
  manual.html       teacher-facing instruction manual (install + every widget)
  css/style.css      theme + layout + widget styling
  js/app.js          widget registry, drag/resize, storage, theming
  manifest.json       optional — only needed for the Chrome extension version
  games/             drop-in .html games + their assets (see games/README.md)
    README.md        how to add a game and register it
    games.json        the list of built-in games the Games widget reads
    example-guess-the-number/   a working example game (safe to delete)
```

### The `games/` folder
A second way to get a game into the Games widget, alongside the widget's own
upload button. The upload button only takes a single `.html` file at a
time — fine for something fully self-contained, but not for a game that
comes with its own images, a separate script file, or a handout of
instructions for students. Drop that whole folder into `games/` instead,
list it in `games/games.json`, and it shows up as a "Built-in games" tile
next to anything uploaded through the widget. Full instructions, plus a
working example, are in `games/README.md`. Like the YouTube tabs, reading
`games.json` needs the app served over `http://localhost` or loaded as the
Chrome extension — it won't work from a bare double-clicked `index.html`.
