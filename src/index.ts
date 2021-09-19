import { Client, Intents } from "discord.js";
import dotenv from 'dotenv';
import { commands } from './commands/index';

dotenv.config();
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES]});
const prefix = '!';


client.on("ready", () => {
    console.log("BouqBash DJ is online!");
})

client.on("messageCreate", async message => {
    if(!message.content.startsWith(prefix) || message.author.bot) { return; }

    const args = message.content.slice(prefix.length).split(/ +/);
    const userCommand: string = args.shift()!.toLowerCase();

    for (const command of commands) {
        if (command.name === userCommand) {
            await command.execute(message, args);
            return;
        }
    }

    message.channel.send("No command found, blame Garrett");
});

client.login(process.env.DISCORD_TOKEN);