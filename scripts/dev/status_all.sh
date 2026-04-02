#!/bin/bash
echo "[PUERTOS]"
ss -tulpn | grep -E '3000|3001|5173|5174|8081' || echo "Nada levantado"

echo
echo "[BACKEND]"
curl -s http://localhost:3000/api/health || echo "backend caido"

echo
echo "[GATEWAY]"
curl -s http://localhost:3001/health || echo "gateway caido"

echo
echo "[ULTIMAS LINEAS FRONTEND]"
tail -n 5 ~/iot40/data/logs/frontend.log 2>/dev/null || true
