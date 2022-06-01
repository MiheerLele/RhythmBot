import { Message } from "discord.js";
import { Command } from "./interfaces/Command";
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
        if (!voiceChannel) { return message.channel.send("Get in a voice channel first"); }
        if (!args.length) { return message.channel.send("Play what?"); }

        AudioUtil.setup(voiceChannel);
        MessageUtil.setMessage(message);
        ChildUtil.child.send({query: args.join(' ')});
    }
}

const play = new Play();
export { play };