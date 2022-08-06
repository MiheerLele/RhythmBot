import { CommandInteraction, Message, MessageEmbed } from "discord.js";
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
    private static interaction: CommandInteraction;

    public static setMessage(interaction: CommandInteraction) {
        this.interaction = interaction;
    }

    public static sendPlaying(video: yts.VideoSearchResult) {
        if (!this.interaction) { return }

        const action = MessageAction.PLAYING
        const msgEmbed: MessageEmbed = this.buildBaseEmbed(action, video);
        this.interaction.channel.send({ embeds: [msgEmbed] });
    }

    public static sendQueued(video: yts.VideoSearchResult) {
        if (!this.interaction) { return }

        const action = MessageAction.QUEUED;
        const msgEmbed: MessageEmbed = this.buildBaseEmbed(action, video);
        // This function should execute before the queue is incremented
        // making the queue duration + current playing resource the estimated time until playing
        const timeUntilPlay = AudioUtil.getRemainingPlayback() + queue.duration();
        msgEmbed.addField("Estimated time until playing: ", moment.duration(timeUntilPlay).humanize())
        this.interaction.channel.send({ embeds: [msgEmbed] });
    }

    // public static sendRemoved(video: yts.VideoSearchResult) {
    //     if (!this.interaction) { return }

    //     const action = MessageAction.REMOVED;
    //     const msgEmbed: MessageEmbed = this.buildBaseEmbed(action, video);
    //     this.interaction.channel.send({ embeds: [msgEmbed] });
    // }

    public static buildEmbed(action: MessageAction, video: yts.VideoSearchResult): MessageEmbed {
        let embed = this.buildBaseEmbed(action, video)
        if (action === MessageAction.QUEUED) {
            const timeUntilPlay = AudioUtil.getRemainingPlayback() + queue.duration();
            embed.addField("Estimated time until playing: ", moment.duration(timeUntilPlay).humanize())
        }
        return embed
    }

    private static buildBaseEmbed(action: MessageAction, video: yts.VideoSearchResult): MessageEmbed {
        const msg = action + ` ***${video.title}***`;
        const msgEmbed = new MessageEmbed()
            .setTitle(msg)
            .setThumbnail(video.thumbnail)
        return msgEmbed;
    }
}