import { Message, StageChannel, VoiceChannel } from "discord.js";
import { Command } from "./interfaces/Command";
import ytdl from "ytdl-core";
import { createAudioResource, createAudioPlayer, joinVoiceChannel, getVoiceConnection, VoiceConnection, PlayerSubscription, AudioResource, AudioPlayerStatus, AudioPlayer } from '@discordjs/voice';
import yts from "yt-search";
import { queue } from "../queue/Queue";

class Play implements Command {
    name: string;
    audioPlayer: AudioPlayer;
    private subscription: PlayerSubscription | undefined;
    private playing: boolean;

    constructor() {
        this.name = "play";
        this.audioPlayer = createAudioPlayer();
        this.playing = false;
        this.setupAudioPlayer();
    }

    async execute(message: Message, args: string[]) {
        const voiceChannel = message.member?.voice.channel;
        if (!voiceChannel) { return message.channel.send("Get in a voice channel first, damn"); }
        if (!args.length) { return message.channel.send("Play what?"); }

        const connection = this.getVoiceConnection(voiceChannel);
        this.setSubscription(connection);
        
        // Drop this into a thread maybe?
        const video = await this.findVideo(args.join(' '))
        if (video && this.subscription) {
            if (this.playing) {
                message.channel.send(`Queued ***${video.title}***`);
                this.addToQueue(video);
            } else {
                message.channel.send(`Now playing ***${video.title}***`);
                this.addToQueue(video);
                this.playFromQueue();
            }
        }
    }

    private async findVideo(query: string): Promise<yts.VideoSearchResult | null> {
        const videoResult = await yts(query);
        return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
    }

    private getVoiceConnection(voiceChannel: VoiceChannel | StageChannel): VoiceConnection {
        let connection = getVoiceConnection(voiceChannel.guild.id);
        if (!connection) {
            connection = joinVoiceChannel({ channelId: voiceChannel.id, guildId: voiceChannel.guild.id, adapterCreator: voiceChannel.guild.voiceAdapterCreator });
        }
        return connection;
    }

    private setSubscription(connection: VoiceConnection): void {
        if (!this.subscription) {
            this.subscription = connection.subscribe(this.audioPlayer);
        }
    }

    private addToQueue(video: yts.VideoSearchResult): void {
        const stream = ytdl(video.url, {filter: 'audioonly'})
        queue.push(createAudioResource(stream));
    }

    private playFromQueue() {
        const resource: AudioResource | undefined = queue.pop();
        if (resource) {
            this.audioPlayer.play(resource);
        }
    }

    private setupAudioPlayer() {
        this.audioPlayer.on(AudioPlayerStatus.Idle, () => {
            this.playing = false;
            this.playFromQueue();
        })
        this.audioPlayer.on(AudioPlayerStatus.Playing, () => {
            this.playing = true;
        })
        this.audioPlayer.on('error', (error) => {
            console.error(error);
        })
    }
}

const play = new Play();
export { play };