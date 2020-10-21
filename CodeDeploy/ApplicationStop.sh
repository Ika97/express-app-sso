#!/bin/bash

source ~/.bashrc
export HOME=/root

# Find any process on port 8080
PROCESS=`netstat -nap | grep 8080 | grep -v grep`

# if its running stop the process
if [ -n $PROCESS ] && [ -d /srv/app/current ]; then
    cd /srv/app/current
    pm2 interact stop
    pm2 interact delete
    pm2 stop ecosystem.config.js
fi
