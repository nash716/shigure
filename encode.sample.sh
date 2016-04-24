#!/bin/sh

# $1: input file
# $2: output file

ffmpeg -y -i "$1" -f mp4 -vcodec libx264 -fpre "$(cd $(dirname $0) && pwd)/libx264-hq-ts.ffpreset" -r 30000/1001 -aspect 16:9 -s 1280x720 -bufsize 20000k -maxrate 25000k -acodec libfdk_aac -ac 2 -ar 48000 -ab 128k -threads 2 "$2"
