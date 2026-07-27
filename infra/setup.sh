#!/bin/bash

# Setup VPN NGINX config
cat << 'EOF' > /etc/nginx/sites-available/my.topclass.id
server {
    listen 80;
    server_name my.topclass.id;
    location / {
        proxy_pass http://127.0.0.1:51821;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
EOF

# Setup Portal NGINX config
cat << 'EOF' > /etc/nginx/sites-available/portal.topclass.id
server {
    listen 80;
    server_name portal.topclass.id;
    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
EOF

# Enable sites
ln -sf /etc/nginx/sites-available/my.topclass.id /etc/nginx/sites-enabled/
ln -sf /etc/nginx/sites-available/portal.topclass.id /etc/nginx/sites-enabled/

# Reload NGINX
nginx -t && systemctl reload nginx

# Start Docker containers
cd /home/tcu/infra
docker-compose up -d
