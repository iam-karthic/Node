#!/bin/bash
cd /home/ubuntu/qa/node/
sudo rm -rf package-lock.json
echo running the node
sudo nohup node script.js
