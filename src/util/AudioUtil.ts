import { 
    AudioPlayer,
    AudioPlayerError,
    AudioPlayerPlayingState,
    AudioPlayerStatus,
    AudioResource,
    createAudioPlayer,
    createAudioResource,
    DiscordGatewayAdapterCreator,
    getVoiceConnection,
    joinVoiceChannel,
    PlayerSubscription, 
    VoiceConnection
} from "@discordjs/voice";
import { StageChannel, VoiceChannel } from "discord.js";
import yts from "yt-search";
import ytdl from "ytdl-core";
import { AutoPlayUtil } from "./AutoPlayUtil";
import { MessageAction, MessageUtil } from "./MessageUtil";
import { queue } from "./Queue";

export class AudioUtil {
    private static readonly audioPlayer: AudioPlayer = this.createAudioPlayer();
    private static subscription: PlayerSubscription | undefined;
    private static connection: VoiceConnection | undefined;
    private static bitrate: number // In kpbs

    public static setup(voiceChannel: VoiceChannel | StageChannel) {
        this.bitrate = voiceChannel.bitrate / 1000

        this.connection = getVoiceConnection(voiceChannel.guild.id);
        if (!this.connection) {
            this.connection = joinVoiceChannel({ 
                channelId: voiceChannel.id, 
                guildId: voiceChannel.guild.id, 
                adapterCreator: voiceChannel.guild.voiceAdapterCreator as unknown as DiscordGatewayAdapterCreator

            });
        }

        if (!this.subscription) {
            this.subscription = this.connection.subscribe(this.audioPlayer);
        }
    }

    public static disconnect() {
        this.subscription.unsubscribe();
        this.connection.destroy();
    }

    public static isPlaying(): boolean {
        return this.audioPlayer.state.status === AudioPlayerStatus.Playing
    }

    public static pause() {
        this.audioPlayer.pause()
    }

    public static unpause() {
        this.audioPlayer.unpause()
    }

    public static stop() {
        this.audioPlayer.stop()
    }

    public static getCurrentlyPlayingVideo(): yts.VideoSearchResult | null {
        if (this.isPlaying()) {
            const state = this.audioPlayer.state as AudioPlayerPlayingState
            const resource = state.resource as AudioResource<yts.VideoSearchResult>;
            return resource.metadata
        } else {
            return null
        }
    }

    public static getRemainingPlayback(): number {
        const video = this.getCurrentlyPlayingVideo()
        if (video) {
            const songLen = video.seconds * 1000;
            const state = this.audioPlayer.state as AudioPlayerPlayingState
            // Song duration - the number of millis the resource has been playing for
            return songLen - state.playbackDuration;
        } else {
            return 0
        }
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
        if (queue.size() == 0 && AutoPlayUtil.isAutoPlaying()) {
            AutoPlayUtil.autoPlay();
        } else {
            this.play();
        }
    }

    private static onAudioPlayerPlaying() {
        const video = this.getCurrentlyPlayingVideo();
        AutoPlayUtil.addArtist(video);
        MessageUtil.send(MessageAction.PLAYING, video);
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

    private static buildResource(resource: AudioResource<yts.VideoSearchResult>): AudioResource<yts.VideoSearchResult> {
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
        const newResource = this.buildResource(resource);
        this.audioPlayer.play(newResource);
    }

    public static createAudioResource(video: yts.VideoSearchResult): AudioResource<yts.VideoSearchResult> {
        const stream = ytdl(video.url, {quality: 'highestaudio', filter: (format => {
            return format.audioBitrate <= this.bitrate // https://github.com/discordjs/discord.js/issues/5202
        })});
        
        return createAudioResource<yts.VideoSearchResult>(stream, {metadata: video});
    }
}