#!/bin/bash

SRC="../imgs"
DST="../demo/pub"
TMP="/var/tmp"

## im7 jpeg
magick "$SRC/giraffe photo 990 lanczos 96 16.png" -verbose -format jpg -type TrueColor -quality 75 +profile xmp "$DST/image-giraffe.jpg"
magick "$SRC/jellyfish thumb 540 bicubic 72 8.png" -verbose -format jpg -type TrueColor -quality 50 +profile xmp "$DST/thumb-jellyfish.jpg"

## im7 avif
magick "$SRC/tiger 1100 bicubic 72 16.png" -verbose -format avif -type TrueColor -quality 55 -depth 10 +profile xmp "$DST/image-tiger.avif"
magick "$SRC/ostrich 900 bicubic 96 16.png" -verbose -format avif -type TrueColor -quality 55 -depth 8 -density 72 +profile xmp "$DST/image-ostrich.avif"

## ffmpeg webp
ffmpeg -y -i "$SRC/cow 1200 bicubic 96 16.png" -f webp -quality 50 -compression_level 6 -preset photo "$DST/image-cow.webp"
ffmpeg -y -i "$SRC/elephant 900 bicubic 96 16.png" -f webp -quality 50 -compression_level 6 -preset drawing "$DST/image-elephant.webp"

## tinify png:png24
# magick "$SRC/giraffe png 450 lanczos 72 8.png" -verbose -format png -type TrueColor -enhance -dither FloydSteinberg -colors 160 -define png:format=png8 -define png:compression-level=9 +profile xmp "$DST/image-giraffe.png"

## svgomg svg
svgo -f "$SRC/lizard.svg" --multipass --precision 1 --disable='convertShapeToPath' --enable='convertStyleToAttrs' -o "$DST/image-lizard.svg"

## ffmpeg webm:vp9
ffmpeg -y -i "$SRC/jellyfish 2160.mp4" -s 960x720 -r 30 -c:v libvpx-vp9 -crf 32 -row-mt 1 -pass 1 -f webm -shortest "$DST/video-jellyfish.webm" && \
ffmpeg -y -i "$SRC/jellyfish 2160.mp4" -s 960x720 -r 30 -c:v libvpx-vp9 -crf 32 -row-mt 1 -pass 2 -f webm -shortest "$DST/video-jellyfish.webm"

## ffmpeg mp4:h264
ffmpeg -y -i "$SRC/jellyfish 2160.mp4" -s 960x720 -r 30 -c:v libx264 -crf 30 -tune film -movflags +faststart -shortest "$DST/video-jellyfish.mp4"

## lame mp3
lame --resample 32 -b 96 "$SRC/loop.wav" "$DST/audio-loop.mp3"

## lame | ffmpeg opus
lame --resample 32 -h --decode "$SRC/loop.wav" "$TMP/voip.wav" && \
ffmpeg -y -i "$TMP/voip.wav" -c:a libopus -b:a 80k -application voip -shortest "$DST/audio-loop.opus"

## gs | pdf-lib pdf
gs -sDEVICE=pdfwrite -sPDFSETTING=/screen -dFastWebView -dPreserveAnnots=false -dPreserveMarkedContent=false -dOmitInfoDate=true -dOmitID=true -dNOPAUSE -dQUIET -dBATCH -sOutputFile="$TMP/input.pdf" "$SRC/lipsum.pdf"
npm init esm --yes -y && npm install --save-dev pdf-lib
node ./pdfclean.js "$TMP/input.pdf" "$TMP/output.pdf"
gs -sDEVICE=pdfwrite -sPDFSETTING=/screen -dFastWebView -dOmitInfoDate=true -dOmitID=true -dNOPAUSE -dQUIET -dBATCH -sOutputFile="$DST/document.pdf" "$TMP/output.pdf"

