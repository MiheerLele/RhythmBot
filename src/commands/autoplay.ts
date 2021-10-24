import { Message, MessageEmbed } from "discord.js";
import { Command } from "./interfaces/Command";
import { AutoPlayUtil } from "../util/AutoPlayUtil";

class Autoplay implements Command {
    name: string;

    constructor() {
        this.name = "autoplay";
    }

    execute(message: Message, args: string[]) {
        AutoPlayUtil.toggleAutoPlay();
        const status = AutoPlayUtil.isAutoPlaying() ? "ON" : "OFF";
        const msgEmbed = new MessageEmbed()
            .setTitle(`Autoplay is now ***${status}***`);
        message.channel.send({ embeds: [msgEmbed] })
    }
}

const autoplay = new Autoplay();
export { autoplay };