import { Client, Intents } from "discord.js";
import dotenv from 'dotenv';
import { commands } from './commands/index';
import { AudioUtil } from "./util/AudioUtil";
import { MessageUtil } from "./util/MessageUtil";

dotenv.config();
global.AbortController = require("node-abort-controller").AbortController;
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES]});
const prefix = '!';

client.on("ready", () => {
    console.log("BouqBash DJ is online!");
})

client.on("messageCreate", async message => {
    if(!message.content.startsWith(prefix) || message.author.bot) { return; }

    const args = message.content.slice(prefix.length).split(/ +/);
    const userCommand: string = args.shift()!.toLowerCase();

    message.channel.send(`Big changes, use /${userCommand} instead`);
});


client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    for (const command of commands) {
        if (command.name === commandName) {
            MessageUtil.setChannel(interaction);
            command.execute(interaction);
            return;
        }
    }

    interaction.reply(`No command found, blame ${interaction.user}`)
})


client.on("voiceStateUpdate", (oldState, newState) => {

    // if nobody left the channel in question, return.
    if (oldState.channelId !== oldState.guild.me.voice.channelId || newState.channel)
      return;
  
    // Just the bot
    if (oldState.channel.members.size == 1) {
        AudioUtil.leave(oldState.channel);
        process.exit(0);
    }
});

client.login(process.env.DISCORD_TOKEN);