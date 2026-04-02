#!/bin/bash
mkdir -p ~/iot40/data/logs

cd ~/iot40/apps/backend && nohup npm run dev > ~/iot40/data/logs/backend.log 2>&1 &
cd ~/iot40/apps/gateway && nohup npm run dev > ~/iot40/data/logs/gateway.log 2>&1 &
cd ~/iot40/apps/frontend && nohup npm run dev -- --host > ~/iot40/data/logs/frontend.log 2>&1 &

sleep 3
echo "Stack lanzado"
echo "Frontend:"
grep -E "Local:|http://" ~/iot40/data/logs/frontend.log | tail -n 3
