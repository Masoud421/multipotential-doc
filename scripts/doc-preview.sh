#!/usr/bin/env bash
# Short preview render. Usage: scripts/doc-preview.sh [startFrame] [endFrame]   (30 fps)
# Default: first 40 seconds (frames 0-1199).
set -e
START="${1:-0}"; END="${2:-1199}"
mkdir -p out
npx remotion render src/index-doc.ts MultipotentialDoc "out/doc-preview-${START}-${END}.mp4" --frames="${START}-${END}"
