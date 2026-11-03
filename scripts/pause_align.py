"""
Model-free alignment: anchors the script to the REAL pauses in the narration audio.

Idea: the narration has clear pauses at phrase / sentence ends. The script marks those spots (cue gaps of
0.15 s / 0.48 s / 0.81 s in the original SRT = comma / sentence / paragraph). A Viterbi search matches those
script breaks, in order, to the pauses actually found in the audio, so timing can never drift more than one
phrase. Inside a phrase, cues and words are placed proportionally to their letter count over the voiced time.
Accuracy: usually well under 0.2 s per word. For exact per-word times use sync-audio.py with a speech model.
"""
import json, subprocess
import numpy as np

HOP = 160  # 10 ms at 16 kHz


def load_audio(path):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '1', '-ar', '16000', '-f', 'f32le', '-'],
                         check=True, stdout=subprocess.PIPE).stdout
    return np.frombuffer(raw, dtype=np.float32)


def find_pauses(x, min_len=0.10, off_db=30):
    n = len(x) // HOP
    r = np.sqrt((x[:n * HOP].reshape(n, HOP) ** 2).mean(1) + 1e-12)
    db = 20 * np.log10(r)
    sil = db < np.percentile(db, 90) - off_db
    pauses, i = [], 0
    while i < n:
        if sil[i]:
            j = i
            while j < n and sil[j]:
                j += 1
            if (j - i) / 100 >= min_len:
                pauses.append((i / 100, j / 100))
            i = j
        else:
            i += 1
    return pauses, n / 100


def weight_of(s):
    return max(1, sum(1 for ch in s if ch.isalpha()))


