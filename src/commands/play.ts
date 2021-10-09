import { Message, StageChannel, VoiceChannel, MessageEmbed } from "discord.js";
import { Command } from "./interfaces/Command";
import ytdl from "ytdl-core";
import { createAudioResource, createAudioPlayer, joinVoiceChannel, getVoiceConnection, VoiceConnection, PlayerSubscription, AudioResource, AudioPlayerStatus, AudioPlayer } from '@discordjs/voice';
import yts, { VideoSearchResult } from "yt-search";
import { queue } from "../queue/Queue";
import { fork, ChildProcess } from "child_process";

class Play implements Command {
    name: string;
    audioPlayer: AudioPlayer;
    private subscription: PlayerSubscription | undefined;
    private playing: boolean;
    private child: ChildProcess;
    private message: Message;

    constructor() {
        this.name = "play";
        this.audioPlayer = createAudioPlayer();
        this.playing = false;
        this.setupAudioPlayer();
        this.child = this.setupChild();
    }

    async execute(message: Message, args: string[]) {
        this.message = message;
        const voiceChannel = message.member?.voice.channel;
        if (!voiceChannel) { return message.channel.send("Get in a voice channel first, damn"); }
        if (!args.length) { return message.channel.send("Play what?"); }

        const connection = this.getVoiceConnection(voiceChannel);
        this.setSubscription(connection);
        this.child.send(args.join(' '));  
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
        const stream = ytdl(video.url, {quality: 'highestaudio', filter: 'audioonly'})
        queue.push(createAudioResource<yts.VideoSearchResult>(stream, {metadata: video}));
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

    private setupChild(): ChildProcess {
        const child: ChildProcess = fork("./dist/commands/children/play.js");
        child.on('message', (video: VideoSearchResult) => {
            console.log('Message from child', video.title);
            if (video && this.subscription) {
                this.addToQueue(video);
                this.sendMessage(video.title, video.thumbnail);
                if (!this.playing) { this.playFromQueue() }
            }
        });
        return child;
    }

    private sendMessage(title: string, thumbnail: string) {
        const status = this.playing ? "Queued " : "Now playing ";
        const message = status + `***${title}***`;
        const messageEmbed = new MessageEmbed()
            .setTitle(message)
            .setThumbnail(thumbnail)
        if (this.playing) { messageEmbed.addField("Estimated time until playing: ", queue.duration().toString()) }
        this.message.channel.send({ embeds: [messageEmbed] });
    }
}

const play = new Play();
export { play };