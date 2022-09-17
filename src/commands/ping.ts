import { CommandInteraction } from "discord.js";
import { Command } from "./interfaces/Command";
import { SlashCommandDefinition } from "./interfaces/SlashCommand";

class Ping implements Command {
    name: string;
    description: string;
    slashCommandDefinition: SlashCommandDefinition;

    constructor() {
        this.name = "ping";
        this.description = "Pongs!";
        this.slashCommandDefinition = {
            name: this.name,
            description: this.description
        }
    }

    execute(interaction: CommandInteraction) {
        interaction.reply("pong");
    }
}

const ping = new Ping();
export { ping };