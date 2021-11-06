import { AudioPlayer, AudioPlayerStatus, AudioResource, createAudioPlayer, createAudioResource, getVoiceConnection, joinVoiceChannel, PlayerSubscription } from "@discordjs/voice";
import { StageChannel, VoiceChannel } from "discord.js";
import yts from "yt-search";
import ytdl from "ytdl-core";
import { AutoPlayUtil } from "./AutoPlayUtil";
import { MessageUtil } from "./MessageUtil";
import { queue } from "./Queue";

export class AudioUtil {
    public static readonly audioPlayer: AudioPlayer = this.createAudioPlayer();
    private static playing: boolean = false;
    private static subscription: PlayerSubscription | undefined;

    public static setup(voiceChannel: VoiceChannel | StageChannel) {
        let connection = getVoiceConnection(voiceChannel.guild.id);
        if (!connection) {
            connection = joinVoiceChannel({ channelId: voiceChannel.id, guildId: voiceChannel.guild.id, adapterCreator: voiceChannel.guild.voiceAdapterCreator });
        }

        if (!this.subscription) {
            this.subscription = connection.subscribe(this.audioPlayer);
        }
    }

    public static isPlaying(): boolean {
        return this.playing;
    }

    public static getRemainingPlayback(): number {
        if (this.audioPlayer.state.status === AudioPlayerStatus.Playing) {
            const resource = this.audioPlayer.state.resource as AudioResource<yts.VideoSearchResult>;
            const songLen = resource.metadata.seconds * 1000;
            // Song duration - the number of millis the resource has been playing for
            return songLen - this.audioPlayer.state.playbackDuration;
        }
        return 0;
    }

    // public static getCurrentArtist(): string{
    //     if (this.audioPlayer.state.status === AudioPlayerStatus.Playing) {
    //         const resource = this.audioPlayer.state.resource as AudioResource<yts.VideoSearchResult>;
    //         const [artist, title] = getArtistTitle(resource.metadata.title, { defaultArtist: resource.metadata.author.name });
    //         return artist;
    //     }
    //     return "";
    // }

    // Create audio player and setup events to handle
    private static createAudioPlayer(): AudioPlayer {
        const audioPlayer = createAudioPlayer();
        audioPlayer.on(AudioPlayerStatus.Idle, () => {
            console.log("Idle");
            this.onAudioPlayerIdle();
        })
        audioPlayer.on(AudioPlayerStatus.Playing, () => {
            this.playing = true;
        })
        audioPlayer.on('error', (error) => {
            console.error(error);
            console.error(error.name);
            console.error(error.message);
            if (error.message === "Status code: 403") {
                const resource = error.resource as AudioResource<yts.VideoSearchResult>
                this.playResource(resource);
            }
        })
        return audioPlayer;
    }

    private static onAudioPlayerIdle() {
        this.playing = false;
        if (queue.size() == 0 && AutoPlayUtil.isAutoPlaying()) {
            AutoPlayUtil.autoPlay();
        } else {
            this.play();
        }
    }

    public static play() {
        let resource: AudioResource<yts.VideoSearchResult> | undefined = queue.pop();
        if (resource) {
            this.playResource(resource);
        }
    }

    private static retryResource(resource: AudioResource<yts.VideoSearchResult>): AudioResource<yts.VideoSearchResult> {
        const RETRY_LIMIT = 3;
        let retries = 0;
        let retResource = resource;
        while (retries < RETRY_LIMIT && (retResource.playStream.readableEnded || retResource.playStream.destroyed)) {
            console.log("Retried:");
            console.log(retResource);
            const stream = ytdl(retResource.metadata.url, {quality: 'highestaudio', filter: 'audioonly'});
            retResource = createAudioResource<yts.VideoSearchResult>(stream, {metadata: retResource.metadata});
            retries += 1;
        }
        return retResource;
    }

    private static playResource(resource: AudioResource<yts.VideoSearchResult>) {
        this.retryResource(resource);
        MessageUtil.sendPlaying(resource.metadata);
        AudioUtil.audioPlayer.play(resource);
    }
}