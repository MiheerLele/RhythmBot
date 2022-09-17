import { CommandInteraction, MessageEmbed, TextBasedChannels } from "discord.js";
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
    private static channel: TextBasedChannels;

    public static setChannel(interaction: CommandInteraction) {
        this.channel = interaction.channel;
    }

    public static send(action: MessageAction, video: yts.VideoSearchResult, interaction?: CommandInteraction) {
        let embed = this.buildBaseEmbed(action, video)
        if (action === MessageAction.QUEUED) {
            const timeUntilPlay = AudioUtil.getRemainingPlayback() + queue.duration();
            embed.addField("Estimated time until playing: ", moment.duration(timeUntilPlay).humanize())
        }

        if (interaction) {
            interaction.reply({ embeds: [embed] });
        } else {
            this.channel.send({ embeds: [embed] });
        }
    }

    private static buildBaseEmbed(action: MessageAction, video: yts.VideoSearchResult): MessageEmbed {
        const msg = action + ` ***${video.title}***`;
        const msgEmbed = new MessageEmbed()
            .setTitle(msg)
            .setThumbnail(video.thumbnail)
        return msgEmbed;
    }
}