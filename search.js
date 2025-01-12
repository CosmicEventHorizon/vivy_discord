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
				.setValue([titleArray[i],idArray[i]].join(','));

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
			jsonResult += item.title + item.id + " , ";
		}
	} catch (error) {
		console.error(error);
	}
}

async function playVideo(interaction, url) {

	/**  Dependencies **/
	const {
		joinVoiceChannel,
		createAudioPlayer,
		createAudioResource,
		StreamType,
	} = require("@discordjs/voice");
	const ytdl = require("youtube-dl-exec");
	const { spawn } = require("child_process");


	//create the url link
	const fixUrl = "https://www.youtube.com/watch?v=" + url;
	//get the user's voice channel
	const voiceChannel = interaction.member.voice.channel;
	
	//enter the user's voice channel and play the youtube music video;
	if (!voiceChannel) {
		const voiceError = "Error joining the voice channel";
		return voiceError;
	} else {
		try {
			//join the user's voice channel
			const connection = joinVoiceChannel({
				channelId: interaction.member.voice.channel.id,
				guildId: interaction.message.guild.id,
				adapterCreator: interaction.message.channel.guild.voiceAdapterCreator,
			});

			//create yt-dlp subprocess
			const subprocess = spawn(
				"./node_modules/youtube-dl-exec/bin/yt-dlp",
				[fixUrl, "-o", "-", "-q", "", "-f", "bestaudio"],
				{ stdio: ["ignore", "pipe", "ignore"] }
			);

			// create the audioplayer and play the audio resources from stdout of the subprocess
			player = createAudioPlayer();
			const resource = createAudioResource(subprocess.stdout, {
				inputType: StreamType.Arbitrary,
			});
			player.play(resource);
			connection.subscribe(player);
			//return the player object to control its status from index
			return player;


		} catch (error) {
			console.log(error);
			interaction.reply("There was an error playing the audio");
		}
	}
}
