#!/bin/bash
cd /home/ubuntu/qa/node/
sudo rm -rf package-lock.json
echo stopping node
sudo kill -9 `lsof -t -i:8000`
echo running the node
sudo nohup node script.js
