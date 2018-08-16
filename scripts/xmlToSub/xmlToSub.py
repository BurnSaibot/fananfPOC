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

sub1Full=0
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
    #print "mot : " + word.text + "\n longueur des sub : \n \t -sub1 : " + str(len(subtile1)) + "\n \t -sub2 :" + str(len(subtile2)) + "\n longueur du mot : " + str(len(word.text)) + "\n sub1full ? : " + str(sub1full)

    #filling the first line if it's not full
    if  (len(subtile1) + len(word.text) <= 37) and (sub1Full == 0): 
        if word.text != wordP1 and word.text != wordP2 :
            if "'" in word.text[len(subtile1)-1:len(subtile1)]:
                duration += word.timestamp - timeStampP
                timeStampP = word.timestamp
                subtile1 += word.text
                wordP2 = wordP1
                wordP1 = word.text
            else:
                if word.text == "," or word.text == ".":
                    subtile1 = subtile1[0:len(subtile1)-1]
                duration += word.timestamp - timeStampP
                timeStampP = word.timestamp
                subtile1 += word.text + " "
                wordP2 = wordP1
                wordP1 = word.text
    #else, filling the second one
    elif (len(subtile2) + len(word.text) <= 37) :
        sub1Full = 1
        if word.text != wordP1 and word.text != wordP2 :
            if "'" in word.text[len(subtile2)-1:len(subtile2)]:
                duration += word.timestamp - timeStampP
                timeStampP = word.timestamp
                subtile2 += word.text
                wordP2 = wordP1
                wordP1 = word.text
            else:
                if word.text == "," or word.text == ".":
                    subtile2 = subtile2[0:len(subtile2)-1]
                duration += word.timestamp - timeStampP
                timeStampP = word.timestamp
                subtile2 += word.text + " "
                wordP2 = wordP1
                wordP1 = word.text
    #when both are full, creating the block.
    else  :
        end = start + duration
        block = Block(subtile1,subtile2,start,end)
        blocks.append(block)
        start = end
        end =  0.0
        duration =  0.0
        subtile2 = ""
        subtile1 = word.text + " "
        sub1Full = 0
    


    
cpt = 1

#format + display
for block in blocks:

    #printing index or not ? -> depends on the format
    if (sys.argv[1] == "--srt"):
        print(str(cpt).encode('utf-8'))
    startTime = block.start
    endTime = block.end

    #Setting timers
    minStart = str( int (startTime/60)%60 ) 
    minEnd = str( int (endTime/60)%60  )
    secondStart = str( int (startTime%60))
    secondEnd = str(int (endTime%60))
    msStart = str(int ((startTime%1)*100))
    msEnd = str(int ((endTime%1)*100))
    hStart = str(int (startTime/3600))
    hEnd = str(int (endTime/3600))

    #formating the string for timestamps
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

    #creating the time stamp
    content = hStart + ":" + minStart + ":" + secondStart + separator + msStart + "0 --> " + hEnd + ":" + minEnd + ":" +secondEnd + separator + msEnd + "0"
    content = content.encode('utf-8')
    print(content)

    #writing the content
    if (len(block.sub1)>0):
        print( block.sub1.encode('utf-8'))
    if (len(block.sub2)>0):
        print( block.sub2.encode('utf-8'))
    print("")
    cpt +=1
    
