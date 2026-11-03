#!/usr/bin/env bash
# Full 10:29 render -> out/multipotential-doc.mp4 (audio from public/voice.wav is included).
set -e
mkdir -p out
npx remotion render src/index-doc.ts MultipotentialDoc out/multipotential-doc.mp4 --codec=h264 --crf=20
