/* =====================================================================
   01 — MOVEMENT : photographic route
   Photos and captions come from PHOTOS in content.js.
   ===================================================================== */
window.Movement = (function () {
  var index = 0;
  var active = false;
  var total = PHOTOS.length;

  var framesEl = document.getElementById('frames');
  var captionEl = document.getElementById('caption');
  var prevBtn = document.getElementById('prev');
  var nextBtn = document.getElementById('next');

  function pad(n) { return String(n).padStart(2, '0'); }

  function placeholder(p) {
    return (
      '<div class="frame__placeholder" role="img" aria-label="' + p.alt + '">' +
        '<span class="mono">Photograph not yet added</span>' +
        '<code>' + p.src + '</code>' +
        '<span class="frame__placeholder-label">' + p.label + '</span>' +
      '</div>'
    );
  }

  // Build one <figure> per photograph
  PHOTOS.forEach(function (p, i) {
    var fig = document.createElement('figure');
    fig.className = 'frame is-future';
    fig.innerHTML =
      '<div class="frame__backdrop" style="background-image:url(\'' + p.src + '\')" aria-hidden="true"></div>' +
      '<img class="frame__img" src="' + p.src + '" alt="' + p.alt + '" />';
    // If the file is missing, swap in a labeled placeholder
    fig.querySelector('img').addEventListener('error', function () {
      fig.innerHTML = placeholder(p);
    });
    framesEl.appendChild(fig);
  });

  var progressEl = document.getElementById('progress');
  progressEl.innerHTML = PHOTOS.map(function () { return '<span></span>'; }).join('');

  function render(dir) {
    framesEl.style.setProperty('--dir', dir || 1);
    Array.prototype.forEach.call(framesEl.children, function (fig, i) {
      fig.className = 'frame ' + (i === index ? 'is-current' : i < index ? 'is-past' : 'is-future');
      fig.setAttribute('aria-hidden', i !== index);
    });

    var p = PHOTOS[index];
    document.getElementById('cap-label').innerHTML = p.label + (p.focus ? '<span class="focus">' + p.focus + '</span>' : '');
    document.getElementById('cap-title').textContent = p.title;
    document.getElementById('cap-text').textContent = p.caption;
    var cr = document.getElementById('cap-credit');
    cr.textContent = p.credit || '';
    cr.hidden = !p.credit;
    // restart caption fade-in
    captionEl.style.animation = 'none';
    void captionEl.offsetWidth;
    captionEl.style.animation = '';

    document.getElementById('counter').innerHTML =
      pad(index + 1) + ' <span class="counter__sep">/</span> ' + pad(total);
    Array.prototype.forEach.call(progressEl.children, function (s, i) {
      s.classList.toggle('is-on', i <= index);
    });

    prevBtn.disabled = index === 0;
    var last = index === total - 1;
    nextBtn.classList.toggle('arrow--onward', last);
    nextBtn.innerHTML = last ? '<span class="arrow__onward">Listen&nbsp;→</span>' : '→';
    nextBtn.setAttribute('aria-label', last ? 'Continue to Sensory Experience' : 'Next photograph');
  }

  function next() {
    if (index === total - 1) return window.goTo('sensory');
    index++;
    render(1);
  }
  function prev() {
    if (index === 0) return;
    index--;
    render(-1);
  }

  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);
  document.addEventListener('keydown', function (e) {
    if (!active) return;
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  });

  render(1);

  return {
    enter: function () { active = true; },
    leave: function () { active = false; }
  };
})();
