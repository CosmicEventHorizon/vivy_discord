const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, 
  ActionRowBuilder, SlashCommandBuilder } = require('discord.js');
const youtubesearchapi = require("youtube-search-api");
let jsonResult = '';
const titleArray = [];
const idArray = [];
const optionsArray = [];



module.exports = {
  playVideo,
	data: new SlashCommandBuilder()
		.setName('search')
		.setDescription('Search Youtube for video')
    .addStringOption(option =>
      option.setName('keyword')
        .setDescription('The keyword to search')
        .setRequired(true)),
	async execute(interaction) {
    optionsArray.length = 0;
    titleArray.length = 0;
    idArray.length = 0;
    const keyword = interaction.options.getString('keyword')
    await youtubeSearch(keyword);
    for (let i = 0; i< titleArray.length; i++){
      const title = titleArray[i]
      const id = idArray[i]

      const options = new StringSelectMenuOptionBuilder()
      .setLabel(title)
      .setValue(id)

      optionsArray.push(options)
    }
    const select = new StringSelectMenuBuilder()
			.setCustomId('searchResults')
			.setPlaceholder('Search Results')
			.addOptions(optionsArray);

    const row = new ActionRowBuilder()
      .addComponents(select);
  
     await interaction.reply({
        components: [row],
      });
	},
};

    
async function youtubeSearch(keyword) {
        try {
          const results = await youtubesearchapi.GetListByKeyword(keyword, true, 5, { /* additional options */ });
          const jsonItems = results.items;
          console.log(jsonItems)
          for (const item of jsonItems) {
            const shortTitle = item.title
            const shortTitleString = shortTitle.substring(0, 80);
            titleArray.push(shortTitleString)
            idArray.push(item.id)
            jsonResult += item.title + item.id + ', ';
          }
        } catch (error) {
          console.error(error);
        }
}

async function playVideo(interaction , url) {
  const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
  const ytdl = require('youtube-dl-exec');
  const fixUrl = 'https://www.youtube.com/watch?v=' + url
  const voiceChannel = interaction.member.voice.channel;
  if (!voiceChannel) {
    return interaction.reply('You must be in a voice channel to use this command.');
  }
  try {
    // Join the user's voice channel
    const connection = joinVoiceChannel({
      channelId: interaction.member.voice.channel.id,
      guildId: interaction.message.guild.id,
      adapterCreator: interaction.message.channel.guild.voiceAdapterCreator,
    });
    const subprocess = ytdl(fixUrl, {
      dumpSingleJson: true,
      noWarnings: true,
      extractAudio: true,
      audioFormat: 'mp3',
      //audioQuality: 0,
      noCheckCertificate: true,
      preferFreeFormats: true,
      youtubeSkipDashManifest: true,
      referer: 'https://google.com'
    }).then(async output => {
      let resource = createAudioResource(output.url);
      console.log(output.url)
      const player = createAudioPlayer();
      player.stop()
      player.play(resource)
      connection.subscribe(player)
    }).catch(err => console.error(err));


    } catch (error) {
    console.log(error);
    interaction.reply('There was an error playing the video.');
  }
}



//await youtubeSearch();
//await interaction.reply(jsonResult);
  