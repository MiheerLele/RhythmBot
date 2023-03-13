import { CommandInteraction, EmbedBuilder, TextBasedChannel } from "discord.js";
import yts from "yt-search";
import { AudioUtil } from "./AudioUtil";
import { queue } from "./Queue";
import moment from 'moment';

export enum MessageAction {
    PLAYING = "Now playing",
    QUEUED = "Queued",
    REMOVED = "Removed"
}

export class MessageUtil {
    private static channel: TextBasedChannel;

    public static setChannel(interaction: CommandInteraction) {
        this.channel = interaction.channel;
    }

    public static send(action: MessageAction, video: yts.VideoSearchResult, interaction?: CommandInteraction) {
        let embed = this.buildBaseEmbed(action, video)
        if (action === MessageAction.QUEUED) {
            const timeUntilPlay = AudioUtil.getRemainingPlayback() + queue.duration();
            embed.addFields({
                name: "Estimated time until playing: ", 
                value: moment.duration(timeUntilPlay).humanize()
            })
        }

        interaction ? interaction.reply({ embeds: [embed] }) : this.channel.send({ embeds: [embed] });
    }

    private static buildBaseEmbed(action: MessageAction, video: yts.VideoSearchResult): EmbedBuilder {
        const msg = action + ` ***${video.title}***`;
        const msgEmbed = new EmbedBuilder()
            .setTitle(msg)
            .setThumbnail(video.thumbnail)
        return msgEmbed;
    }
}