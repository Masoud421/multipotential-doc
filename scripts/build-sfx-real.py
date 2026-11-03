#!/usr/bin/env python3
"""Builds public/audio/sfx.wav from the REAL clips in public/audio/clips_src (supplied whooshes/page/riser + the generated
sound pack), placed on the narration timeline (src/captions.json + scene starts from src/doc/timing.ts).
Run from the project root: python3 scripts/build-sfx-real.py"""
import json, re, subprocess, wave, os
import numpy as np

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR, FPS = 48000, 30
caps = json.load(open(f'{root}/src/captions.json'))
DUR = json.load(open(f'{root}/src/audio-info.json'))['seconds']
timing = open(f'{root}/src/doc/timing.ts').read()
scenes = [(m[0], int(m[1]), int(m[2])) for m in re.findall(r"\{id: '(\w+)', a: (\d+), ch: (\d+)\}", timing)]
start = lambda i: caps[i]['start']
sstart = [0.0 if i == 0 else round(start(a) * FPS) / FPS for i, (_, a, _) in enumerate(scenes)]

cache = {}
def clip(name):
    if name in cache: return cache[name]
    src = next(f'{root}/public/audio/clips_src/{name}{e}' for e in ('.wav', '.mp3') if os.path.exists(f'{root}/public/audio/clips_src/{name}{e}'))
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', src, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], check=True, stdout=subprocess.PIPE).stdout
    x = np.frombuffer(raw, dtype=np.float32).astype(np.float64)
    x /= (np.max(np.abs(x)) + 1e-9)            # every clip peak = 1.0, gains below set the mix
    n = int(0.004 * SR); x[:n] *= np.linspace(0, 1, n); x[-n:] *= np.linspace(1, 0, n)  # no clicks
    cache[name] = x
    return x

def peak_off(x):                              # seconds from clip start to its loudest moment
    env = np.convolve(np.abs(x), np.ones(int(0.02 * SR)) / int(0.02 * SR), mode='same')
    return float(np.argmax(env)) / SR

out = np.zeros(int(SR * (DUR + 4)))
def put(name, t, gain, align_peak=False):
    x = clip(name)
    if align_peak: t = t - peak_off(x)
    i = int(round(t * SR))
    if i < 0: x = x[-i:]; i = 0
    j = min(len(out), i + len(x)); out[i:j] += x[:j - i] * gain

# ---- scene transitions: whoosh peak lands just after the wipe starts
SHORT = ['whoosh_fast', 'whoosh_short']; LONG = ['whoosh_mid', 'whoosh_long']
prev_ch = -1; k = 0
for i, (sid, a, ch) in enumerate(scenes):
    t0 = sstart[i]
    if i > 0:
        if ch != prev_ch: put(LONG[k % 2], t0 + 0.30, 0.20, True)
        else: put(SHORT[k % 2], t0 + 0.22, 0.16, True)
        k += 1
    if ch != prev_ch and i > 0:
        put('riser_impact', t0 + 0.05 + 0.0, 0.14, True) if False else None
        # riser ends with an impact: end the clip (4.03 s) at the chapter start
        x = clip('riser_impact'); put('riser_impact', t0 + 0.12 - len(x) / SR, 0.13)
        put('soft_bass_1', t0 + 0.12, 0.25)
    prev_ch = ch

# ---- moments tied to what is said / shown (cue index -> clip)
E = [
    (0, 'guitar_pluck_1', 0.05, .30), (1, 'typing_1', 0.05, .12), (2, 'marker_1', 0.05, .12), (3, 'shutter_1', 0.05, .14),
    (21, 'stamp_1', 0.20, .30), (47, 'page', 0.30, .18), (107, 'ping_1', 0.20, .14),
    (158, 'page', 0.0, .18), (163, 'page', 0.0, .14), (163, 'stamp_2', 0.40, .22), (164, 'spark_1', 0.27, .16), (166, 'ping_2', 0.0, .08),
    (172, 'page', 0.0, .16), (182, 'check_tick_1', 0.0, .16), (182, 'check_tick_2', 0.35, .16), (182, 'check_tick_3', 0.70, .16),
    (261, 'stamp_3', 0.10, .22), (262, 'click_1', 0.0, .12), (265, 'click_2', 0.0, .12),
    (271, 'flame_1', 0.30, .22), (275, 'spark_2', 0.33, .14), (278, 'glitch_1', 0.0, .18), (279, 'glitch_2', 0.4, .12),
    (290, 'click_3', 0.0, .12), (292, 'click_3', 0.0, .12), (295, 'click_3', 0.0, .12), (297, 'click_3', 0.0, .12),
    (299, 'marker_2', 0.0, .12), (305, 'ping_1', 0.0, .18), (306, 'ping_2', 0.0, .18), (308, 'bell_1', 0.0, .22),
]
used = set()
for cue, name, off, g in E:
    put(name, start(cue) + off, g, False); used.add(cue)
# soft pops on other cues (every third), rotating variants
pops = ['pop_1', 'pop_2', 'pop_3']
for i, (sid, a, ch) in enumerate(scenes):
    nxt = scenes[i + 1][1] if i + 1 < len(scenes) else len(caps)
    for n, c in enumerate(range(a + 1, nxt, 3)):
        if c not in used: put(pops[(c) % 3], start(c) + 0.02, 0.06)
put('bell_2', DUR - 3.0, 0.14)                  # sign-off

peak = np.max(np.abs(out)); out = np.tanh(out * 1.1) / np.tanh(1.1)
pcm = (out[:int(SR * DUR)] * 32767 * 0.9).astype('<i2')
with wave.open(f'{root}/public/audio/sfx.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(np.repeat(pcm[:, None], 2, axis=1).tobytes())
print('sfx built', len(scenes), 'scenes, peak', round(peak, 2))
