import { 
    ChatInputCommandInteraction, 
    SlashCommandBuilder
} from "discord.js";

export abstract class Command {
    name: string;
    description: string;
    slashCommand: SlashCommandBuilder;

    constructor(name: string, description: string) {
        this.name = name;
        this.description = description;
        this.slashCommand = new SlashCommandBuilder().setName(this.name).setDescription(this.description);
    }

    buildSlashCommand() {
        return this.slashCommand.toJSON();
    }

    abstract execute(interaction: ChatInputCommandInteraction): void;
}