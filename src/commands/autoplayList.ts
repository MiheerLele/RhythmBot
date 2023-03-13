import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { Command } from "./structures/Command";
import { AutoPlayUtil } from "../util/AutoPlayUtil";

class AutoplayList extends Command {

    execute(interaction: ChatInputCommandInteraction) {
        const artists = AutoPlayUtil.listArtists();
        if (artists.length > 0) {
            const msgEmbed = new EmbedBuilder()
                .setTitle("Artists in the autoplay rotation")
                .setDescription(artists.join("\n"));
            interaction.reply({ embeds: [msgEmbed] })
        } else {
            let message = "No artists in the autoplay rotation, use /play"
            if (!AutoPlayUtil.isAutoPlaying()) {
                message += " with /autoplay enabled"
            }
            interaction.reply(message);
        }
    }
}

const autoPlayList = new AutoplayList("autoplay-list", "Lists artists in the autoplay rotation");
export { autoPlayList };