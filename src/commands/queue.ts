import { CommandInteraction, MessageEmbed } from "discord.js";
import { Command } from "./interfaces/Command";
import { queue as songs } from "../util/Queue"
import { SlashCommandDefinition } from "./interfaces/SlashCommand";

class Queue implements Command {
    name: string;
    description: string;
    slashCommandDefinition: SlashCommandDefinition

    constructor() {
        this.name = "queue";
        this.description = "Lists the next 10 songs in the queue"
        this.slashCommandDefinition = {
            name: this.name,
            description: this.description
        }
    }

    execute(interaction: CommandInteraction) {
        const embeds: MessageEmbed[] = songs.list();
        embeds.length > 0 ? 
            interaction.reply({ embeds: embeds }) : 
            interaction.reply("Nothing in the queue, use /play");
    }
}

const queue = new Queue();
export { queue };