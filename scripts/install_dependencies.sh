#!/bin/bash
echo stopping node
sudo kill -9 `lsof -t -i:8000`
