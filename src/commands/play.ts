import { Message, StageChannel, VoiceChannel, MessageEmbed } from "discord.js";
import { Command } from "./interfaces/Command";
import ytdl from "ytdl-core";
import { createAudioResource, createAudioPlayer, joinVoiceChannel, getVoiceConnection, VoiceConnection, PlayerSubscription, AudioResource, AudioPlayerStatus, AudioPlayer } from '@discordjs/voice';
import yts, { VideoSearchResult } from "yt-search";
import { queue } from "../util/Queue";
import { fork, ChildProcess } from "child_process";
import { AudioUtil } from "../util/AudioUtil";

class Play implements Command {
    name: string;
    private child: ChildProcess;
    private message: Message;

    constructor() {
        this.name = "play";
        this.child = this.setupChild();
    }

    execute(message: Message, args: string[]) {
        this.message = message;
        const voiceChannel = message.member?.voice.channel;
        if (!voiceChannel) { return message.channel.send("Get in a voice channel first, damn"); }
        if (!args.length) { return message.channel.send("Play what?"); }

        AudioUtil.setup(voiceChannel);
        this.child.send(args.join(' '));  
    }

    private setupChild(): ChildProcess {
        const child: ChildProcess = fork("./dist/commands/children/play.js");
        child.on('message', (video: VideoSearchResult) => {
            console.log('Message from child', video.title);
            // AudioUtil.subscription has a chance of being undefined here
            if (video) {
                queue.add(video);
                this.sendMessage(video.title, video.thumbnail);
                if (!AudioUtil.playing) { queue.play() }
            }
        });
        return child;
    }

    private sendMessage(title: string, thumbnail: string) {
        const status = AudioUtil.playing ? "Queued " : "Now playing ";
        const message = status + `***${title}***`;
        const messageEmbed = new MessageEmbed()
            .setTitle(message)
            .setThumbnail(thumbnail)
        if (AudioUtil.playing) { messageEmbed.addField("Estimated time until playing: ", queue.duration().toString()) }
        this.message.channel.send({ embeds: [messageEmbed] });
    }
}

const play = new Play();
export { play };