#!/bin/bash
echo "=== SISTEMA ==="
uname -a
lsb_release -a 2>/dev/null
echo
echo "=== VERSIONES ==="
command -v nvm >/dev/null && echo "nvm: OK" || echo "nvm: NO"
command -v node >/dev/null && node -v || echo "node: NO"
command -v npm >/dev/null && npm -v || echo "npm: NO"
command -v mongod >/dev/null && mongod --version | head -n 1 || echo "mongod: NO"
command -v mongosh >/dev/null && mongosh --version || echo "mongosh: NO"
command -v mosquitto >/dev/null && echo "mosquitto: OK" || echo "mosquitto: NO"
command -v mosquitto_pub >/dev/null && echo "mosquitto_pub: OK" || echo "mosquitto_pub: NO"
command -v mosquitto_sub >/dev/null && echo "mosquitto_sub: OK" || echo "mosquitto_sub: NO"
command -v ssh >/dev/null && ssh -V 2>&1 || echo "ssh: NO"
command -v putty >/dev/null && putty --version || echo "putty: NO"
echo
echo "=== SERVICIOS ==="
systemctl is-active mosquitto 2>/dev/null || true
systemctl is-active mongod 2>/dev/null || true
systemctl is-active ssh 2>/dev/null || true
echo
echo "=== PUERTOS ==="
ss -tulpn | grep -E '1883|27017|3000|5173|8080' || echo "Sin puertos objetivo abiertos"
echo
echo "=== ESTRUCTURA IOT40 ==="
find ~/iot40 -maxdepth 3 -type d | sort 2>/dev/null || echo "Aun no existe ~/iot40"
