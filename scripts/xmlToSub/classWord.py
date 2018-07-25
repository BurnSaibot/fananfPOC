#!/usr/bin/env pyhton
# -*- coding: utf-8 -*-

class Word:
    """ Class defining a word which has :
    - a timestamp
    - a duration
    - a text
    """

    def __init__(self,start,time,content):
        self.timestamp = float (start)
        self.duration = float (time)
        self.text = content
