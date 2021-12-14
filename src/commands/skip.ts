import { Message } from "discord.js";
import { Command } from "./interfaces/Command";
import { AudioUtil } from "../util/AudioUtil"; 

class Skip implements Command {
    name: string;

    constructor() {
        this.name = "skip";
    }

    execute(message: Message, args: string[]) {
        // If autoplayed, remove from the playlist, but then have to be careful ig
        // Artist can sometimes give wack results anyway
        AudioUtil.audioPlayer.stop();
    }
}

const skip = new Skip();
export { skip };