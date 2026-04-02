#!/bin/bash
pkill -f "nodemon src/index.js"
pkill -f "vite --host"
echo "Stack detenido"
