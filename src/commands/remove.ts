import { CommandInteraction } from "discord.js";
import { Command } from "./interfaces/Command";
import { queue } from "../util/Queue";
import { MessageUtil } from "../util/MessageUtil";
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
        MessageUtil.setMessage(interaction);
        let index = interaction.options.getInteger("position")
        // Translate human numbering to computer numbering with index - 1
        index = index - 1;
        if (index >= 0 && index < queue.size()) {
            queue.remove(index);
        } else {
            interaction.reply(`Not a valid song. ${queue.size()} songs in the queue`);
        }
    }
}

const remove = new Remove();
export { remove };