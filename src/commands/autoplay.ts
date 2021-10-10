import { Message } from "discord.js";
import { Command } from "./interfaces/Command";
import { queue } from "../util/Queue";

class Autoplay implements Command {
    name: string;
    private authors: string[]

    constructor() {
        this.name = "autoplay";
    }

    execute(message: Message, args: string[]) {
        message.channel.send("pong");
    }
}

const autoplay = new Autoplay();
export { autoplay };