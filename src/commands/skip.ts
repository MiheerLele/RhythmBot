import { CommandInteraction, MessageEmbed } from "discord.js";
import { Command } from "./interfaces/Command";
import { AudioUtil } from "../util/AudioUtil"; 
import { SlashCommandDefinition } from "./interfaces/SlashCommand";
import { AudioPlayerStatus, AudioResource } from "@discordjs/voice";
import yts from "yt-search";

class Skip implements Command {
    name: string;
    description: string;
    slashCommandDefinition: SlashCommandDefinition;

    constructor() {
        this.name = "skip";
        this.description = "Skips the currently playing song"
        this.slashCommandDefinition = {
            name: this.name,
            description: this.description
        }
    }

    execute(interaction: CommandInteraction) {
        const msgEmbed = new MessageEmbed();
            
        if (AudioUtil.audioPlayer.state.status === AudioPlayerStatus.Playing) {
            const resource = AudioUtil.audioPlayer.state.resource as AudioResource<yts.VideoSearchResult>;
            msgEmbed.setTitle(`Skipping ${resource.metadata.title}`)
            AudioUtil.audioPlayer.stop();
        } else {
            msgEmbed.setTitle("Nothing playing, nothing to skip")
        } 

        interaction.reply({embeds: [msgEmbed]})
    }
}

const skip = new Skip();
export { skip };