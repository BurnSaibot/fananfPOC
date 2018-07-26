#!/usr/bin/env pyhton
# -*- coding: utf-8 -*-

class Block:
    """ Class defining a block of subtiles which contains :
    - a subtile (text)
    - a start (time)
    - an end (time)
    """

    def __init__(self,content1,content2,timeStart,timeStop):
        self.sub1 = content1
        self.sub2 = content2
        self.start = timeStart
        self.end = timeStop
        
