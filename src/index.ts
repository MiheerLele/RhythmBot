import { Client, Intents } from "discord.js";
import dotenv from 'dotenv';
import { commands, commandNames } from './commands/index';

dotenv.config();
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});
const prefix = '!';


client.on("ready", () => {
    console.log("BouqBash DJ is online!");
})

client.on("messageCreate", message => {
    // console.log(message);
    if(!message.content.startsWith(prefix) || message.author.bot) { return; }

    const args = message.content.slice(prefix.length).split(/ +/);
    const userCommand: string = args.shift()!.toLowerCase();

    commands.forEach(command => {
        if (command.name === userCommand) {
            command.execute(message, args);
        }
    });
});

client.login(process.env.DISCORD_TOKEN);