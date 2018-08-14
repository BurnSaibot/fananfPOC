#!/usr/bin/env pyhton
# -*- coding: utf-8 -*-

from classWord import Word
from classBlock import Block
import sys
from lxml import etree

if (len(sys.argv) != 3 ):
    print "usage : " , sys.argv[0] ," [format] ", "filePath"
    print "Available format : "
    print " Srt : --srt"
    print " webvtt : --webvtt"
    sys.exit(1)

if (sys.argv[1] == "--srt"):
    separator = ","
elif (sys.argv[1] == "--webvtt"):
    separator = "."
    print "WEBVTT"
    print ""
else:
    print("Bad Option ", sys.argv[0])
    sys.exit(2)
xmlFile = etree.parse(sys.argv[2])
words = []
for word in xmlFile.xpath("/AudioDoc/SegmentList/SpeechSegment/Word"):
    content = Word(word.get('stime'),word.get('dur'),word.text.replace(" ","").lower())
    words.append(content)
subtile1 = ""
subtile2 = ""
start = 0.0
end = 0.0
duration = 0.0
timeStampP = 0.0
wordP1 = ""
wordP2 = ""
blocks = []

for word in words:
#    print(word.text +  "\t" +  str(word.timestamp) +  "\t" + str( word.duration))
    if  (len(subtile1) + len(word.text) <= 37) : 
        addWord(subtile1,word,start,end,duration,timeStampP,wordP1,wordP2)
    elif (len(subtile2) + len(word.text) <= 37) :
        addWord(subtile2,word,start,end,duration,timeStampP,wordP1,wordP2)
    else  :
        end = start + duration
        block = Block(subtile1,subtile2,start,end)
        blocks.append(block)
        start = end
        end =  0.0
        duration =  0.0
        subtile2 = ""
        subtile1 = word.text + " "
    


    
cpt = 1

#format + display
for block in blocks:
    if (sys.argv[1] == "--srt"):
        print(str(cpt).encode('utf-8'))
    startTime = block.start
    endTime = block.end
    minStart = str( int (startTime/60)%60 ) 
    minEnd = str( int (endTime/60)%60  )
    secondStart = str( int (startTime%60))
    secondEnd = str(int (endTime%60))
    msStart = str(int ((startTime%1)*100))
    msEnd = str(int ((endTime%1)*100))
    hStart = str(int (startTime/3600))
    hEnd = str(int (endTime/3600))
    if (len(msStart) == 1):
        msStart += "0"
    if (len(msEnd) == 1):
        msEnd += "0"
    if (len(hStart) == 1):
        hStart = "0" + hStart
    if (len(hEnd) == 1):
        hEnd = "0" + hEnd
    if (len(minStart) == 1):
        minStart = "0" + minStart
    if (len(minEnd) == 1):
        minEnd = "0" + minEnd
    if (len(secondStart) == 1):
        secondStart = "0" + secondStart
    if (len(secondEnd) == 1) :
        secondEnd = "0" + secondEnd
    content = hStart + ":" + minStart + ":" + secondStart + separator + msStart + "0 --> " + hEnd + ":" + minEnd + ":" +secondEnd + separator + msEnd + "0"
    content = content.encode('utf-8')
    print(content)
    if (len(block.sub2)>0):
        print( block.sub2.encode('utf-8'))
    if (len(block.sub1)>0):
        print( block.sub1.encode('utf-8'))
    print("")
    cpt +=1
    
def addWord(subtile,word,start,end,duration,timeStampP,wordP1,wordP2):
    if word.text != wordP1 and word.text != wordP2 :
        if "'" in word.text[len(subtile)-1:len(subtile)]:
            duration += word.timestamp - timeStampP
            timeStampP = word.timestamp
            subtile += word.text
            wordP2 = wordP1
            wordP1 = word.text
        else:
            if word.text == "," or word.text == ".":
                subtile = subtile[0:len(subtile)-1]
            duration += word.timestamp - timeStampP
            timeStampP = word.timestamp
            subtile1 += word.text + " "
            wordP2 = wordP1
            wordP1 = word.text