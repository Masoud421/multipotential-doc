#!/usr/bin/env python3
"""
Measures REAL word times from the narration audio and rewrites src/captions.json.

Usage (from the project root, after `pip install stable-ts`):
    python scripts/sync-audio.py "path/to/narration.mp3" [--model medium|large-v3] [--device cpu|cuda]

What it does
  1. Backs up public/voice.wav -> public/voice.old.wav and src/captions.json -> src/captions.original.json
     (only when those backups do not exist yet; nothing is ever deleted).
  2. Decodes the narration to public/voice.wav (48 kHz stereo) so the file you align is the file that plays.
  3. Writes src/audio-info.json (duration drives the video length).
  4. Forced-aligns the script text (the cue texts of captions.original.json, in order) to the audio with
     stable-ts/Whisper and writes new start/end + per-word times into src/captions.json.
  5. Prints a sync report and writes sync-report.json. Rebuilds the sound-effects bed.
The script text is never changed. Only times are replaced.
"""
import argparse, json, os, shutil, subprocess, sys, wave

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = lambda *a: os.path.join(root, *a)

ap = argparse.ArgumentParser()
ap.add_argument('audio')
ap.add_argument('--model', default='medium')
ap.add_argument('--device', default=None)
ap.add_argument('--pauses', action='store_true', help='no speech model: anchor the script to the real pauses in the audio (scripts/pause_align.py)')
ap.add_argument('--estimate', action='store_true', help='TEST ONLY: spread words evenly, no speech model')
a = ap.parse_args()

# 1. backups (never overwrite an existing backup)
if os.path.exists(P('public', 'voice.wav')) and not os.path.exists(P('public', 'voice.old.wav')):
    shutil.copy(P('public', 'voice.wav'), P('public', 'voice.old.wav'))
if not os.path.exists(P('src', 'captions.original.json')):
    shutil.copy(P('src', 'captions.json'), P('src', 'captions.original.json'))

# 2. decode narration -> voice.wav
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', a.audio, '-ar', '48000', '-ac', '2', P('public', 'voice.wav')], check=True)
with wave.open(P('public', 'voice.wav')) as w:
    seconds = w.getnframes() / w.getframerate()
json.dump({'seconds': round(seconds, 3)}, open(P('src', 'audio-info.json'), 'w'))
print(f'narration: {seconds:.3f} s')

# 3. script text
cues = json.load(open(P('src', 'captions.original.json'), encoding='utf-8'))
toks = [c['text'].replace('\n', ' ').split() for c in cues]
total = sum(len(t) for t in toks)

if a.pauses:
    sys.path.insert(0, P('scripts'))
    import pause_align
    res, info = pause_align.align(P('public', 'voice.wav'), cues)
    words = [[{'w': w['w'], 'start': w['start'], 'end': w['end']} for w in c['words']] for c in res]
elif a.estimate:
    words = []
    for c, t in zip(cues, toks):
        d = (c['end'] - c['start']) / len(t)
        words.append([{'w': x, 'start': c['start'] + i * d, 'end': c['start'] + (i + 1) * d} for i, x in enumerate(t)])
else:
    import stable_whisper
    model = stable_whisper.load_model(a.model, device=a.device) if a.device else stable_whisper.load_model(a.model)
    text = '\n'.join(' '.join(t) for t in toks)
    res = model.align(P('public', 'voice.wav'), text, language='fa')
    flat = [w for seg in res.segments for w in seg.words]
    if len(flat) != total:
        sys.exit(f'ALIGN ERROR: aligner returned {len(flat)} words but the script has {total}. '
                 f'Try --model large-v3, or check that the script matches the audio.')
    words, k = [], 0
    for t in toks:
        words.append([{'w': x, 'start': float(flat[k + i].start), 'end': float(flat[k + i].end)} for i, x in enumerate(t)])
        k += len(t)

# 4. enforce monotonic, sane times and write captions
prev = 0.0
for ws in words:
    for w in ws:
        w['start'] = max(w['start'], prev)
        w['end'] = max(w['end'], w['start'] + 0.04)
        prev = w['end']
out, issues = [], []
for i, (c, ws) in enumerate(zip(cues, words)):
    for w in ws:
        w['start'] = round(w['start'], 3); w['end'] = round(w['end'], 3)
        if w['end'] - w['start'] > 2.0: issues.append((i, w['w'], 'word longer than 2 s'))
    out.append({'start': ws[0]['start'], 'end': ws[-1]['end'], 'text': c['text'], 'words': ws})
    if i and out[i]['start'] < out[i - 1]['end'] - 0.1: issues.append((i, c['text'][:20], 'overlaps previous cue'))
if out[-1]['end'] > seconds: issues.append((len(out) - 1, 'last cue', 'ends after the audio'))
json.dump(out, open(P('src', 'captions.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
json.dump({'audio_seconds': seconds, 'cues': len(out), 'words': total, 'mode': 'estimate' if a.estimate else a.model, 'issues': issues},
          open(P('sync-report.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(f'{len(out)} cues, {total} words, {len(issues)} issues (see sync-report.json)')
for it in issues[:15]: print('  ISSUE', it)

# 5. rebuild SFX bed from the new times
subprocess.run([sys.executable, P('scripts', 'make-sfx.py')], check=True)
print('done. Preview: bash scripts/doc-preview.sh 0 1199')
