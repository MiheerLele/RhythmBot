import { 
    AudioPlayer,
    AudioPlayerError,
    AudioPlayerStatus,
    AudioResource,
    createAudioPlayer,
    createAudioResource,
    getVoiceConnection,
    joinVoiceChannel,
    PlayerSubscription 
} from "@discordjs/voice";
import { StageChannel, VoiceChannel } from "discord.js";
import yts from "yt-search";
import ytdl from "ytdl-core";
import { AutoPlayUtil } from "./AutoPlayUtil";
import { MessageAction, MessageUtil } from "./MessageUtil";
import { queue } from "./Queue";

export class AudioUtil {
    public static readonly audioPlayer: AudioPlayer = this.createAudioPlayer();
    private static playing: boolean = false;
    private static subscription: PlayerSubscription | undefined;
    private static bitrate: number // In kpbs

    public static setup(voiceChannel: VoiceChannel | StageChannel) {
        this.bitrate = voiceChannel.bitrate / 1000

        let connection = getVoiceConnection(voiceChannel.guild.id);
        if (!connection) {
            connection = joinVoiceChannel({ 
                channelId: voiceChannel.id, 
                guildId: voiceChannel.guild.id, 
                adapterCreator: voiceChannel.guild.voiceAdapterCreator
            });
        }

        if (!this.subscription) {
            this.subscription = connection.subscribe(this.audioPlayer);
        }
    }

    public static leave(voiceChannel: VoiceChannel | StageChannel) {
        this.subscription.unsubscribe();
        let connection = getVoiceConnection(voiceChannel.guild.id);
        connection.destroy();
    }

    public static isPlaying(): boolean {
        return this.playing; // this.audioPlayer.state.status === AudioPlayerStatus.Playing
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

    // Create audio player and setup events to handle
    private static createAudioPlayer(): AudioPlayer {
        const audioPlayer = createAudioPlayer();
        audioPlayer.on(AudioPlayerStatus.Idle, () => { this.onAudioPlayerIdle() })
        audioPlayer.on(AudioPlayerStatus.Playing, () => { this.onAudioPlayerPlaying() })
        audioPlayer.on('error', (error) => { this.onAudioPlayerError(error) })
        return audioPlayer;
    }

    private static onAudioPlayerIdle() {
        console.log("Idle");
        this.playing = false;
        if (queue.size() == 0 && AutoPlayUtil.isAutoPlaying()) {
            AutoPlayUtil.autoPlay();
        } else {
            this.play();
        }
    }

    private static onAudioPlayerPlaying() {
        this.playing = true;
        if (this.audioPlayer.state.status === AudioPlayerStatus.Playing) {
            const resource = this.audioPlayer.state.resource as AudioResource<yts.VideoSearchResult>;
            MessageUtil.send(MessageAction.PLAYING, resource.metadata);
        }
    }

    private static onAudioPlayerError(error: AudioPlayerError) {
        console.log(`Message: ${error.message}`);
        if (error.message === "Status code: 403") { // Error often solved by retrying
            const resource = error.resource as AudioResource<yts.VideoSearchResult>
            this.playResource(resource);
        } else {
            console.error(error);
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
            console.log("Retried");
            retResource = this.createAudioResource(resource.metadata);
            retries += 1;
        }
        return retResource;
    }

    private static playResource(resource: AudioResource<yts.VideoSearchResult>) {
        const newResource = this.retryResource(resource);
        AudioUtil.audioPlayer.play(newResource);
    }

    public static createAudioResource(video: yts.VideoSearchResult): AudioResource<yts.VideoSearchResult> {
        const stream = ytdl(video.url, {quality: 'highestaudio', filter: (format => {
            return format.audioBitrate <= this.bitrate // https://github.com/discordjs/discord.js/issues/5202
        })});
        
        return createAudioResource<yts.VideoSearchResult>(stream, {metadata: video});
    }
}