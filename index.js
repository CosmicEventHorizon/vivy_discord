/** Imports **/

//import classes from discord.js
const {
	Client,
	Collection,
	Events,
	GatewayIntentBits,
	VoiceState,
	ClientUser,
} = require("discord.js");
//import fs module for reading/writing files
const fs = require("node:fs");
//import path module for working with direcotory paths
const path = require("node:path");
//import config module containing necessary API keys
const config = require("./config.json");
//import search module containing necessary modules to search and play videos
const searchCommand = require("./search.js");

/** Variables  and Constants**/

//initialize the playerPromise which will contain the AudioPlayer promise
let playerPromise = null;
//initialize the player which will contain the AudioPlayer object
let player = null;

//initialize a Client objects with the following options:
//GuildVoiceStates: allow the bot to track user's voice status in the voice channel
//GuildMessages: allow the bot to read server chat messages
//Guild: allow the bot to respond to track server events
const client = new Client({
	intents: [
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.Guilds,
	],
});
//create a Collection object which will store bot commands
client.commands = new Collection();

/** Method calls **/

//call once() to print Ready when the bot is emits a ready event
client.once("ready", () => {
	console.log("Ready!");
});

//listen to errors and warnings and print them
client.on("error", console.error);
client.on("warn", console.warn);

//login to Discord
client.login(config.token);

//call on() with the InteractionCreate event listener, triggers when the user interacts with the bot
client.on(Events.InteractionCreate, async (interaction) => {
	//if the interaction is not a slash command, do nothing
	if (!interaction.isChatInputCommand) {
		return;
	}

	//get the commandName property from the interaction object and store it under "commandName"
	const { commandName } = interaction;

	//if the commandName is search then pass the interaction to the execute function in search module to open a selection menu
	if (commandName === "search") {
		await searchCommand.execute(interaction);
	}

	//if the commandName is stop then call the stop() method of the player
	if (commandName === "stop") {
		try {
			player.stop();
			await interaction.reply("Music stopped!");
		} catch (error) {
			console.log(error);
			await interaction.reply("There was an error stopping the music");
		}
	}

	//if the commandName is pause then call the pause() method of the player
	if (commandName === "pause") {
		try {
			if (!player) throw new Error("No player exists");
			const paused = player.pause();
			if (paused) {
				await interaction.reply("Music paused!");
			} else {
				await interaction.reply("Not playing music");
			}
		} catch (error) {
			console.error(error);
			await interaction.reply("Error pausing the player.");
		}
	}

	//if the commandName is resume then call the unpause() method of the player
	if (commandName === "resume") {
		try {
			if (!player) throw new Error("No player exists");
			const resumed = player.unpause();
			if (resumed) {
				await interaction.reply("Music resumed!");
			} else {
				await interaction.reply("Music not paused");
			}
		} catch (error) {
			console.error(error);
			await interaction.reply("Error resuming the player.");
		}
	}
});

//call on() with the InteractionCreate event listener, triggers when the user interacts with the bot
client.on(Events.InteractionCreate, async (interaction) => {
	//if the interaction is not a stringSelectMenu, do nothing
	if (!interaction.isStringSelectMenu) {
	}

	//get the customId property from the interaction object and store it under "customId"
	const { customId } = interaction;

	//obtain the user's chosen option
	try {
		if (interaction.values && interaction.values.length > 0) {
			selectedOptionArray = JSON.parse(interaction.values[0]);
			title = selectedOptionArray[0];
			selectedOption = selectedOptionArray[1];
		}
	} catch (error) {
		console.log(error);
	}
	if (player != null) {
		//console.log("Stopped current music")
		player.stop();
	}

	if (customId === "searchResults") {
		//play the chosen music
		replyContent = `Now playing 🎵 ${title} 🎵`;
		playerPromise = searchCommand.playVideo(interaction, selectedOption);
		//console.log(player)
		player = await playerPromise;
		await interaction.reply(replyContent);
	}
});
