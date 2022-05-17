#!/bin/bash
cd /home/ubuntu/qa/node/
echo stopping node
sudo kill -9 `lsof -t -i:8000`