def align(audio_path, cues, log=print):
    x = load_audio(audio_path)
    pauses, total = find_pauses(x)
    # leading / trailing silence are not "pauses" between phrases
    lead = pauses[0][1] if pauses and pauses[0][0] < 0.05 else 0.0
    trail = pauses[-1][0] if pauses and pauses[-1][1] > total - 0.05 else total
    inner = [p for p in pauses if p[0] > lead + 0.02 and p[1] < trail - 0.02]
    P = np.array(inner)  # (m,2)
    m = len(P)
    pdur = P[:, 1] - P[:, 0]
    cum_pause = np.concatenate([[0], np.cumsum(pdur)])  # pauses before index k
    W = [weight_of(c['text']) for c in cues]
    gaps = [round(cues[i + 1]['start'] - cues[i]['end'], 3) for i in range(len(cues) - 1)]
    cls = ['A' if g < 0.1 else 'B' if g < 0.3 else 'C' if g < 0.65 else 'D' for g in gaps]
    brk = [i for i, c in enumerate(cls) if c != 'A']  # boundary i lies between cue i and i+1
    nb = len(brk)
    # groups: group g = cues between break g-1 and break g
    edges = [-1] + brk + [len(cues) - 1]
    gw = [sum(W[edges[g] + 1: edges[g + 1] + 1]) for g in range(nb + 1)]
    voiced_total = (trail - lead) - float(pdur.sum())
    rate = voiced_total / sum(W)
    log(f'pauses {m}, script breaks {nb}, voiced {voiced_total:.1f}s, {1000 * rate:.1f} ms/letter')

    def pcost(c, d):
        need = {'B': 0.12, 'C': 0.40, 'D': 0.60}[c]
        return max(0.0, need - d) * (6 if c != 'B' else 3)

    def seg_cost(j, k, wsum):  # speech between pause j end and pause k start (indices into P)
        voiced = (P[k, 0] - P[j, 1]) - (cum_pause[k] - cum_pause[j + 1])
        exp = rate * wsum
        return ((voiced - exp) / (0.12 * exp + 0.3)) ** 2

    INF = 1e18
    # first group: from lead to first matched pause
    cost = np.full((nb, m), INF)
    back = np.zeros((nb, m), dtype=int)
    for k in range(m):
        voiced = (P[k, 0] - lead) - cum_pause[k]
        exp = rate * gw[0]
        cost[0, k] = ((voiced - exp) / (0.12 * exp + 0.3)) ** 2 + pcost(cls[brk[0]], pdur[k])
    for p in range(1, nb):
        for k in range(m):
            pc = pcost(cls[brk[p]], pdur[k])
            best, bj = INF, 0
            lo = max(0, k - 60)
            for j in range(lo, k):
                if cost[p - 1, j] >= INF:
                    continue
                v = cost[p - 1, j] + seg_cost(j, k, gw[p])
                if v < best:
                    best, bj = v, j
            cost[p, k] = best + pc
            back[p, k] = bj
    # close: last group to trailing silence
    fin = np.full(m, INF)
    for j in range(m):
        voiced = (trail - P[j, 1]) - (cum_pause[m] - cum_pause[j + 1])
        exp = rate * gw[nb]
        fin[j] = cost[nb - 1, j] + ((voiced - exp) / (0.12 * exp + 0.3)) ** 2
    j = int(np.argmin(fin))
    path = [0] * nb
    for p in range(nb - 1, -1, -1):
        path[p] = j
        j = back[p, j]
    # per-boundary pause times
    bpause = {brk[p]: (P[path[p], 0], P[path[p], 1]) for p in range(nb)}

    # voiced-time helpers (absolute time <-> voiced position), using ALL pauses
    allp = [(a, b) for a, b in pauses]

    def vpos(t):
        v = t
        for a, b in allp:
            if t >= b: v -= (b - a)
            elif t > a: v -= (t - a)
            else: break
        return v

    def tpos(v, side='start'):
        t = v
        for a, b in allp:
            if (side == 'start' and t >= a) or (side == 'end' and t > a):
                t += (b - a)
            else:
                break
        return t

    out = []
    for g in range(nb + 1):
        a_cue, b_cue = edges[g] + 1, edges[g + 1]
        t0 = lead if g == 0 else bpause[edges[g]][1]
        t1 = trail if g == nb else bpause[edges[g + 1]][0]
        v0, v1 = vpos(t0), vpos(t1)
        ws = [[weight_of(w) + 0.35 for w in cues[i]['text'].replace('\n', ' ').split()] for i in range(a_cue, b_cue + 1)]
        tot = sum(sum(w) for w in ws)
        acc = 0.0
        for ci, wl in zip(range(a_cue, b_cue + 1), ws):
            words = []
            for tok, w in zip(cues[ci]['text'].replace('\n', ' ').split(), wl):
                s = v0 + (v1 - v0) * acc / tot
                acc += w
                e = v0 + (v1 - v0) * acc / tot
                ts, te = tpos(s, 'start'), tpos(e, 'end')
                words.append({'w': tok, 'start': round(ts, 3), 'end': round(max(te, ts + 0.04), 3)})
            out.append({'start': words[0]['start'], 'end': words[-1]['end'], 'text': cues[ci]['text'], 'words': words})
    zs = []
    for p in range(nb + 1):
        j0 = None if p == 0 else path[p - 1]
        k0 = None if p == nb else path[p]
        a_t = lead if j0 is None else P[j0, 1]
        b_t = trail if k0 is None else P[k0, 0]
        inside = sum(bb - aa for aa, bb in allp if aa >= a_t - 1e-6 and bb <= b_t + 1e-6)
        exp = rate * gw[p]
        zs.append(((b_t - a_t - inside) - exp) / (0.12 * exp + 0.3))
    # keep cues in order: never let a cue (or its last word) run into the next one
    for i in range(len(out) - 1):
        nxt = out[i + 1]['start']
        if out[i]['end'] > nxt:
            out[i]['end'] = nxt
            for w in out[i]['words']:
                w['end'] = min(w['end'], nxt)
                w['start'] = min(w['start'], max(nxt - 0.04, 0))
    info = {'zs': zs, 'pauses': m, 'breaks': nb, 'rate_ms_per_letter': round(1000 * rate, 1), 'lead': lead, 'trail': trail}
    return out, info
