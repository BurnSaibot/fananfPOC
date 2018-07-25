#!/bin/bash

if [ $# -ne 1 ]
then
    echo "usage : $0 videoFilePath "
else
    execPath=$(readlink -f $(dirname $1))
    echo "excecPath = $execPath"
    file=$(basename -- "$1")
    echo "file = $file"
    separator="/"
    echo "separator = $separator"
    filename="${file%.*}"
    echo "filename = $filename"
    echo "ffmpeg -i $1 $execPath$separator$filename.mp3"
    echo `ffmpeg -i $1 $execPath$separator$filename.mp3`
    
fi
