import { CommandInteraction, MessageEmbed } from "discord.js";
import { Command } from "./interfaces/Command";
import { AutoPlayUtil } from "../util/AutoPlayUtil";
import { SlashCommandDefinition } from "./interfaces/SlashCommand";

class Autoplay implements Command {
    name: string;
    description: string;
    slashCommandDefinition: SlashCommandDefinition;

    constructor() {
        this.name = "autoplay";
        this.description = "Toggles autoplay"
        this.slashCommandDefinition = {
            name: this.name,
            description: this.description
        }
    }

    execute(interaction: CommandInteraction) {
        AutoPlayUtil.toggleAutoPlay();
        const status = AutoPlayUtil.isAutoPlaying() ? "ON" : "OFF";
        const msgEmbed = new MessageEmbed()
            .setTitle(`Autoplay is now ***${status}***`);
        interaction.reply({ embeds: [msgEmbed] })
    }
}

const autoplay = new Autoplay();
export { autoplay };