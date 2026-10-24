/* TeachersDeck — edition + preset links (ClassIn port, round 1: build "classin.1")
   Loaded in <head>, BEFORE app.js, so the page chrome can be adjusted before the first paint.
   INERT unless the ClassIn edition is on, so the Chrome-extension build behaves exactly as before.

   Turning the ClassIn edition on (sticky: remembered in localStorage so closing and reopening ClassIn's browser keeps it):
     ?edition=classin      on        ?edition=default     off (back to the normal deck)
     <meta name="td-edition" content="classin">   baked into the hosted ClassIn build by tools/build_classin.py

   Link presets (ClassIn edition). A link opens ONE widget filling the browser window, optionally pre-set:
     ?edition=classin&w=timer&min=5&go=1
   common   w=<widget id>   lang=en|vi   scale=0.5..3 (size on the board)   ui=0 (hide the little toolbar)
   timer    min, sec, go=1              stopwatch  go=1                      traffic  light=red|yellow|green
   noise    go=1                         scoreboard teams=Red,Blue,Green (2-8)  keep=1 keeps scores
   instructions  title, titlevi, steps=Do this~Làm việc này|Then that~Rồi việc kia   ("|" between steps, "~" before the Vietnamese line)
   agenda   schedule, objective, donow   ("|" starts a new line)
   Every value is length-limited and treated as plain text (it is only ever shown with textContent or via the app's own escaping). */
(function(){
  'use strict';
  var LS = 'td_edition_v1', q = new URLSearchParams(location.search), saved = {};
  try{ saved = JSON.parse(localStorage.getItem(LS)) || {}; }catch(e){}
  var meta = document.querySelector('meta[name="td-edition"]'), baked = meta ? meta.getAttribute('content') : '';
  var param = q.get('edition');
  var id = param === 'default' ? 'default' : param === 'classin' ? 'classin' : (saved.id || baked || 'default');
  if(param){ try{ localStorage.setItem(LS, JSON.stringify({ id: id })); }catch(e){} }

  /* hidden in the ClassIn edition: the ClassIn browser is SHARED ON THE BOARD, so nothing with student data may show in it, and anything that needs a sign-in
     pop-up or the Google Meet launcher can't work there. (Class Activity's health check and the notes/points widgets are the StudentDeck/ParentDeck side.) */
  var HIDDEN = ['meet', 'cloudclass', 'noteshome', 'classactivity', 'rewardpoints', 'lessonplanner', 'progressreports', 'assignments', 'stats', 'badges'];
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

  var classin = id === 'classin', widget = classin ? clip(q.get('w'), 40).replace(/[^a-z0-9]/gi, '') : '';
  var lang = q.get('lang'); lang = (lang === 'vi' || lang === 'en') ? lang : '';
  var E = window.TD_EDITION = {
    id: id, classin: classin, build: 'classin.1',
    widget: widget, single: !!widget, lang: lang,
    scale: Math.min(3, Math.max(0.5, parseFloat(q.get('scale')) || 1)), ui: q.get('ui') !== '0',
    hidden: HIDDEN, boardLayout: BOARD_LAYOUT,
    hides: function(wid){ return classin && HIDDEN.indexOf(wid) !== -1; },
    presetFor: function(wid){ return (classin && widget === wid && PRESETS[wid]) ? PRESETS[wid](q) : null; },
    _parse: function(search){ var qq = new URLSearchParams(search); return widget && PRESETS[widget] ? PRESETS[widget](qq) : null; }   // for tests
  };
  var h = document.documentElement;
  if(classin) h.classList.add('ed-classin');
  if(E.single) h.classList.add('board-single');
  if(!E.ui) h.classList.add('board-ui-off');
})();
