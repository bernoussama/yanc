#!/bin/sh
echo "Starting production server..."
node /app/server.js &
PID=$!

wait $PID
