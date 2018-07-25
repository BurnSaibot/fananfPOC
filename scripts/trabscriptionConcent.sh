#!/bin/bash

if [ $# -ne 1 ]
then
    echo "usage : $0 filePath"
    exit 1 
else
    
    echo `cat $1 | grep -v "<SpeechSegment" | grep -v "</SpeechSegment>"| grep -v "SegmentList" | grep -v "AudioDoc" | grep -v "<Speaker" | grep -v "<Channel" | grep -v "<Proc" | grep -v "</Proc" | grep -v "</Speaker" | grep -v "</ChannelList" | grep -v "<?xml" | cut -d'>' -f2 | cut -d'<' -f1 | cut -d' ' -f2 | cut -d',' -f1 | cut -d'.' -f1 | cut -d'.' -f1 | cut -d'.' -f1 | cut -d':' -f1`
fi
exit 0
