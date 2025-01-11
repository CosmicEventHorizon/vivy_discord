/** Imports **/

//import classes from discord.js
const {
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder,
	ActionRowBuilder,
	SlashCommandBuilder,
} = require("discord.js");
//import youtube-search-api module for searching youtube
const youtubesearchapi = require("youtube-search-api");

/** Variables and Constants**/

//string array containing the youtube titles
const titleArray = [];
//array containing the id of each youtube titles
const idArray = [];
//holds the StringSelectMenuOption objects with the id and title
const optionsArray = [];
//holds the relevant parts of the json response from youtube-search-api
let jsonResult = "";

module.exports = {
	playVideo,
	data: new SlashCommandBuilder()
		.setName("search")
		.setDescription("Search Youtube for video")
		.addStringOption((option) =>
			option
				.setName("keyword")
				.setDescription("The keyword to search")
				.setRequired(true)
		),
	async execute(interaction) {
		optionsArray.length = 0;
		titleArray.length = 0;
		idArray.length = 0;
		const keyword = interaction.options.getString("keyword");
		await youtubeSearch(keyword);
		for (let i = 0; i < titleArray.length; i++) {
			const options = new StringSelectMenuOptionBuilder()
				.setLabel(titleArray[i])
				.setValue(idArray[i]);

			optionsArray.push(options);
		}
		const select = new StringSelectMenuBuilder()
			.setCustomId("searchResults")
			.setPlaceholder("Search Results")
			.addOptions(optionsArray);

		const row = new ActionRowBuilder().addComponents(select);

		await interaction.reply({
			components: [row],
		});
	},
};

async function youtubeSearch(keyword) {
	try {
		const results = await youtubesearchapi.GetListByKeyword(
			keyword,
			true,
			5,
			{}
		);
		const jsonItems = results.items;
		//console.log(jsonItems)
		for (const item of jsonItems) {
			const shortTitle = item.title;
			const shortTitleString = shortTitle.substring(0, 80);
			titleArray.push(shortTitleString);
			idArray.push(item.id);
			jsonResult += item.title + item.id + ", ";
		}
	} catch (error) {
		console.error(error);
	}
}

async function playVideo(interaction, url) {
	const {
		joinVoiceChannel,
		createAudioPlayer,
		createAudioResource,
		StreamType,
	} = require("@discordjs/voice");
	const ytdl = require("youtube-dl-exec");
	const fixUrl = "https://www.youtube.com/watch?v=" + url;
	const voiceChannel = interaction.member.voice.channel;
	const { createReadStream } = require("node:fs");
	const { join } = require("node:path");
	let subprocess = null;

	if (!voiceChannel) {
		const voiceError = "error";
		return voiceError;
	} else {
		try {
			const connection = joinVoiceChannel({
				channelId: interaction.member.voice.channel.id,
				guildId: interaction.message.guild.id,
				adapterCreator: interaction.message.channel.guild.voiceAdapterCreator,
			});
			subprocess = ytdl.exec(
				fixUrl,
				{
					o: "-",
					q: "",
					f: "bestaudio",
				},
				{ stdio: ["ignore", "pipe", "ignore"] }
			);
			player = createAudioPlayer();
			const resource = createAudioResource(subprocess.stdout, {
				inputType: StreamType.Arbitrary,
			});
			//console.log(subprocess)
			player.stop();
			player.play(resource);
			connection.subscribe(player);
			return [subprocess.pid, player];
		} catch (error) {
			console.log(error);
			interaction.reply("There was an error playing the video.");
		}
	}
}
