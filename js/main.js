/* =====================================================================
   main.js — fills in text, and moves between scenes
   (fade to black → swap section → fade back in)
   ===================================================================== */
(function () {
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var current = 'intro';
  var busy = false;

  var veil = document.getElementById('veil');
  var nav = document.querySelector('.nav');

  /* ---------- fill text from content.js ---------- */
  document.querySelectorAll('[data-text]').forEach(function (el) {
    el.textContent = SITE[el.dataset.text];
  });
  document.querySelectorAll('[data-audio]').forEach(function (el) {
    el.textContent = AUDIO[el.dataset.audio];
  });
  document.querySelectorAll('[data-closing]').forEach(function (el) {
    el.textContent = CLOSING[el.dataset.closing];
  });

  document.getElementById('history').innerHTML = SITE.history
    .map(function (h) { return '<li><span class="mono">' + h.year + '</span>' + h.text + '</li>'; })
    .join('');

  document.getElementById('movement-note').textContent = MOVEMENT.note;

  document.getElementById('factor-list').innerHTML = AUDIO.factors
    .map(function (f) {
      return '<li><span class="factor">' + f.factor + '</span><span class="response">' + f.response + '</span></li>';
    }).join('');


  document.getElementById('conclusion').innerHTML = CLOSING.conclusion
    .map(function (t) { return '<p>' + t + '</p>'; }).join('');

  document.getElementById('credits').innerHTML = '<span>' + SITE.author + '</span>';

  /* ---------- scene switching ---------- */
  var hooks = {
    movement: window.Movement,
    sensory: window.Sensory,
    systems: window.Systems
  };

  function show(name) {
    document.querySelectorAll('.scene').forEach(function (s) {
      s.hidden = s.id !== name;
    });
    nav.hidden = name === 'intro';
    document.body.dataset.scene = name;
    document.querySelectorAll('.nav__item').forEach(function (b) {
      var on = b.dataset.go === name;
      b.classList.toggle('is-active', on);
      if (on) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
    });
    window.scrollTo(0, 0);
  }

  function goTo(name) {
    if (busy || name === current) return;
    busy = true;
    veil.classList.add('veil--on');
    setTimeout(function () {
      if (hooks[current] && hooks[current].leave) hooks[current].leave();
      current = name;
      show(name);
      if (hooks[name] && hooks[name].enter) hooks[name].enter();
      setTimeout(function () {
        veil.classList.remove('veil--on');
        busy = false;
      }, reduced ? 60 : 250);
    }, reduced ? 120 : 900);
  }

  window.goTo = goTo;

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-go]');
    if (btn) goTo(btn.dataset.go);
  });

  show('intro');
  document.querySelector('.intro .btn--primary').focus();
})();
