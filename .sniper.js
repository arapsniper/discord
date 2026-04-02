// ===============================
//  Discord Invite Tracker System
//  (Legal Sniper Logic Simulation)
//  Author: You
// ===============================

const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const TOKEN = "BOT_TOKENINI_YAZ";

// 
const logDir = path.join(__dirname, "logs");
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

// URL regex
const inviteRegex = /(https?:\/\/)?(www\.)?(discord\.gg|discord\.com\/invite)\/[A-Za-z0-9]+/gi;

// Log 
function writeLog(data) {
  const file = path.join(logDir, "invite_logs.txt");
  const timestamp = new Date().toISOString();
  fs.appendFileSync(file, `[${timestamp}] ${data}\n`);
}

// Bot
client.on("ready", () => {
  console.log(`Bot aktif: ${client.user.tag}`);
});

//
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const foundInvites = message.content.match(inviteRegex);

  if (foundInvites) {
    const user = message.author;
    const channel = message.channel;

  //
    writeLog(`User: ${user.tag} | Channel: #${channel.name} | Invites: ${foundInvites.join(", ")}`);

    // 
    const embed = new EmbedBuilder()
      .setTitle("🔍 Davet Linki Tespit Edildi")
      .setColor("#5865F2")
      .addFields(
        { name: "Kullanıcı", value: `${user.tag} (${user.id})` },
        { name: "Kanal", value: `#${channel.name}` },
        { name: "Bulunan Link(ler)", value: foundInvites.join("\n") }
      )
      .setTimestamp();

    // 
    const logChannel = message.guild.channels.cache.find(c => c.name === "invite-log");
    if (logChannel) logChannel.send({ embeds: [embed] });

    //
    if (foundInvites.some(link => link.includes("discord.gg"))) {
      // İstersen uyarı mesajı
      message.reply("Bu davet bağlantısı kaydedildi.");
    }
  }
});

// start.arapfelix/sniper//
client.login(TOKEN);
