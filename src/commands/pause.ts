import { CommandInteraction, MessageEmbed } from "discord.js";
import { AudioUtil } from "../util/AudioUtil";
import { Command } from "./interfaces/Command";
import { SlashCommandDefinition } from "./interfaces/SlashCommand";

class Pause implements Command {
    private isPaused: boolean = false;
    name: string;
    description: string;
    slashCommandDefinition: SlashCommandDefinition;
    
    constructor() {
        this.name = "pause";
        this.description = "Pauses or unpauses the music"
        this.slashCommandDefinition = {
            name: this.name,
            description: this.description
        }
    }

    execute(interaction: CommandInteraction) {
        this.isPaused = !this.isPaused;
        this.isPaused ? AudioUtil.audioPlayer.pause() : AudioUtil.audioPlayer.unpause();
        const status = this.isPaused ? "PAUSED" : "UNPAUSED";
        const msgEmbed = new MessageEmbed()
            .setTitle(`BouqBash DJ is now ***${status}***`);
        interaction.reply({ embeds: [msgEmbed] })
    }
}

const pause = new Pause();
export { pause };