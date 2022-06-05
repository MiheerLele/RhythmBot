import { CommandInteraction } from "discord.js";
import { Command } from "./interfaces/Command";
import { AudioUtil } from "../util/AudioUtil"; 
import { SlashCommandDefinition } from "./interfaces/SlashCommand";

class Skip implements Command {
    name: string;
    description: string;
    slashCommandDefinition: SlashCommandDefinition;

    constructor() {
        this.name = "skip";
        this.description = "Skips the currently playing song"
        this.slashCommandDefinition = {
            name: this.name,
            description: this.description
        }
    }

    execute(interaction: CommandInteraction) {
        AudioUtil.audioPlayer.stop();
    }
}

const skip = new Skip();
export { skip };