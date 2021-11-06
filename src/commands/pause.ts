import { Message, MessageEmbed } from "discord.js";
import { AudioUtil } from "../util/AudioUtil";
import { Command } from "./interfaces/Command";

class Pause implements Command {
    name: string;
    private isPaused: boolean = false;

    constructor() {
        this.name = "pause";
    }

    execute(message: Message, args: string[]) {
        this.isPaused = !this.isPaused;
        this.isPaused ? AudioUtil.audioPlayer.pause() : AudioUtil.audioPlayer.unpause();
        const status = this.isPaused ? "PAUSED" : "UNPAUSED";
        const msgEmbed = new MessageEmbed()
            .setTitle(`BouqBash DJ is now ***${status}***`);
        message.channel.send({ embeds: [msgEmbed] })
    }
}

const pause = new Pause();
export { pause };