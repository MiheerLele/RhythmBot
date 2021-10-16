import { Message, MessageEmbed } from "discord.js";
import yts from "yt-search";
import { AudioUtil } from "./AudioUtil";
import { queue } from "./Queue";
import moment from 'moment';

export class MessageUtil {
    private static message: Message;

    public static setMessage(message: Message) {
        this.message = message;
    }

    public static sendPlaying(video: yts.VideoSearchResult) {
        if (!this.message) { return }

        const status = "Now playing ";
        const msgEmbed: MessageEmbed = this.getMessageEmbed(status, video);
        this.message.channel.send({ embeds: [msgEmbed] });
    }

    public static sendQueued(video: yts.VideoSearchResult) {
        if (!this.message) { return }

        const status = "Queued ";
        const msgEmbed: MessageEmbed = this.getMessageEmbed(status, video);
        // This function will execute before the queue is incremented
        // making the queue duration + current playing resource the estimated time until playing
        const timeUntilPlay = AudioUtil.getRemainingPlayback() + queue.duration();
        msgEmbed.addField("Estimated time until playing: ", moment.duration(timeUntilPlay).humanize())
        this.message.channel.send({ embeds: [msgEmbed] });
    }

    private static getMessageEmbed(status: string, video: yts.VideoSearchResult): MessageEmbed {
        const msg = status + `***${video.title}***`;
        const msgEmbed = new MessageEmbed()
            .setTitle(msg)
            .setThumbnail(video.thumbnail)
        return msgEmbed;
    }
}