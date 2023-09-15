const { Client, Collection, Events, 
	GatewayIntentBits, VoiceState, ClientUser } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const config = require("./config.json");
const searchCommand = require('./search.js');
let subprocessManager = null;
let subprocessPromise = null;

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
	if (interaction.values && interaction.values.length > 0) {
		selectedOption = interaction.values[0];
	  } else {
		console.log("No values selected.");
	  }
  
	if (customId === 'searchResults') {
	  	const replyContent = `You selected option: ${selectedOption}`;
 		if (typeof subprocessPromise === 'number'){
				try{
				console.log (typeof(subprocessManager))
				process.kill(subprocessPromise)
				} catch (error){
					console.log ("pid doesnt exist")
				}
	  	}
		subprocessManager = searchCommand.playVideo(interaction, selectedOption)
		console.log(subprocessManager)
		subprocessPromise = await subprocessManager
		if (typeof subprocessPromise === 'number'){
			try {
				await interaction.reply(replyContent);
				console.log("Replied successfully!");
			  } catch (error) {
				console.error("Error replying to interaction:", error);
			  }
		}
		if (typeof subprocessPromise === 'string' || subprocessPromise instanceof String){
			await interaction.reply("Please enter voice chat");
		}
	}

});

