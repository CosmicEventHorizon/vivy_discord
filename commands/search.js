const { SlashCommandBuilder } = require('discord.js');
const youtubesearchapi = require("youtube-search-api");
let jsonResult = '';



module.exports = {
	data: new SlashCommandBuilder()
		.setName('search')
		.setDescription('Search Youtube for video'),
	async execute(interaction) {
		await youtubeSearch();
		await interaction.reply(jsonResult);
	},
};

    
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
    