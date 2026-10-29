# Designed to Move

An interactive exploration of Journal Square PATH Station, Jersey City.
City as Systems, Parsons. Final project.

Plain HTML + CSS + JavaScript. No installation and no build step.

## How to open it

Double-click `index.html`. It opens in your browser.

(For the best result, especially in the sound section, see "Audio note" below.)

## Folder structure

```
index.html          ← page structure (all sections)
css/style.css       ← all styling (colors & fonts at the top, in :root)
js/content.js       ← ALL text, photo list, audio path, systems map  ← edit this
js/movement.js      ← 01 photo sequence
js/sensory.js       ← 02 audio analysis + particles
js/systems.js       ← 03 interactive network
js/main.js          ← moving between sections
images/             ← your photographs go here
audio/              ← your recording goes here
```

## Add your photographs

Put them in `images/` with these names:

```
images/01-entrance.jpg
images/02-circulation.jpg
images/03-fare-gates.jpg
images/04-escalators.jpg
images/05-platform.jpg
images/06-train.jpg
```

You can use other names, a different number of photos, or a different order. Change the `PHOTOS` list in `js/content.js` to match. Until a photo is added, the page shows a labeled placeholder.

## Add your audio

Put the recording at `audio/jsq-station.mp3`. To use a different name or format (wav, m4a), change `AUDIO.src` in `js/content.js`.

### Audio note

Browsers don't let a page *analyze* a sound file when the page was opened by double-clicking. This is a security rule. If that happens, the page tells you, and you can click **Load audio file** and pick the recording from the `audio` folder. After that, everything works.

To skip that step entirely, open the site in either of these ways:

- **VS Code + Live Server:** right-click `index.html` and choose "Open with Live Server".
- **Online:** see "Put it online" below.

## How sound becomes motion

- Web Audio API: `<audio>` → AnalyserNode (FFT 2048) → speakers
- **Loudness (RMS)** sets overall brightness and intensity.
- **Low band, 20–250 Hz** (trains, rumble, wind): larger dots move in slow vertical swells.
- **Mid band, 250–2000 Hz** (voices, footsteps): medium dots drift and float.
- **High band, 2–8 kHz** (brakes, beeps): the smallest dots vibrate quickly.
- **Sudden loud events (onsets)**: the whole field jumps.
- **No signal**: the dots settle and stay still. There is no random fake animation.
- The live numbers at the bottom right are what the analyser is actually reading.

## Put it online

- **Netlify Drop (easiest):** go to https://app.netlify.com/drop and drag this whole folder onto the page.
- **GitHub Pages:** upload the folder to a repo, then go to Settings → Pages → Deploy from branch.

## Keyboard

- ← / → move through the photos.
- Tab / Enter select items in the systems map.
- Esc clears the selection.
