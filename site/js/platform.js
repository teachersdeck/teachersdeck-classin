/* TeachersDeck for ClassIn — the platform file. Sets window.TD_PLATFORM, which the shared js/app.js reads (its "platform:"
   hooks) and js/classin.js builds on. tools/build_platform.py puts this file straight after js/edition.js, so it runs
   before js/cloud.js and js/app.js. The suite's own TeachersDeck never loads it. See PLATFORMS.md.

   The hosted site IS the ClassIn edition: nothing to switch on, and no saved choice to override another site's.

   Link presets. A link with w= opens ONE widget filling the browser window, optionally pre-set:
     index.html?w=timer&min=5&go=1
   common   w=<widget id>   lang=en|vi   scale=0.5..3 (size on the board)   ui=0 (hide the little toolbar)
   timer    min, sec, go=1              stopwatch  go=1                      traffic  light=red|yellow|green
   noise    go=1                         scoreboard teams=Red,Blue,Green (2-8)  keep=1 keeps scores
   instructions  title, titlevi, steps=Do this~Làm việc này|Then that~Rồi việc kia   ("|" between steps, "~" before the Vietnamese line)
   agenda   schedule, objective, donow   ("|" starts a new line)
   drawdeck (no presets) the DrawDeck whiteboard, filling the window as it is (a full-screen widget, js/classin.js); boards stay in this browser
   Old links that still carry edition=classin work unchanged (the parameter is simply ignored).
   Every value is length-limited and treated as plain text (it is only ever shown with textContent or via the app's own escaping). */
(function(){
  'use strict';
  var BUILD = 'classin.2';   // the platform build: raise it for a ClassIn-only release; back to classin.1 when TeachersDeck's version changes
  var q = new URLSearchParams(location.search);

  /* Left out of the ClassIn edition: ClassIn's browser is SHARED ON THE BOARD, so nothing with student data or the teacher's
     personal progress may show in it, and anything that needs a sign-in pop-up or the Google Meet launcher can't work there. */
  var HIDDEN = ['meet', 'cloudclass', 'noteshome', 'classactivity', 'rewardpoints', 'lessonplanner', 'progressreports', 'assignments', 'stats',
    'badges', 'badgecase',          // the teacher's own badges (badgecase since TeachersDeck 0.22.1)
    'scrapreview', 'boardreview'];  // students' shared Scrapdeck pages and board answers (0.27.0, 0.29.0)
  var BOARD_LAYOUT = { instructions:'fill', agenda:'fill', checklist:'fill', scoreboard:'scale' };    // widgets that use the whole window; the rest are scaled up to fit it

  function clip(v, n){ return String(v == null ? '' : v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').slice(0, n); }
  function int(v, lo, hi, d){ var n = parseInt(v, 10); return isFinite(n) ? Math.min(hi, Math.max(lo, n)) : d; }
  function flag(v){ return v === '1' || v === 'true' || v === 'yes'; }
  function list(v, sep, maxItems, maxLen){ return clip(v, 2000).split(sep).map(function(x){ return x.trim(); }).filter(Boolean).slice(0, maxItems).map(function(x){ return x.slice(0, maxLen); }); }

  var PRESETS = {
    timer:        function(p){ var total = int(p.get('min'), 0, 180, 0) * 60 + int(p.get('sec'), 0, 59, 0); return (total > 0 || flag(p.get('go'))) ? { seconds: total || 300, go: flag(p.get('go')) } : null; },
    stopwatch:    function(p){ return flag(p.get('go')) ? { go: true } : null; },
    traffic:      function(p){ var l = p.get('light'); return (l === 'red' || l === 'yellow' || l === 'green') ? { light: l } : null; },
    noise:        function(p){ return flag(p.get('go')) ? { go: true } : null; },
    scoreboard:   function(p){ var names = list(p.get('teams'), ',', 8, 24); return names.length >= 2 ? { teams: names, keep: flag(p.get('keep')) } : null; },
    instructions: function(p){ var steps = list(p.get('steps'), '|', 20, 160).map(function(s){ var a = s.split('~'); return { text: (a[0] || '').trim(), vi: (a[1] || '').trim() }; }).filter(function(s){ return s.text; });
                                var title = clip(p.get('title'), 120), titleVi = clip(p.get('titlevi'), 120);
                                return (steps.length || title) ? { title: title, titleVi: titleVi, steps: steps } : null; },
    agenda:       function(p){ var a = list(p.get('schedule'), '|', 12, 120).join('\n'), b = clip(p.get('objective'), 400), c = clip(p.get('donow'), 400); return (a || b || c) ? { schedule: a, objective: b, doNow: c } : null; }
  };

  var widget = clip(q.get('w'), 40).replace(/[^a-z0-9]/gi, '');
  var lang = q.get('lang'); lang = (lang === 'vi' || lang === 'en') ? lang : '';
  var appVersion = (window.DECK_EDITION && window.DECK_EDITION.version) || '0.0.0';
  var P = window.TD_PLATFORM = {
    id: 'classin', name: 'TeachersDeck for ClassIn', build: BUILD, version: appVersion + '-' + BUILD,
    lang: lang,
    fixedWidgets: true,            // app.js: no first-run tidy — a ClassIn link can open any board widget
    schoolPro: false, deferInit: false,
    hidden: HIDDEN, boardLayout: BOARD_LAYOUT,
    widget: widget, single: !!widget,
    scale: Math.min(3, Math.max(0.5, parseFloat(q.get('scale')) || 1)), ui: q.get('ui') !== '0',
    hides: function(wid){ return HIDDEN.indexOf(wid) !== -1; },
    presetFor: function(wid){ return (widget === wid && PRESETS[wid]) ? PRESETS[wid](q) : null; },
    _parse: function(search){ var qq = new URLSearchParams(search); return widget && PRESETS[widget] ? PRESETS[widget](qq) : null; }   // for tests
  };
  try{ localStorage.removeItem('td_edition_v1'); }catch(e){}   // the old sticky edition switch; nothing reads it any more
  var h = document.documentElement;
  h.classList.add('ed-classin');
  if(P.single) h.classList.add('board-single');
  if(!P.ui) h.classList.add('board-ui-off');
})();
