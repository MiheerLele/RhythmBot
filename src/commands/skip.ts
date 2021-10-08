import { Message } from "discord.js";
import { Command } from "./interfaces/Command";
import { play } from "./play";

class Skip implements Command {
    name: string;

    constructor() {
        this.name = "skip";
    }

    execute(message: Message, args: string[]) {
        play.audioPlayer.stop();
    }
}

const skip = new Skip();
export { skip };