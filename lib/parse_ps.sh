#! /usr/bin/env bash

echo [; ps aux | grep $1 | awk 'BEGIN{FS=" "; OFS="|"} {print "{\x22pid\x22:\x22"$2"\x22, \x22line\x22:\x22"$0"\x22}," }'; echo ]
