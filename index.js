const mineflayer = require('mineflayer');
const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const bots = [];
let serverHost = '';
let serverPort = 25565;

function askQuestion(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function startMenu() {
  console.clear();
  console.log("=================================");
  console.log(" 👑 ATERNOS 24/7 4 BOT LAUNCHER ");
  console.log("=================================");

  serverHost = await askQuestion("Server IP দাও: ");
  serverPort = await askQuestion("Port দাও [25565]: ") || 25565;

  console.log("\n4 টে Bot এর নাম দাও:");
  const names = [];
  for(let i=1; i<=4; i++){
    const name = await askQuestion(`Bot ${i} Name: `) || `PayelBot${i}`;
    names.push(name);
  }

  console.log("\n✅ সব ready! 10 সেকেন্ড পর 4 টে bot join করবে...");
  setTimeout(() => launchBots(names), 3000);
}

function launchBots(names) {
  names.forEach((name, i) => {
    setTimeout(() => createBot(name, i), i * 2000); // 2 sec gap এ join
  });

  setTimeout(() => showControlMenu(names), 10000);
}

function createBot(username, id) {
  console.log(`[${username}] Joining...`);
  const bot = mineflayer.createBot({
    host: serverHost,
    port: parseInt(serverPort),
    username: username,
    version: false
  });

  bot.on('spawn', () => {
    console.log(`[${username}] 🟢 Online`);
    // 24/7 Anti-AFK
    setInterval(() => { bot.swingArm(); }, 60000 * 2);
  });

  bot.on('chat', (user, msg) => {
    if(user!== username) console.log(`[Chat] ${user}: ${msg}`);
  });

  bot.on('end', () => {
    console.log(`[${username}] 🔴 Disconnected. 15s পর Reconnect...`);
    setTimeout(() => createBot(username, id), 15000); // Auto Reconnect
  });

  bot.on('error', err => console.log(`[${username}] Error:`, err.message));
  bots[id] = bot;
}

async function showControlMenu(names) {
  console.clear();
  console.log("=================================");
  console.log(` Server: ${serverHost}:${serverPort} `);
  console.log(" [1-4] Bot Select করে Chat ");
  console.log(" [r] 4 Bot Restart ");
  console.log(" [q] Exit ");
  console.log("=================================");

  while(true){
    const cmd = await askQuestion("Command: ");
    if(cmd === 'q') process.exit();
    if(cmd === 'r') { bots.forEach(b => b && b.end()); setTimeout(() => launchBots(names), 2000); }
    if(cmd >= '1' && cmd <= '4'){
      const id = parseInt(cmd)-1;
      const msg = await askQuestion(`[${names[id]}] Chat: `);
      if(bots[id]) bots[id].chat(msg);
    }
  }
}

startMenu();