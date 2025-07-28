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
const jsonResultArray = [];


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
				.setLabel(titleArray[i].substring(0, 40))
				.setValue(JSON.stringify([titleArray[i].substring(0, 40),idArray[i]]));

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
			const shortTitle = item.title.substring(0, 40);
			const videoId = typeof item.id === 'object' ? item.id.videoId : item.id;

			titleArray.push(shortTitle);
			idArray.push(item.id.videoId || item.id);


			jsonResultArray.push([shortTitle, videoId]);

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
		AudioPlayerStatus,
		VoiceConnectionStatus,
		entersState
	} = require("@discordjs/voice");
	const ytdl_wrap = require("yt-dlp-wrap").default;
	const { spawn } = require("child_process");
	const path = require("path");
	const os = require("os");


	//create the url link
	const fix_url = "https://www.youtube.com/watch?v=" + url;
	//get the user's voice channel
	const voiceChannel = interaction.member.voice.channel;
	
	//enter the user's voice channel and play the youtube music video;
	if (!voiceChannel) {
		await interaction.reply({
			content: "Join a voice channel pwease uwu!"
		});
		return;
	}
		try {
			//join the user's voice channel
			const connection = joinVoiceChannel({
				channelId: interaction.member.voice.channel.id,
				guildId: interaction.message.guild.id,
				adapterCreator: interaction.message.channel.guild.voiceAdapterCreator,
			});

			const ytdlp_binary = os.platform() === "win32" ? "yt-dlp.exe" : "yt-dlp";
			const ytdlp_path = path.resolve(__dirname, ytdlp_binary);

			//create yt-dlp subprocess
			const ytdlp_process = spawn(ytdlp_path, [
				fix_url,
				"-f", "bestaudio",
				"-o", "-", 
				"--no-playlist",
				"--quiet",
				"--force-ipv4"
			]);
	
			const ffmpeg = spawn("ffmpeg", [
				"-i", "pipe:0",
				"-analyzeduration", "0",
				"-loglevel", "0",
				"-f", "s16le",
				"-ar", "48000",
				"-ac", "2",
				"pipe:1"
			], {
				stdio: ["pipe", "pipe", "ignore"]
			});
			

	
			ytdlp_process.stdout.pipe(ffmpeg.stdin);

			// create the audioplayer and play the audio resources from stdout of the subprocess
			const player = createAudioPlayer();
			const resource = createAudioResource(ffmpeg.stdout, {
				inputType: StreamType.Raw,
			});
			player.play(resource);
			connection.subscribe(player);
			//return the player object to control its status from index
			return player;


		} catch (error) {
			console.error("Error in playVideo:", error);
			await interaction.reply("There was an error playing the audio");
			return null;
		}
	}

