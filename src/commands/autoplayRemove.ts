import { Message, MessageEmbed } from "discord.js";
import { Command } from "./interfaces/Command";
import { AutoPlayUtil } from "../util/AutoPlayUtil";
import { AudioUtil } from "../util/AudioUtil";

class AutoplayRemove implements Command {
    name: string;

    constructor() {
        this.name = "autoplay-remove";
    }

    execute(message: Message, args: string[]) {
        const artist = AudioUtil.getCurrentArtist();
        AutoPlayUtil.removeArtist(artist);
        AudioUtil.audioPlayer.stop();
        const msgEmbed = new MessageEmbed()
            .setTitle(`Removed ***${artist}*** from autoplay rotation`);
        message.channel.send({ embeds: [msgEmbed] })
    }
}

const autoplayRemove = new AutoplayRemove();
export { autoplayRemove };