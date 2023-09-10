const { Client, GuildMember, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, SelectMenuBuilder } = require("discord.js");
const { Player, QueryType } = require("discord-player");
const config = require("./config.json");
const youtubesearchapi = require("youtube-search-api");
let jsonResult = '';


const client = new Client({
    intents: [GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages, GatewayIntentBits.Guilds]
});


client.once('ready', () => { 
    console.log('Ready!');
   });



client.on('messageCreate', async (message) => {
if (message.content.includes('search')) {
    await youtubeSearch()
    message.channel.send(jsonResult);
}
if (message.content.includes('menu')){
        await Spawn();
    }

});

async function youtubeSearch() {
    try {
      const results = await youtubesearchapi.GetListByKeyword("jujutsu", true, 10, { /* additional options */ });
      const jsonItems = results.items;
      console.log(jsonItems)
      for (const item of jsonItems) {
        jsonResult += item.title + ', ' + item.id;
      }
    } catch (error) {
      console.error(error);
    }
 }
  
async function Spawn()
{
    var menuBuilder = new SelectMenuBuilder()
        .WithPlaceholder("Select an option")
        .WithCustomId("menu-1")
        .WithMinValues(1)
        .WithMaxValues(1)
        .AddOption("Option A", "opt-a", "Option B is lying!")
        .AddOption("Option B", "opt-b", "Option A is telling the truth!");

    var builder = new ComponentBuilder()
        .WithSelectMenu(menuBuilder);
}



   
client.on("error", console.error);
client.on("warn", console.warn);

client.login(config.token);
