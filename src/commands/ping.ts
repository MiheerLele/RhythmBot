import { Message } from "discord.js";
import { Command } from "./interfaces/Command";

class Ping implements Command {
    name: string;

    constructor() {
        this.name = "ping";
    }

    execute(message: Message, args: string[]) {
        message.channel.send("pong");
    }
}

const ping = new Ping();
export { ping };