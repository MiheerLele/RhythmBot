import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { Command } from "./structures/Command";
import { queue } from "../util/Queue";
import { MessageAction, MessageUtil } from "../util/MessageUtil";

class Remove extends Command {

    constructor(name: string, description: string) {
        super(name, description);
        this.slashCommand.addIntegerOption((option) => {
            return option
                .setName("position")
                .setDescription("The queue position of the song you want to remove")
                .setRequired(true)
        });
    }

    execute(interaction: ChatInputCommandInteraction) {
        let index = interaction.options.getInteger("position")
        // 1 index numbering to 0 index numbering
        index = index - 1;
        if (index >= 0 && index < queue.size()) {
            const removedVid = queue.remove(index);
            MessageUtil.send(MessageAction.REMOVED, removedVid, interaction);
        } else {
            const embed = new EmbedBuilder()
                .setTitle(`Not a valid song. ***${queue.size()}*** songs in the queue`);
            interaction.reply({ embeds: [embed] });
        }
    }
}

const remove = new Remove("remove", "Removes a song from the queue");
export { remove };