const { Client, Collection, Events, 
	GatewayIntentBits, VoiceState, ClientUser } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const config = require("./config.json");
const searchCommand = require('./search.js');


const client = new Client({
    intents: [GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages, GatewayIntentBits.Guilds]
});

client.commands = new Collection();


client.once('ready', () => { 
    console.log('Ready!');
   });
  

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand){return;}
	const { commandName } = interaction;
	if (commandName === 'search') {
	  await searchCommand.execute(interaction);
	}
});


   
client.on("error", console.error);
client.on("warn", console.warn);

client.login(config.token);


client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isStringSelectMenu){return;}
	const customId = interaction.customId;
	const selectedOption = interaction.values[0]; // Assuming you only allow one option to be selected
  
	if (customId === 'searchResults') {
	  // Handle the selected option here
	  const replyContent = `You selected option: ${selectedOption}`;
	  await searchCommand.playVideo(interaction, selectedOption)
	  await interaction.reply(replyContent);
	}

});

//const collectorFilter = (interaction) => interaction.user.id === interaction.user.id;
//const collector = interaction.channel.createMessageComponentCollector({ collectorFilter, time: 60000 });
//collector.on('collect', async (selectInteraction) => {
//  const selectedValue = selectInteraction.values[0];
//  await playVideo(selectInteraction, selectedValue);
//  await selectInteraction.reply("Playing")
//});
