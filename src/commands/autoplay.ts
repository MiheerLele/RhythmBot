import { Message } from "discord.js";
import { Command } from "./interfaces/Command";
import { ChildUtil } from "../util/ChildUtil";
import { AudioUtil } from "../util/AudioUtil";
import { MessageUtil } from "../util/MessageUtil";

class Autoplay implements Command {
    name: string;

    constructor() {
        this.name = "autoplay";
    }

    execute(message: Message, args: string[]) {
        const voiceChannel = message.member?.voice.channel;
        if (!voiceChannel) { return message.channel.send("Get in a voice channel first"); }
        if (!args.length) { return message.channel.send("Play what?"); }

        AudioUtil.setup(voiceChannel);
        MessageUtil.setMessage(message);
        const authors: string[] = args.join(' ').split(',');
        for (let i = 0; i < 2; i++) {
            ChildUtil.child.send(authors[this.randIndex(authors.length)]);
        }
    }

    private randIndex(len: number): number {
        return Math.floor(Math.random() * len);
    }
}

const autoplay = new Autoplay();
export { autoplay };