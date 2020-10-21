#!/bin/bash

source ~/.bashrc
export HOME=/root

# own app/current folder
cd /srv/app
chown --recursive ubuntu ./current

# install production npm modules
cd /srv/app/current
npm install --production

# Pull ecosytem.config from S3
cd /srv/app/current
/root/.local/bin/aws s3 cp s3://web.devops.stansberryresearch.com/applications/sso/ecosystem.config.js.enc ./

# Get decryption password
password=$(/root/.local/bin/aws ssm get-parameters --region us-east-1 --names web-team.deploy.config-password --with-decryption --query Parameters[0].Value --output json)
password=`echo $password | sed -e 's/^"//' -e 's/"$//'`

# Decrypt file
openssl aes-256-cbc -salt -a -d -in ecosystem.config.js.enc -out ecosystem.config.js -pass pass:$password

# Remove encrypted file
rm ecosystem.config.js.enc

# Restart Nginx
mv /srv/app/current/CodeDeploy/resources/default.conf /etc/nginx/sites-enabled/default
systemctl restart nginx
