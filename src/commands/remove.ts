import { CommandInteraction, MessageEmbed } from "discord.js";
import { Command } from "./interfaces/Command";
import { queue } from "../util/Queue";
import { MessageAction, MessageUtil } from "../util/MessageUtil";
import { OptionType, SlashCommandDefinition } from "./interfaces/SlashCommand";

class Remove implements Command {
    name: string;
    description: string;
    slashCommandDefinition: SlashCommandDefinition;

    constructor() {
        this.name = "remove";
        this.description = "Removes a song from the queue"
        this.slashCommandDefinition = {
            name: this.name,
            description: this.description,
            options: [{
                name: "position",
                description: "The queue position of the song you want to remove",
                type: OptionType.INTEGER,
                required: true
            }]
        }
    }

    execute(interaction: CommandInteraction) {
        let index = interaction.options.getInteger("position")
        // 1 index numbering to 0 index numbering
        index = index - 1;
        if (index >= 0 && index < queue.size()) {
            const removedVid = queue.remove(index);
            MessageUtil.send(MessageAction.REMOVED, removedVid, interaction);
        } else {
            const embed = new MessageEmbed()
                .setTitle(`Not a valid song. ***${queue.size()}*** songs in the queue`);
            interaction.reply({ embeds: [embed] });
        }
    }
}

const remove = new Remove();
export { remove };