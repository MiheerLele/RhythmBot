import { Client, Events, IntentsBitField } from "discord.js";
import dotenv from 'dotenv';
import { commands } from './commands/index';
import { AudioUtil } from "./util/AudioUtil";
import { MessageUtil } from "./util/MessageUtil";

dotenv.config();
global.AbortController = require("node-abort-controller").AbortController;
const client = new Client({ intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.GuildVoiceStates]});

client.on(Events.ClientReady, () => {
    console.log("BouqBash DJ is online!");
})


client.on(Events.InteractionCreate, async (interaction) => {
    // Checks to make sure the interaction is a text based, slash command
    if (!interaction.isChatInputCommand()) return;

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

client.on(Events.VoiceStateUpdate, (oldState, newState) => {

    // if nobody left the channel in question, return.
    if (oldState.channelId !== oldState.guild.members.me.voice.channelId || newState.channel)
      return;
  
    // Just the bot left in the channel
    if (oldState.channel.members.size == 1) {
        AudioUtil.disconnect();
        process.exit(0);
    }
});

client.login(process.env.DISCORD_TOKEN);