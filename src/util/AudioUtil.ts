import { AudioPlayer, AudioPlayerPlayingState, AudioPlayerStatus, AudioResource, createAudioPlayer, getVoiceConnection, joinVoiceChannel, PlayerSubscription } from "@discordjs/voice";
import { StageChannel, VoiceChannel } from "discord.js";
import yts from "yt-search";
import { AutoPlayUtil } from "./AutoPlayUtil";
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

    public static getCurrentArtist(): string{
        if (this.audioPlayer.state.status === AudioPlayerStatus.Playing) {
            const resource = this.audioPlayer.state.resource as AudioResource<yts.VideoSearchResult>;
            return resource.metadata.author.name;
        }
        return "";
    }

    // Create audio player and setup events to handle
    private static createAudioPlayer(): AudioPlayer {
        const audioPlayer = createAudioPlayer();
        audioPlayer.on(AudioPlayerStatus.Idle, () => {
            this.onAudioPlayerIdle();
        })
        audioPlayer.on(AudioPlayerStatus.Playing, () => {
            this.playing = true;
        })
        audioPlayer.on('error', (error) => {
            console.error(error);
        })
        return audioPlayer;
    }

    private static onAudioPlayerIdle() {
        this.playing = false;
        if (queue.size() == 0 && AutoPlayUtil.isAutoPlaying()) {
            AutoPlayUtil.autoPlay();
        } else {
            queue.play();
        }
    }
}