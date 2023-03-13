import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { AudioUtil } from "../util/AudioUtil";
import { Command } from "./structures/Command";

class Pause extends Command {
    private isPaused: boolean = false;

    execute(interaction: ChatInputCommandInteraction) {
        this.isPaused = !this.isPaused;
        this.isPaused ? AudioUtil.pause() : AudioUtil.unpause();
        const status = this.isPaused ? "PAUSED" : "UNPAUSED";
        const msgEmbed = new EmbedBuilder()
            .setTitle(`BouqBash DJ is now ***${status}***`);
        interaction.reply({ embeds: [msgEmbed] })
    }
}

const pause = new Pause("pause", "Pauses or unpauses the music");
export { pause };