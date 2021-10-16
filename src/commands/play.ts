import { Message, StageChannel, VoiceChannel, MessageEmbed, TextBasedChannels } from "discord.js";
import { Command } from "./interfaces/Command";
import ytdl from "ytdl-core";
import { createAudioResource, createAudioPlayer, joinVoiceChannel, getVoiceConnection, VoiceConnection, PlayerSubscription, AudioResource, AudioPlayerStatus, AudioPlayer } from '@discordjs/voice';
import yts, { VideoSearchResult } from "yt-search";
import { queue } from "../util/Queue";
import { fork, ChildProcess } from "child_process";
import { AudioUtil } from "../util/AudioUtil";
import { ChildUtil } from "../util/ChildUtil";
import { MessageUtil } from "../util/MessageUtil";

class Play implements Command {
    name: string;

    constructor() {
        this.name = "play";
    }

    execute(message: Message, args: string[]) {
        const voiceChannel = message.member?.voice.channel;
        if (!voiceChannel) { return message.channel.send("Get in a voice channel first, damn"); }
        if (!args.length) { return message.channel.send("Play what?"); }

        AudioUtil.setup(voiceChannel);
        MessageUtil.setMessage(message);
        ChildUtil.child.send(args.join(' '));
    }
}

const play = new Play();
export { play };