#!/usr/bin/env bash
# Vérifie le MP4 exporté : codec, dimensions, cadence, durée, nombre d'images,
# puis extrait une image au milieu de chaque scène (out/verify/).
set -euo pipefail
FILE="${1:-out/baobelia-pub-15s.mp4}"
ffprobe -v error -select_streams v:0 -count_frames \
  -show_entries stream=codec_name,profile,pix_fmt,width,height,r_frame_rate,nb_read_frames,display_aspect_ratio \
  -show_entries format=duration,size -of default=noprint_wrappers=1 "$FILE"
echo "Pistes audio : $(ffprobe -v error -select_streams a -show_entries stream=index -of csv=p=0 "$FILE" | wc -l)"
mkdir -p out/verify
for t in 1.5 5.0 9.0 13.5 14.95; do
  ffmpeg -v error -y -ss "$t" -i "$FILE" -frames:v 1 "out/verify/t-${t}s.png"
done
ffmpeg -v error -y -i out/verify/t-1.5s.png -i out/verify/t-5.0s.png -i out/verify/t-9.0s.png -i out/verify/t-13.5s.png \
  -filter_complex "[0][1][2][3]hstack=4,scale=1440:-1" out/verify/scenes.png
echo "Images de contrôle : out/verify/"
