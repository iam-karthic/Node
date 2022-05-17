#!/bin/bash
echo stopping node
PID=`ps -ef | grep -w "server.js" | grep "node" | awk '{print $2}'`
kill -9 $PID
