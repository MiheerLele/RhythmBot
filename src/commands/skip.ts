import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { Command } from "./structures/Command";
import { AudioUtil } from "../util/AudioUtil"; 

class Skip extends Command {

    execute(interaction: ChatInputCommandInteraction) {
        const msgEmbed = new EmbedBuilder();
            
        if (AudioUtil.isPlaying()) {
            const video = AudioUtil.getCurrentlyPlayingVideo();
            msgEmbed.setTitle(`Skipping ${video.title}`)
            AudioUtil.stop();
        } else {
            msgEmbed.setTitle("Nothing playing, nothing to skip")
        } 

        interaction.reply({embeds: [msgEmbed]})
    }
}

const skip = new Skip("skip", "Skips the currently playing song");
export { skip };