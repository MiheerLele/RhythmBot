import { CommandInteraction, MessageEmbed } from "discord.js";
import { Command } from "./interfaces/Command";
import { AutoPlayUtil } from "../util/AutoPlayUtil";
import { queue } from "../util/Queue";
import { AudioUtil } from "../util/AudioUtil";
import { SlashCommandDefinition } from "./interfaces/SlashCommand";

class Stop implements Command {
    name: string;
    description: string;
    slashCommandDefinition: SlashCommandDefinition;

    constructor() {
        this.name = "stop";
        this.description = "Stops the music, disables autoplay, and clears the queue"
        this.slashCommandDefinition = {
            name: this.name,
            description: this.description
        }
    }

    execute(interaction: CommandInteraction) {
        AutoPlayUtil.stopAutoPlay();
        queue.clear();
        AudioUtil.stop();
        const msgEmbed = new MessageEmbed()
            .setTitle(`Autoplay is now off and the queue is empty`);
        interaction.reply({ embeds: [msgEmbed] })
    }
}

const stop = new Stop();
export { stop };