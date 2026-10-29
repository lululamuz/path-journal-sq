/* =====================================================================
   02 — SENSORY EXPERIENCE : sound → particles

   Real audio analysis with the Web Audio API:
   <audio> → MediaElementSource → Analyser → Gain → speakers
   (analyser sits before the gain, so muting doesn't change the visual)

   Features read every frame:
   - rms   : loudness (root-mean-square of the waveform)
   - low   : energy 20–250 Hz     (rumble, trains, wind)
   - mid   : energy 250–2000 Hz   (voices, footsteps)
   - high  : energy 2000–8000 Hz  (brakes, beeps, hiss)
   - onset : sudden jump in loudness above its recent average
   These are amplitude / spectral-energy measures, not musical pitch.

   No signal → every force is zero → the particles settle and stay still.
   There is no random "fake" animation.
   ===================================================================== */
window.Sensory = (function () {
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SILENCE = { rms: 0, low: 0, mid: 0, high: 0, onset: 0 };

  var canvas = document.getElementById('particles');
  var ctx = canvas.getContext('2d');
  var audio = document.getElementById('audio');
  var playBtn = document.getElementById('play');
  var replayBtn = document.getElementById('replay');
  var muteBtn = document.getElementById('mute');
  var volumeInput = document.getElementById('volume');
  var fileInput = document.getElementById('file');
  var copyEl = document.getElementById('sensory-copy');
  var note = document.getElementById('dev-note');
  var noteTitle = document.getElementById('dev-note-title');
  var noteText = document.getElementById('dev-note-text');

  var engine = null;      // created on first Play (browsers require a click)
  var muted = false;
  var volume = 0.8;
  var raf = 0;
  var running = false;
  var objectUrl = null;
  var zeroFrames = 0;     // to detect a browser blocking the analysis

  /* ------------------------------------------------------------------
     Audio analysis
     ------------------------------------------------------------------ */
  var BANDS = { low: [20, 250], mid: [250, 2000], high: [2000, 8000] };

  function createEngine() {
    var Ctx = window.AudioContext || window.webkitAudioContext;
    var ac = new Ctx();
    var source = ac.createMediaElementSource(audio);
    var analyser = ac.createAnalyser();
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.75;
    var gain = ac.createGain();
    source.connect(analyser);
    analyser.connect(gain);
    gain.connect(ac.destination);

    var freq = new Uint8Array(analyser.frequencyBinCount);
    var wave = new Float32Array(analyser.fftSize);
    var binHz = ac.sampleRate / analyser.fftSize;
    var ranges = {};
    Object.keys(BANDS).forEach(function (k) {
      ranges[k] = [
        Math.max(1, Math.floor(BANDS[k][0] / binHz)),
        Math.min(freq.length - 1, Math.ceil(BANDS[k][1] / binHz))
      ];
    });

    var avgRms = 0, onset = 0;

    function band(k) {
      var a = ranges[k][0], b = ranges[k][1], s = 0;
      for (var i = a; i <= b; i++) s += freq[i];
      return s / ((b - a + 1) * 255);
    }

    return {
      ac: ac,
      read: function () {
        analyser.getByteFrequencyData(freq);
        analyser.getFloatTimeDomainData(wave);
        var sum = 0;
        for (var i = 0; i < wave.length; i++) sum += wave[i] * wave[i];
        var rms = Math.sqrt(sum / wave.length);
        if (rms > avgRms * 1.6 && rms > 0.02) onset = Math.min(1, (rms - avgRms) * 12);
        else onset *= 0.85;
        avgRms = avgRms * 0.95 + rms * 0.05;
        return { rms: rms, low: band('low'), mid: band('mid'), high: band('high'), onset: onset };
      },
      setVolume: function (v) { gain.gain.setTargetAtTime(v, ac.currentTime, 0.02); }
    };
  }

  /* ------------------------------------------------------------------
     Particle field
     Each dot is tied to a home position by a spring.
     LOW → larger dots, slow vertical swells
     MID → medium dots, gentle floating drift
     HIGH → tiny dots, fast fine vibration
     RMS → brightness · ONSET → upward jump
     ------------------------------------------------------------------ */
  var GROUPS = [
    { share: 0.25, size: 1.5, spring: 0.012, damp: 0.9 },
    { share: 0.4, size: 1.0, spring: 0.02, damp: 0.88 },
    { share: 0.35, size: 0.65, spring: 0.05, damp: 0.8 }
  ];
  var particles = [], W = 0, H = 0;

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    if (!W || !H) return;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var count = Math.round(Math.min(2200, Math.max(500, (W * H) / 1100)));
    particles = [];
    for (var i = 0; i < count; i++) {
      var r = Math.random();
      var g = r < GROUPS[0].share ? 0 : r < GROUPS[0].share + GROUPS[1].share ? 1 : 2;
      var x = Math.random() * W, y = Math.random() * H;
      particles.push({ g: g, hx: x, hy: y, x: x, y: y, vx: 0, vy: 0, phase: Math.random() * Math.PI * 2 });
    }
  }

  function step(f, t) {
    var strength = reduced ? 0.35 : 1;
    var energy = [f.low, f.mid, f.high];
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i], G = GROUPS[p.g], e = energy[p.g] * strength;
      var ax = (p.hx - p.x) * G.spring;
      var ay = (p.hy - p.y) * G.spring;
      if (p.g === 0) {
        ay += -Math.sin(t * 0.9 + p.hx * 0.006 + p.phase * 0.3) * e * 0.9;
      } else if (p.g === 1) {
        ax += Math.cos(t * 0.7 + p.phase) * e * 0.5;
        ay += Math.sin(t * 0.9 + p.phase * 1.3) * e * 0.5;
      } else {
        ax += (Math.random() - 0.5) * e * 3.2;
        ay += (Math.random() - 0.5) * e * 3.2;
      }
      if (f.onset > 0.05) ay -= f.onset * strength * (0.6 + Math.random() * 1.4);
      p.vx = (p.vx + ax) * G.damp;
      p.vy = (p.vy + ay) * G.damp;
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < -20) p.y = H + 10;
      if (p.y > H + 20) p.y = -10;
    }
  }

  function draw(f) {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);
    var energy = [f.low, f.mid, f.high];
    for (var g = 0; g < 3; g++) {
      var alpha = Math.min(1, 0.22 + energy[g] * 0.75 + f.rms * 1.2);
      var size = GROUPS[g].size * (1 + energy[g] * 0.6);
      ctx.fillStyle = 'rgba(255,255,255,' + alpha.toFixed(3) + ')';
      ctx.beginPath();
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        if (p.g !== g) continue;
        ctx.moveTo(p.x + size, p.y);
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
      }
      ctx.fill();
    }
  }

  var start = performance.now(), frame = 0;
  function loop() {
    var live = engine && !audio.paused;
    var f = live ? engine.read() : SILENCE;

    // A playing file that reads as perfect digital silence for ~1.5 s usually
    // means the browser blocked analysis (common when opened by double-click).
    if (live && f.rms === 0 && audio.currentTime > 0.3) {
      if (++zeroFrames > 90) blockedByBrowser();
    } else zeroFrames = 0;

    // When the recording suddenly gets louder, ask the visitor a question.
    if (live && f.onset > 0.45 && performance.now() - lastPrompt > 7000) showPrompt();

    step(f, (performance.now() - start) / 1000);
    draw(f);
    raf = requestAnimationFrame(loop);
  }

  /* ------------------------------------------------------------------
     Prompts on sudden sounds (text from AUDIO.prompts in content.js)
     ------------------------------------------------------------------ */
  var promptEl = document.getElementById('prompt');
  var lastPrompt = -1e9, promptIndex = 0, promptTimer = 0;
  function showPrompt() {
    lastPrompt = performance.now();
    promptEl.textContent = AUDIO.prompts[promptIndex++ % AUDIO.prompts.length];
    promptEl.classList.add('is-on');
    clearTimeout(promptTimer);
    promptTimer = setTimeout(function () { promptEl.classList.remove('is-on'); }, 3200);
  }

  /* ------------------------------------------------------------------
     Status messages
     ------------------------------------------------------------------ */
  function showNote(title, html) {
    noteTitle.textContent = title;
    noteText.innerHTML = html;
    note.hidden = false;
  }

  function blockedByBrowser() {
    audio.pause();
    zeroFrames = 0;
    showNote(
      'Choose the recording',
      'Because this page was opened directly from your computer, the browser won\'t let it analyze ' +
      'the audio automatically. Click <b>Load audio file</b> and pick <code>' + AUDIO.src +
      '</code> from the project folder. (Online, or with VS Code Live Server, this step isn\'t needed.)'
    );
  }

  function setEnabled(on) {
    [playBtn, replayBtn, muteBtn, volumeInput].forEach(function (el) { el.disabled = !on; });
  }

  /* ------------------------------------------------------------------
     Controls
     ------------------------------------------------------------------ */
  function play() {
    if (!engine) {
      engine = createEngine();
      engine.setVolume(muted ? 0 : volume);
    }
    var go = function () {
      audio.play().catch(function () {
        showNote('Could not play', 'The browser could not play this file. Try an mp3 or wav.');
      });
    };
    if (engine.ac.state === 'suspended') engine.ac.resume().then(go); else go();
  }

  playBtn.addEventListener('click', function () {
    if (!audio.paused) audio.pause(); else play();
  });
  replayBtn.addEventListener('click', function () { audio.currentTime = 0; play(); });
  muteBtn.addEventListener('click', function () {
    muted = !muted;
    muteBtn.textContent = muted ? 'Unmute' : 'Mute';
    muteBtn.setAttribute('aria-pressed', muted);
    volumeInput.value = muted ? 0 : volume;
    if (engine) engine.setVolume(muted ? 0 : volume);
  });
  volumeInput.addEventListener('input', function () {
    volume = Number(volumeInput.value);
    if (volume > 0 && muted) { muted = false; muteBtn.textContent = 'Mute'; }
    if (engine) engine.setVolume(volume);
  });

  // Load a recording from the computer (also works when opened by double-click)
  fileInput.addEventListener('change', function () {
    var file = fileInput.files && fileInput.files[0];
    if (!file) return;
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    objectUrl = URL.createObjectURL(file);
    audio.src = objectUrl;
    note.hidden = true;
  });

  audio.addEventListener('canplay', function () { setEnabled(true); });
  audio.addEventListener('error', function () {
    setEnabled(false);
    showNote(
      'Development placeholder',
      'No recording found at <code>' + AUDIO.src + '</code>. Add your field recording there, ' +
      'or click <b>Load audio file</b>. The particles stay still until a real signal is playing.'
    );
  });
  audio.addEventListener('play', function () {
    playBtn.textContent = 'Pause';
    playBtn.classList.remove('ctl--main');
    copyEl.classList.add('is-quiet');
    document.getElementById('factors').classList.add('is-quiet');
  });
  audio.addEventListener('pause', function () {
    playBtn.textContent = audio.ended ? 'Play again' : 'Play';
    playBtn.classList.add('ctl--main');
    copyEl.classList.remove('is-quiet');
    document.getElementById('factors').classList.remove('is-quiet');
  });
  audio.addEventListener('ended', function () { playBtn.textContent = 'Play again'; });

  audio.src = AUDIO.src;
  window.addEventListener('resize', function () { if (running) resize(); });

  return {
    enter: function () {
      running = true;
      resize();
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(loop);
    },
    leave: function () {
      running = false;
      audio.pause();
      cancelAnimationFrame(raf);
      promptEl.classList.remove('is-on');
    }
  };
})();
