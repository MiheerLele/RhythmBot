
// An abbreviated version of the application command structure as listed here:
// https://discord.com/developers/docs/interactions/application-commands#application-commands

export enum OptionType {
    STRING = 3,
    INTEGER = 4,
}

export interface SlashCommandOption {
    type: OptionType;
    name: string;
    description: string;
    required: boolean; 
}

export interface SlashCommandDefinition {
    name: string;
    description: string;
    options?: SlashCommandOption[];
}