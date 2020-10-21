#!/bin/bash

export KEYMETRICS_PUBLIC=$(/root/.local/bin/aws ssm get-parameters --names web-team.deploy.config-pm2-public --query Parameters[0].Value --region us-east-1 --with-decryption --output json)
export KEYMETRICS_PUBLIC=`echo $KEYMETRICS_PUBLIC | sed -e 's/^"//' -e 's/"$//'`

export KEYMETRICS_SECRET=$(/root/.local/bin/aws ssm get-parameters --names web-team.deploy.config-pm2-secret --query Parameters[0].Value --region us-east-1 --with-decryption --output json)
export KEYMETRICS_SECRET=`echo $KEYMETRICS_SECRET | sed -e 's/^"//' -e 's/"$//'`

export PM2_MACHINE_NAME=dww-`hostname`

pm2 interact $KEYMETRICS_SECRET $KEYMETRICS_PUBLIC $PM2_MACHINE_NAME
pm2 update

pm2 install pm2-server-monit
