#!/usr/bin/bash

echo "[script] Downloading influxdb package"
wget https://dl.influxdata.com/influxdb/releases/influxdb-1.2.2.x86_64.rpm

echo "[script] Installing the package"
sudo yum install ./influxdb-1.2.2.x86_64.rpm
rm ./influxdb-1.2.2.x86_64.rpm

# start influxDB
echo "[script] Starting influxdb service"
sudo systemctl start influxdb

echo "[script] Enabling influxdb on startup"
sudo systemctl enable influxdb

echo "[script] By default influxdb is running on TCP port 8086 (client-server communication)"
echo "and port 8088 is used for the RPC service for backup and restore"