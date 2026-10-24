#!/usr/bin/env bash
# Turns a HyperFrames render of this project into the landing page's files.
#
#   npx hyperframes render -o renders/raw.mp4
#   ./deliver.sh renders/raw.mp4 [path/to/wtc-explainer.gif]
#
# Writes ../public/wtc-explainer.mp4 (video stream copied, audio raised toward
# -16 LUFS under a -2 dBFS peak limiter), ../public/chapters/*.jpg (480x270,
# one per chapter link), ../public/wtc-explainer-poster.jpg (1920x1080) and,
# when a second path is given, the README GIF (820 px wide, 12 fps, looping).
set -euo pipefail

RAW="${1:?usage: ./deliver.sh <raw render.mp4> [gif out]}"
GIF="${2:-}"
HERE="$(cd "$(dirname "$0")" && pwd)"
PUBLIC="$HERE/../public"
OUT="$PUBLIC/wtc-explainer.mp4"

# Master: raise the renderer's mix toward -16 LUFS and let a fast, 4x-oversampled
# peak limiter (-2 dBFS ceiling, 10 ms release, no auto-release) catch the
# transients. Integrated loudness is dominated by the sound-effect hits, so an
# effects-led mix lands around -17 LUFS with the hits still clearly over the
# music; pushing harder only flattens the hits (loudnorm's dynamic mode did).
TARGET=-16
INPUT_I="$(ffmpeg -hide_banner -nostats -i "$RAW" -vn -af ebur128 -f null - 2>&1 |
  awk '/Integrated loudness:/{f=1} f && /I:/{print $2; exit}')"
GAIN="$(awk -v t="$TARGET" -v i="$INPUT_I" 'BEGIN{printf "%.2f", t - i}')"
echo "mix ${INPUT_I} LUFS, gain ${GAIN} dB"
ffmpeg -hide_banner -loglevel error -y -i "$RAW" \
  -map 0:v:0 -map 0:a:0 -c:v copy \
  -af "volume=${GAIN}dB,aresample=192000,alimiter=limit=0.79:attack=0.5:release=10:level=0:asc=0,aresample=48000" \
  -c:a aac -b:a 160k -ar 48000 -movflags +faststart "$OUT"

# Chapter stills: a frame that reads as each chapter (chapter starts are
# 0, 6, 12, 17, 25, 31, 36 s; DemoVideo.tsx links to them).
still() {
  ffmpeg -hide_banner -loglevel error -y -ss "$2" -i "$OUT" -frames:v 1 \
    -vf "scale=480:270:flags=lanczos" -q:v 3 "$PUBLIC/chapters/$1.jpg"
}
still problem 3.2
still fix 10.2
still spawn 16.4
still start 21.0
still compare 28.5
still promote 34.4
still clean 39.8

# Poster: the four worktrees on their four ports.
ffmpeg -hide_banner -loglevel error -y -ss 20.6 -i "$OUT" -frames:v 1 -q:v 2 \
  "$PUBLIC/wtc-explainer-poster.jpg"

if [ -n "$GIF" ]; then
  PAL="$(mktemp -t wtc-palette).png"
  FILTERS="fps=12,scale=820:-1:flags=lanczos"
  ffmpeg -hide_banner -loglevel error -y -i "$OUT" \
    -vf "$FILTERS,palettegen=max_colors=128:stats_mode=diff" "$PAL"
  ffmpeg -hide_banner -loglevel error -y -i "$OUT" -i "$PAL" \
    -lavfi "$FILTERS [x]; [x][1:v] paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle" \
    -loop 0 "$GIF"
  rm -f "$PAL"
fi

ls -la "$OUT" "$PUBLIC/wtc-explainer-poster.jpg" "$PUBLIC"/chapters/*.jpg ${GIF:+"$GIF"}
