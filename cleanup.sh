#!/bin/bash
echo "Membersihkan aplikasi yang tidak digunakan (VPN dll)..."

mkdir -p /home/tcu/backup_unused

# Pindahkan file dan folder yang tidak ada kaitannya dengan afaglobalmedia
mv /home/tcu/client-configs /home/tcu/backup_unused/ 2>/dev/null
mv /home/tcu/openvpn-ca /home/tcu/backup_unused/ 2>/dev/null
mv /home/tcu/klien-vpn.ovpn /home/tcu/backup_unused/ 2>/dev/null
mv "/home/tcu/udo systemctl status freeradius" /home/tcu/backup_unused/ 2>/dev/null
mv "/home/tcu/udo systemctl status openvpn-server@server" /home/tcu/backup_unused/ 2>/dev/null
mv "/home/tcu/ks: 0 (limit: 9417)" /home/tcu/backup_unused/ 2>/dev/null

echo "✅ Aplikasi dan file yang tidak terpakai sudah dipindahkan ke folder ~/backup_unused"
