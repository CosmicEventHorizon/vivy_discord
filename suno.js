const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, 
  ActionRowBuilder, SlashCommandBuilder } = require('discord.js');
const youtubesearchapi = require("youtube-search-api");
let jsonResult = '';
const titleArray = [];
const idArray = [];
const optionsArray = [];
let player = null;




module.exports = {
  playVideo,
};


async function playVideo(interaction) {
  const { joinVoiceChannel, createAudioPlayer, createAudioResource, StreamType } = require('@discordjs/voice');
  const ytdl = require('youtube-dl-exec')
  const voiceChannel = interaction.member.voice.channel;
  const { createReadStream } = require('node:fs');
  const { join } = require('node:path');
  let subprocess = null;
  if (!voiceChannel) {
    const voiceError = "error"
    return voiceError
  } else {
    try {
      console.log(interaction);	
      const connection = joinVoiceChannel({
        channelId: interaction.member.voice.channel.id,
        guildId: interaction.member.guild.id,
        adapterCreator: interaction.member.guild.voiceAdapterCreator,
      });
      player = createAudioPlayer();
      const resource = createAudioResource('/home/anon/Documents/Personal/vivy_discord/hoshi.mp3');
      //console.log(subprocess)
      player.stop()
      player.play(resource)
      connection.subscribe(player)
      return [player];
      } catch (error) {
      console.log(error);
      interaction.reply('There was an error playing the video.');
    }
  }
}


