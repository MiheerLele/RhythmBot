import { Message, StageChannel, VoiceChannel } from "discord.js";
import { Command } from "./interfaces/Command";
import ytdl from "ytdl-core";
import { createAudioResource, createAudioPlayer, joinVoiceChannel, getVoiceConnection, VoiceConnection } from '@discordjs/voice';
import yts from "yt-search";

const audioPlayer = createAudioPlayer(); 

class Play implements Command {
    name: string;

    constructor() {
        this.name = "play";
    }

    async execute(message: Message, args: string[]) {
        const voiceChannel = message.member?.voice.channel;
        if (!voiceChannel) { return message.channel.send("Get in a voice channel first, damn"); }
        if (!args.length) { return message.channel.send("Play what?"); }

        const connection = this.getVoiceConnection(voiceChannel);
        const subscription = connection.subscribe(audioPlayer);

        const video = await this.findVideo(args.join(' '));
        if (video && subscription) {
            message.channel.send(`Now playing ***${video.title}***`)
            const stream = ytdl(video.url, {filter: 'audioonly'})
            audioPlayer.play(createAudioResource(stream));
        }

    }

    async findVideo(query: string): Promise<yts.VideoSearchResult | null> {
        const videoResult = await yts(query);
        return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
    }

    getVoiceConnection(voiceChannel: VoiceChannel | StageChannel): VoiceConnection {
        let connection = getVoiceConnection(voiceChannel.guild.id);
        if (!connection) {
            connection = joinVoiceChannel({ channelId: voiceChannel.id, guildId: voiceChannel.guild.id, adapterCreator: voiceChannel.guild.voiceAdapterCreator });
        }
        return connection;
    }
}

const play = new Play();
export { play };