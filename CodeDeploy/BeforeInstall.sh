#!/bin/bash

source ~/.bashrc
export HOME=/root

# clean contents from the current application folder
if [ -d /srv/app/current ]; then
    rm --recursive --force /srv/app/current
    mkdir /srv/app/current
    chown --recursive ubuntu /srv/app/current
fi

apt-get install --assume-yes stunnel

SUBJECT="/C=US/ST=Maryland/O=Stansberry Research"
openssl genrsa -out /etc/stunnel/key.pem 4096
openssl req -new -x509 -key /etc/stunnel/key.pem -out /etc/stunnel/cert.pem -days 1826 -subj "$SUBJECT"
cat /etc/stunnel/key.pem /etc/stunnel/cert.pem > /etc/stunnel/private.pem
chmod 640 /etc/stunnel/key.pem /etc/stunnel/cert.pem /etc/stunnel/private.pem

/etc/stunnel/stunnel.conf
/etc/init.d/stunnel4 start
