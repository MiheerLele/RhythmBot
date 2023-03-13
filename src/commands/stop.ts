import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { Command } from "./structures/Command";
import { AutoPlayUtil } from "../util/AutoPlayUtil";
import { queue } from "../util/Queue";
import { AudioUtil } from "../util/AudioUtil";

class Stop extends Command {

    execute(interaction: ChatInputCommandInteraction) {
        AutoPlayUtil.stopAutoPlay();
        queue.clear();
        AudioUtil.stop();
        const msgEmbed = new EmbedBuilder()
            .setTitle(`Autoplay is now off and the queue is empty`);
        interaction.reply({ embeds: [msgEmbed] })
    }
}

const stop = new Stop("stop", "Stops the music, disables autoplay, and clears the queue");
export { stop };