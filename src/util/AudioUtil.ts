import { AudioPlayer, AudioPlayerStatus, createAudioPlayer, getVoiceConnection, joinVoiceChannel, PlayerSubscription } from "@discordjs/voice";
import { StageChannel, VoiceChannel } from "discord.js";
import { queue } from "./Queue";

export class AudioUtil {
    public static readonly audioPlayer: AudioPlayer = AudioUtil.createAudioPlayer();
    public static playing: boolean = false;
    private static subscription: PlayerSubscription | undefined;
    public static setup(voiceChannel: VoiceChannel | StageChannel) {
        let connection = getVoiceConnection(voiceChannel.guild.id);
        if (!connection) {
            connection = joinVoiceChannel({ channelId: voiceChannel.id, guildId: voiceChannel.guild.id, adapterCreator: voiceChannel.guild.voiceAdapterCreator });
        }

        if (!AudioUtil.subscription) {
            AudioUtil.subscription = connection.subscribe(AudioUtil.audioPlayer);
        }
    }

    // Create audio player and setup events to handle
    private static createAudioPlayer(): AudioPlayer {
        const audioPlayer = createAudioPlayer();
        audioPlayer.on(AudioPlayerStatus.Idle, () => {
            AudioUtil.playing = false;
            queue.play();
        })
        audioPlayer.on(AudioPlayerStatus.Playing, () => {
            AudioUtil.playing = true;
        })
        audioPlayer.on('error', (error) => {
            console.error(error);
        })
        return audioPlayer;
    }
}