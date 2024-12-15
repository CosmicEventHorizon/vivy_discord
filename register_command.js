const { REST, Routes, SlashCommandBuilder } = require('discord.js');
const config = require("./config.json");

const searchCommand = new SlashCommandBuilder()
.setName('search')
.setDescription('Search Youtube for video')
.addStringOption(option =>
option.setName('keyword')
.setDescription('The keyword to search')
.setRequired(true));


const commands = [
    searchCommand, {
        name: 'stop',
        description: 'Stop current track'
    }, {
    	name: 'suno',
        description: 'play AI music'
    },
];

const rest = new REST({ version: '10' }).setToken(config.token);

async function main() {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(Routes.applicationCommands(config.clientId), { body: commands });

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
}

main()
