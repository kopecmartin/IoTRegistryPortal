#!/usr/bin/bash

# create repository for 64-bit system if doesn't exist
if [ ! -f /etc/yum.repos.d/mongodb.repo ]; then
    echo "[script] MongoDB repository not found!"
    echo "[script] Creating new for 64-bit system"
    sudo sh -c 'echo "[mongodb]
name=MongoDB Repository
baseurl=http://downloads-distro.mongodb.org/repo/redhat/os/x86_64/
gpgcheck=0
enabled=1" > /etc/yum.repos.d/mongodb.repo'
else
    echo "[script] MongoDB repository already exists"
fi


echo "[script] Trying update and install mongoDB"
sudo yum -y update

# install mongoDB
sudo yum -y install mongodb-org mongodb-org-server

# start mongoDB
echo "[script] Starting mongod service"
sudo systemctl start mongod

echo "[script] Enabling mongod on startup"
sudo systemctl enable mongod

echo "\n[script] By default mongoDB is running on port 27017\n"