
/** Imports **/

//import classes from discord.js
const { Client, Collection, Events, 
	GatewayIntentBits, VoiceState, ClientUser } = require('discord.js');
//import fs module for reading/writing files
const fs = require('node:fs');
//import path module for working with direcotory paths
const path = require('node:path');
//import config module containing necessary API keys
const config = require("./config.json");
//import search module containing necessary modules to search and play videos
const searchCommand = require('./search.js');

/** Variables  and Constants**/

//initialize subprocessManager to track subprocess
let subprocessManager = null;
//initalize subproceessPromise that will store the subprocess
let subprocessPromise = null;
let subprocessManagerArray = null;
let player = null;
//initialize a Client objects with the following options:
//GuildVoiceStates: allow the bot to track user's voice status in the voice channel
//GuildMessages: allow the bot to read server chat messages
//Guild: allow the bot to respond to track server events
const client = new Client({
    intents: [GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages, GatewayIntentBits.Guilds]
});
//create a Collection object which will store bot commands
client.commands = new Collection();


/** Method calls **/

//call once() to print Ready when the bot is emits a ready event
client.once('ready', () => { 
    console.log('Ready!');
});

  
//listen to errors and warnings and print them
client.on("error", console.error);
client.on("warn", console.warn);

//login to Discord 
client.login(config.token);


//call on() with the InteractionCreate event listener, triggers when the user interacts with the bot
client.on(Events.InteractionCreate, async interaction => {
	//if the interaction is not a slash command, do nothing
	if (!interaction.isChatInputCommand){return;}

	//get the commandName property from the interaction object and store it under "commandName"
	const { commandName } = interaction;

	//if the commandName is search then pass the interaction to the execute function in search module to open a selection menu
	if (commandName === 'search') {
	  await searchCommand.execute(interaction);
	}

	if (commandName === 'stop') {
		try {
			//console.log(subprocessManagerArray)
			player.stop();
			await interaction.reply("Garbage music stopped :)")
		} catch (error) {
			console.log("Player doesn't exist")
			await interaction.reply("Start a music :?")

		}
	}
});

//call on() with the InteractionCreate event listener, triggers when the user interacts with the bot
client.on(Events.InteractionCreate, async interaction => {
	//if the interaction is not a stringSelectMenu, do nothing
	if (!interaction.isStringSelectMenu){return;}

	//get the customId property from the interaction object and store it under "customId"
	const {customId} = interaction;


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
		subprocessManagerArray = await subprocessManager
		subprocessPromise = await subprocessManagerArray[0]
		player = await subprocessManagerArray[1]
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

