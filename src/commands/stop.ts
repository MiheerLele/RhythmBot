import { Message, MessageEmbed } from "discord.js";
import { Command } from "./interfaces/Command";
import { AutoPlayUtil } from "../util/AutoPlayUtil";
import { queue } from "../util/Queue";
import { AudioUtil } from "../util/AudioUtil";

class Stop implements Command {
    name: string;

    constructor() {
        this.name = "stop";
    }

    execute(message: Message, args: string[]) {
        AutoPlayUtil.stopAutoPlay();
        queue.clear();
        AudioUtil.audioPlayer.stop();
        const msgEmbed = new MessageEmbed()
            .setTitle(`Autoplay is now off and the queue is empty`);
        message.channel.send({ embeds: [msgEmbed] })
    }
}

const stop = new Stop();
export { stop };