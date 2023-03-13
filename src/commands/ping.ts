import { ChatInputCommandInteraction } from "discord.js";
import { Command } from "./structures/Command";

class Ping extends Command {

    execute(interaction: ChatInputCommandInteraction) {
        interaction.reply("pong");
    }
}

const ping = new Ping("ping", "Pongs!");
export { ping };