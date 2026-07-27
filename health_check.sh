#!/bin/bash
echo "=== PM2 STATUS ==="
pm2 status

echo ""
echo "=== DOCKER CONTAINERS ==="
sudo docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "=== SYSTEM SERVICES ==="
for svc in nginx postfix dovecot freeradius mysql; do
  echo "$svc: $(sudo systemctl is-active $svc 2>/dev/null || echo 'not found/inactive')"
done

echo ""
echo "=== HTTP ENDPOINTS ==="
curl -s -o /dev/null -w "Frontend (3001): %{http_code}\n" http://127.0.0.1:3001 || echo "Frontend (3001): FAILED"
curl -s -o /dev/null -w "Backend (3000): %{http_code}\n" http://127.0.0.1:3000 || echo "Backend (3000): FAILED"
curl -s -o /dev/null -w "WG-Easy (51821): %{http_code}\n" http://127.0.0.1:51821/vpn/ || echo "WG-Easy (51821): FAILED"

echo ""
echo "=== NGINX LOGS (Last 10 Errors) ==="
sudo tail -n 10 /var/log/nginx/error.log 2>/dev/null || echo "No nginx error logs"
