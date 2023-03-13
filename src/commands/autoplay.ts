import { CommandInteraction, EmbedBuilder } from "discord.js";
import { Command } from "./structures/Command";
import { AutoPlayUtil } from "../util/AutoPlayUtil";

class Autoplay extends Command {

    execute(interaction: CommandInteraction) {
        AutoPlayUtil.toggleAutoPlay();
        const status = AutoPlayUtil.isAutoPlaying() ? "ON" : "OFF";
        const msgEmbed = new EmbedBuilder()
            .setTitle(`Autoplay is now ***${status}***`);
        interaction.reply({ embeds: [msgEmbed] })
    }
}

const autoplay = new Autoplay("autoplay", "Toggles autoplay");
export { autoplay };