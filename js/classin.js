/* TeachersDeck — ClassIn board layer (port round 1, build classin.1). Loaded AFTER app.js. Inert unless the ClassIn edition is on (see js/edition.js).
   1. Board mode: a link with ?w=<widget> opens that widget alone, scaled to fill ClassIn's browser window (which the teacher resizes on the blackboard).
   2. A small toolbar: bigger / smaller, full screen, test sound, all widgets.
   3. Sound: the timer had none, and remote students can only hear a page if the teacher turns on ClassIn's "Share audio". So when a timer ends it plays a chime AND
      flashes a full-window "Time's up!" (visible whatever the audio does); a one-time hint reminds the teacher about Share audio, with a Test sound button.
   4. Microphone: ClassIn is already using the mic for the lesson, so a second use may be refused — the Noise Meter says what to do instead of just failing.
   The pieces app.js calls (TD_BOARD.timerDone / audioHint / micHelp) are no-ops outside the ClassIn edition. */
(function(){
  'use strict';
  var E = window.TD_EDITION; if(!E || !E.classin) { window.TD_BOARD = { timerDone:function(){}, audioHint:function(){}, micHelp:function(){ return false; } }; return; }
  var S = (typeof STRINGS !== 'undefined') ? STRINGS : {};   // STRINGS is a top-level const in app.js, so it is NOT window.STRINGS
  Object.assign(S, {
    board_bigger:  { en:'Bigger', vi:'Lớn hơn' }, board_smaller: { en:'Smaller', vi:'Nhỏ hơn' },
    board_full:    { en:'Full screen', vi:'Toàn màn hình' }, board_full_fail: { en:'This browser didn’t allow full screen. Use ClassIn’s own full-screen button.', vi:'Trình duyệt này không cho phép toàn màn hình. Hãy dùng nút toàn màn hình của ClassIn.' },
    board_sound:   { en:'Test sound', vi:'Thử âm thanh' }, board_all: { en:'All widgets', vi:'Tất cả widget' },
    board_missing: { en:'This link opens “{id}”, which isn’t part of the ClassIn edition.', vi:'Liên kết này mở “{id}”, không có trong phiên bản ClassIn.' },
    board_hint:    { en:'🔊 Turn on “Share audio” in ClassIn’s browser so students can hear the chime.', vi:'🔊 Hãy bật “Chia sẻ âm thanh” trong trình duyệt ClassIn để học sinh nghe được tiếng chuông.' },
    board_gotit:   { en:'Got it', vi:'Đã hiểu' },
    board_tap:     { en:'Tap anywhere once to switch sound on.', vi:'Chạm vào bất kỳ đâu một lần để bật âm thanh.' },
    board_sound_ok:{ en:'Sound played. If students heard nothing, switch on “Share audio” in ClassIn’s browser.', vi:'Đã phát âm thanh. Nếu học sinh không nghe thấy, hãy bật “Chia sẻ âm thanh” trong trình duyệt ClassIn.' },
    board_mic:     { en:'The microphone is busy or blocked — ClassIn is probably using it for the lesson. Allow this page to use it when asked, or use the Traffic Light by hand instead.', vi:'Micro đang bận hoặc bị chặn — có thể ClassIn đang dùng cho buổi học. Hãy cho phép trang này dùng micro khi được hỏi, hoặc dùng Đèn giao thông thủ công.' },
    board_retry:   { en:'Try again', vi:'Thử lại' }
  });
  var tx = function(k, v){ try{ return t(k, v); }catch(e){ var s = S[k] || {}; return (s.en || k).replace(/\{(\w+)\}/g, function(_, a){ return v && v[a] != null ? v[a] : ''; }); } };

  /* ---------- sound ---------- */
  var ac = null;
  function ctx(){ if(!ac){ try{ ac = new (window.AudioContext || window.webkitAudioContext)(); }catch(e){} } return ac; }
  function unlock(){ var a = ctx(); if(a && a.state === 'suspended') try{ a.resume(); }catch(e){} }
  ['pointerdown', 'keydown', 'touchstart'].forEach(function(ev){ document.addEventListener(ev, unlock, { passive:true }); });
  function tone(a, f, t0, dur, vol){ var o = a.createOscillator(), g = a.createGain(); o.type = 'sine'; o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, t0); g.gain.linearRampToValueAtTime(vol, t0 + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(a.destination); o.start(t0); o.stop(t0 + dur + 0.05); }
  function chime(){                                    // returns the AudioContext state: 'running' = it was allowed to play
    var a = ctx(); if(!a) return 'unsupported'; if(a.state === 'suspended') try{ a.resume(); }catch(e){}
    var n = a.currentTime + 0.02; [880, 1109, 1319, 1760].forEach(function(f, i){ tone(a, f, n + i * 0.26, 0.55, 0.35); }); return a.state;
  }
  function testSound(){ var st = chime(); toast(st === 'running' ? tx('board_sound_ok') : tx('board_tap'), 5200); }

  /* ---------- the "time's up" cue ---------- */
  function cue(){
    var old = document.getElementById('board-cue'); if(old) old.remove();
    var el = document.createElement('div'); el.id = 'board-cue'; el.setAttribute('role', 'alert');
    var up = S.time_up || {}; el.innerHTML = '<b></b><span></span><small></small>';
    el.querySelector('b').textContent = '⏰ ' + (up.en || 'Time!'); el.querySelector('span').textContent = up.vi || ''; el.querySelector('small').textContent = '— click to dismiss / nhấn để tắt —';
    var close = function(){ el.remove(); document.removeEventListener('keydown', close, true); };
    el.addEventListener('click', close); document.addEventListener('keydown', close, true); document.body.appendChild(el); setTimeout(close, 12000);
  }
  function timerDone(){ var st = chime(); cue(); if(st !== 'running') toast(tx('board_tap'), 4200); }

  /* ---------- the share-audio reminder (once; dismissal is remembered) ---------- */
  function audioHint(){                                // a slim strip: shown at most 3 times, 15 s each, unless "Got it" is pressed
    var K = 'td_audiohint_v1', n = 0; try{ var v = localStorage.getItem(K); if(v === '1') return; n = parseInt(v, 10) || 0; if(n >= 3) return; localStorage.setItem(K, String(n + 1)); }catch(e){}
    if(document.getElementById('board-hint')) return;
    var el = document.createElement('div'); el.id = 'board-hint'; el.setAttribute('role', 'status');
    var tn = document.createElement('span'); tn.textContent = tx('board_hint');
    var b1 = document.createElement('button'); b1.type = 'button'; b1.textContent = tx('board_sound'); b1.addEventListener('click', testSound);
    var b2 = document.createElement('button'); b2.type = 'button'; b2.className = 'go'; b2.textContent = tx('board_gotit');
    b2.addEventListener('click', function(){ try{ localStorage.setItem(K, '1'); }catch(e){} el.remove(); });
    el.appendChild(tn); el.appendChild(b1); el.appendChild(b2); document.body.appendChild(el); setTimeout(function(){ if(el.parentNode) el.remove(); }, 15000);
  }

  /* ---------- the microphone may already be in use by ClassIn ---------- */
  function micHelp(msgEl, retry){
    if(!msgEl) return false;
    msgEl.innerHTML = ''; var p = document.createElement('div'); p.textContent = tx('board_mic');
    var b = document.createElement('button'); b.type = 'button'; b.className = 'wbtn'; b.style.marginTop = '8px'; b.textContent = tx('board_retry'); b.addEventListener('click', function(){ if(retry) retry(); });
    msgEl.appendChild(p); msgEl.appendChild(b); return true;
  }
  window.TD_BOARD = { timerDone: timerDone, audioHint: audioHint, micHelp: micHelp, chime: chime, testSound: testSound };

  /* ---------- board mode: one widget fills the window ---------- */
  if(!E.single) return;
  var SZ = 'td_board_scale', user = 1; try{ user = parseFloat(localStorage.getItem(SZ)) || 1; }catch(e){}
  var NAT = { clock:{ w:230, h:250 }, timer:{ w:260, h:230 }, stopwatch:{ w:240, h:290 }, traffic:{ w:200, h:270 }, scoreboard:{ w:300, h:460 }, noise:{ w:320, h:560 }, countdown:{ w:260, h:230 } };   // size the widget is laid out at before it is scaled up
  var id = E.widget, el = null;
  var def = WIDGETS.filter(function(w){ return w.id === id; })[0];
  if(!def || E.hides(id)){ var m = document.createElement('div'); m.className = 'board-missing'; m.textContent = tx('board_missing', { id: id }); document.body.appendChild(m); return; }
  Object.keys(widgetEls).slice().forEach(function(k){ closeWidget(k); });
  openWidget(id); var rec = widgetEls[id]; if(!rec) return; el = rec.el; el.classList.add('widget-board');
  var MEASURE = { clock:1, timer:1, stopwatch:1, traffic:1, countdown:1, scoreboard:1 };   // simple widgets: use their real content height (no dead space; a scoreboard grows with 2-8 teams)
  function natural(){
    var n = NAT[id] || { w:def.w, h:def.h };
    if(MEASURE[id]){ el.style.transform = 'none'; el.style.width = n.w + 'px'; el.style.height = 'auto'; var mh = el.offsetHeight; if(mh > 40) return { w:n.w, h:mh }; }
    return n;
  }
  function fit(){
    var vw = window.innerWidth, vh = window.innerHeight, k = E.scale * user, mode = E.boardLayout[id] || 'scale', w, h, s;
    if(mode === 'fill'){ w = Math.round(vw * 0.96 / k); h = Math.round(vh * 0.96 / k); s = k; }
    else { var n = natural(); w = n.w; h = n.h; s = Math.min(vw / w, vh / h) * 0.92 * k; }
    el.style.width = w + 'px'; el.style.height = h + 'px'; el.style.transform = 'translate(-50%,-50%) scale(' + s.toFixed(4) + ')';
  }
  fit(); window.addEventListener('resize', fit); if(window.ResizeObserver) new ResizeObserver(fit).observe(document.documentElement);

  /* toolbar */
  var bar = document.createElement('div'); bar.id = 'board-bar'; bar.setAttribute('role', 'toolbar');
  function btn(label, title, fn){ var b = document.createElement('button'); b.type = 'button'; b.textContent = label; b.title = title; b.setAttribute('aria-label', title); b.addEventListener('click', fn); bar.appendChild(b); return b; }
  function setUser(v){ user = Math.min(1.6, Math.max(0.6, Math.round(v * 10) / 10)); try{ localStorage.setItem(SZ, String(user)); }catch(e){} fit(); }
  btn('A−', tx('board_smaller'), function(){ setUser(user - 0.1); }); btn('A+', tx('board_bigger'), function(){ setUser(user + 0.1); });
  btn('⛶', tx('board_full'), function(){ var d = document, r = d.fullscreenElement ? d.exitFullscreen() : d.documentElement.requestFullscreen(); if(r && r.catch) r.catch(function(){ toast(tx('board_full_fail'), 5200); }); });
  btn('🔊', tx('board_sound'), testSound);
  btn('☰', tx('board_all'), function(){ location.href = location.pathname + '?edition=classin'; });
  document.body.appendChild(bar);
  var idle = 0; function wake(){ bar.classList.remove('idle'); clearTimeout(idle); idle = setTimeout(function(){ bar.classList.add('idle'); }, 3500); }
  ['pointermove', 'pointerdown', 'touchstart', 'keydown'].forEach(function(ev){ document.addEventListener(ev, wake, { passive:true }); }); wake();
})();
