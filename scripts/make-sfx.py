#!/usr/bin/env python3
"""Builds public/audio/sfx.wav: a sparse, gentle sound-effects bed locked to the scene
timeline (same scene starts as src/doc/timing.ts). Fully synthesized, so no licensing.
Usage: python3 scripts/make-sfx.py   (run from the project root)"""
import json, re, math, wave
import numpy as np
from scipy.signal import butter, sosfilt

SR = 48000
FPS = 30
root = __file__.rsplit('/scripts/', 1)[0] if '/scripts/' in __file__ else '.'
DUR = json.load(open(f'{root}/src/audio-info.json'))['seconds']
caps = json.load(open(f'{root}/src/captions.json'))
timing = open(f'{root}/src/doc/timing.ts').read()
scenes = [(m[0], int(m[1]), int(m[2])) for m in re.findall(r"\{id: '(\w+)', a: (\d+), ch: (\d+)\}", timing)]
starts = [0.0 if i == 0 else round(caps[a]['start'] * FPS) / FPS for i, (_, a, _) in enumerate(scenes)]
DARK = {'stat', 'cta1', 'outro'}

rng = np.random.default_rng(7)
out = np.zeros(int(SR * (DUR + 2)), dtype=np.float64)

def put(sig, t, gain=1.0):
    i = int(t * SR)
    if i < 0: sig = sig[-i:]; i = 0
    j = min(len(out), i + len(sig))
    out[i:j] += sig[:j - i] * gain

def env(n, a, r):
    e = np.ones(n); na, nr = int(a * SR), int(r * SR)
    e[:na] = np.linspace(0, 1, na) ** 2
    e[-nr:] = np.linspace(1, 0, nr) ** 2
    return e

def whoosh(dur=0.7, lo=300, hi=2600):
    n = int(SR * dur); x = rng.standard_normal(n)
    # sweeping band-pass built from overlapping fixed bands, smooth and airy
    y = np.zeros(n); k = 6
    for b in range(k):
        c = lo * (hi / lo) ** (b / (k - 1))
        sos = butter(2, [c * 0.7, c * 1.3], 'band', fs=SR, output='sos')
        band = sosfilt(sos, x)
        centre = (b + 0.5) / k * n
        w = np.exp(-0.5 * ((np.arange(n) - centre) / (n * 0.18)) ** 2)
        y += band * w
    y *= env(n, 0.18, 0.4)
    return y / (np.max(np.abs(y)) + 1e-9)

def thock(f0=110, dur=0.35):
    n = int(SR * dur); t = np.arange(n) / SR
    y = np.sin(2 * math.pi * (f0 + 60 * np.exp(-t * 30)) * t) * np.exp(-t * 11)
    return y

def chime(f=880, dur=1.6):
    n = int(SR * dur); t = np.arange(n) / SR
    y = sum(a * np.sin(2 * math.pi * f * m * t) * np.exp(-t * d) for m, a, d in [(1, 1, 2.2), (2.01, 0.35, 3.2), (3.02, 0.15, 4.5)])
    return y / np.max(np.abs(y))

def pop(f=520, dur=0.14):
    n = int(SR * dur); t = np.arange(n) / SR
    return np.sin(2 * math.pi * f * (1 + 0.5 * np.exp(-t * 40)) * t) * np.exp(-t * 28)

prev_ch = -1
for i, (sid, a, ch) in enumerate(scenes):
    t0 = starts[i]
    if i > 0:
        put(whoosh(), t0 - 0.12, 0.10 if sid not in DARK else 0.12)       # transition wipe
    if ch != prev_ch:
        put(thock(), t0 + 0.12, 0.16)                                       # chapter marker
        put(chime(660 + 40 * ch, 1.4), t0 + 0.14, 0.035)
        prev_ch = ch
    if sid in DARK:
        put(thock(70, 0.9), t0 + 0.1, 0.12)                                 # low weight for dark scenes
    # soft pops on the first lines of each scene: one every few caption cues
    nxt = scenes[i + 1][1] if i + 1 < len(scenes) else len(caps)
    for k in range(a + 1, nxt, 3):
        put(pop(480 + 40 * ((k * 7) % 5)), caps[k]['start'] + 0.02, 0.035)
put(chime(523, 2.4), DUR - 3.2, 0.06)                                      # sign-off

out = np.tanh(out * 1.2) / np.tanh(1.2)
peak = np.max(np.abs(out)); out = out / peak * 0.5                          # peak -6 dBFS; mixed under the voice
n = int(SR * DUR)
pcm = (out[:n] * 32767).astype('<i2')
stereo = np.repeat(pcm[:, None], 2, axis=1)
with wave.open(f'{root}/public/audio/sfx.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(stereo.tobytes())
print('scenes', len(scenes), 'dur', n / SR, 'peak', peak)
