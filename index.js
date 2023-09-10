const { Client, GuildMember, GatewayIntentBits } = require("discord.js");
const { Player, QueryType } = require("discord-player");
const config = require("./config.json");

const client = new Client({
    intents: [GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages, GatewayIntentBits.Guilds]
});
client.login(config.token);

client.once('ready', () => {
    console.log('Ready!');
   });
   
client.on("error", console.error);
client.on("warn", console.warn);