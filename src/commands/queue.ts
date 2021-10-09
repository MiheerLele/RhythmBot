import { Message, MessageEmbed } from "discord.js";
import { Command } from "./interfaces/Command";
import { queue as songs } from "../queue/Queue"

class Queue implements Command {
    name: string;

    constructor() {
        this.name = "queue";
    }

    execute(message: Message, args: string[]) {
        const embeds: MessageEmbed[] = songs.list();
        message.channel.send({ embeds: embeds });
    }
}

const queue = new Queue();
export { queue };