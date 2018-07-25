#!/bin/bash

if [ $# -eq 1 ]
then
    execPath=$(readlink -f $(dirname $1))
    file=$(basename -- $1)
    separator="/"
    filename="${file%.*}"
    echo "ffmpeg -i $1 -b:v 4000k $execPath$separator$filename.mp4"
    echo `ffmpeg -i $1 -b:v 4000k $execPath$separator$filename.mp4`
else
    echo "usage : $0 videoFilePath "
fi
