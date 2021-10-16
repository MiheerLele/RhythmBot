import { Message, MessageEmbed } from "discord.js";
import { Command } from "./interfaces/Command";
import { queue as songs } from "../util/Queue"

class Queue implements Command {
    name: string;

    constructor() {
        this.name = "queue";
    }

    execute(message: Message, args: string[]) {
        const embeds: MessageEmbed[] = songs.list();
        embeds.length > 0 ? 
            message.channel.send({ embeds: embeds }) : 
            message.channel.send("Nothing in the queue, use !play");
    }
}

const queue = new Queue();
export { queue };