import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { Command } from "./structures/Command";
import { queue as songs } from "../util/Queue"

class Queue extends Command {

    execute(interaction: ChatInputCommandInteraction) {
        const embeds: EmbedBuilder[] = songs.list();
        embeds.length > 0 ? 
            interaction.reply({ embeds: embeds }) : 
            interaction.reply("Nothing in the queue, use /play");
    }
}

const queue = new Queue("queue", "Lists the next 10 songs in the queue");
export { queue };