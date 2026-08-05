#!/data/data/com.termux/files/usr/bin/bash

clear
echo "================================="
echo " 👑 ATERNOS 24/7 4 BOT INSTALLER "
echo "================================="

echo -n "Installing Node.js dependencies... "
npm init -y > /dev/null 2>&1
npm install mineflayer > /dev/null 2>&1
echo "Done."

echo "================================="
echo "✅ Setup is completely done!"
echo "================================="

node index.js
