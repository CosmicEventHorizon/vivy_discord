/** Imports **/

//import classes from discord.js
const { REST, Routes, SlashCommandBuilder } = require('discord.js');
//import required tokens from config.json
const config = require("./config.json");

//create a REST object using given tokens
const rest = new REST({ version: '10' }).setToken(config.token);

//a list of commands ro be registered
const commands = [
    new SlashCommandBuilder()
    .setName('search')
    .setDescription('Search Youtube for video')
    .addStringOption(option =>
        option.setName('keyword')
    .setDescription('The keyword to search')
    .setRequired(true)), 
    {
        name:'pause',
        description: 'Pause current track'
    },
    {
        name:'resume',
        description: 'Resume current track' 
    },
    {
        name: 'stop',
        description: 'Stop current track'
    },
];


async function main() {
    try {
        console.log('Started refreshing application (/) commands.');
        
        //register commands using our rest object and commands list
        await rest.put(Routes.applicationCommands(config.clientId), { body: commands });

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
}

main()