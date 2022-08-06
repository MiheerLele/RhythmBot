import { CommandInteraction } from "discord.js";
import { SlashCommandDefinition } from "./SlashCommand";

export interface Command{
    name: string;
    description: string;
    slashCommandDefinition: SlashCommandDefinition
    execute(interaction: CommandInteraction): void;
}