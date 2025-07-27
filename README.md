
# 📺 Vivy: Your Charming YouTube Discord Bot

<img align="right" src="https://i.imgur.com/IlgJNak.png" height="200" width="200">
Vivy is a lightweight, yet powerful YouTube Discord bot designed to enhance your music listening experience while keeping things simple and easy to use. It's perfect for small to medium-sized servers that want a basic yet reliable YouTube music bot.
<br></br>
<br></br>


## 🎬 Features:

⚙️ **Simple Setup:** Vivy is quick and easy to set up, with clear instructions to get you started in no time.
💥 **Lightweight & Fast:** Vivy comes with only the essential features needed for a YouTube Discord bot, ensuring minimal lag and resource usage.

## 🛠️ Getting Started:

1. **Install** ffmpeg and the required dependencies listed in the `package.json` file using npm (`npm install`).
2. **Rename** the `config.json.remove` file to `config.json`.
3. **Fill in** your bot's **token**, **clientID**, and **guildID** in their respective fields within the `config.json` file. You can get these keys from your Discord's developer portal.
4. **Register** your bot's slash commands with `node register_commands.js`.
5. **Download** the yt-dlp binary corresponding to your system from [the official repository](https://github.com/yt-dlp/yt-dlp) and place it in the root of the project directory.
6. **Run** the bot with `node index.js`.

## 🎧 How to Use Vivy:

Vivy currently supports the following commands to control your music playback:

- `/search [keyword]`: Search for YouTube videos using the provided keyword. You can make a selection from the drop-down menu. Once you've made a selection, the track will start playing.
- `/stop`: Stop the current music playback immediately.
- `/pause`: Pause the current music playback immediately.
- `/resume`: Resume the current music playback immediately.


**Note:** Vivy does not currently support queueing. This feature might be added in future updates based on user feedback and demand.

## 🌟 Support Vivy:

If you enjoy using Vivy, please consider supporting its development by starring this repository, leaving a review, or making suggestions for new features!

❤️ **Happy listening!**

[![Stargazers](https://img.shields.io/github/stars/CosmicEventHorizon/vivy_discord.svg?style=social&label=Star)](https://github.com/CosmicEventHorizon/vivy_discord)
[![Issues](https://img.shields.io/github/issues/CosmicEventHorizon/vivy_discord.svg)](https://github.com/CosmicEventHorizon/vivy_discord/issues)
