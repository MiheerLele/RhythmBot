import { Message } from "discord.js";
import { Command } from "./interfaces/Command";
import { AudioUtil } from "../util/AudioUtil"; 

class Skip implements Command {
    name: string;

    constructor() {
        this.name = "skip";
    }

    execute(message: Message, args: string[]) {
        AudioUtil.audioPlayer.stop();
    }
}

const skip = new Skip();
export { skip };