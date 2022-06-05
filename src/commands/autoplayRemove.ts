import { CommandInteraction, MessageEmbed } from "discord.js";
import { Command } from "./interfaces/Command";
import { AutoPlayUtil } from "../util/AutoPlayUtil";
import { OptionType, SlashCommandDefinition } from "./interfaces/SlashCommand";

class AutoplayRemove implements Command {
    name: string;
    description: string;
    slashCommandDefinition: SlashCommandDefinition;

    constructor() {
        this.name = "autoplay-remove";
        this.description = "[DEV ONLY] Removes a artist from the autoplay rotation"
        this.slashCommandDefinition = {
            name: this.name,
            description: this.description,
            options: [{
                name: "artist",
                description: "The artist you want to remove",
                type: OptionType.STRING,
                required: true
            }]
        }
    }

    execute(interaction: CommandInteraction) {
        const artist = interaction.options.getString("artists")
        AutoPlayUtil.removeArtist(artist);
        const msgEmbed = new MessageEmbed()
            .setTitle(`Removed ***${artist}*** from autoplay rotation`);
        interaction.reply({ embeds: [msgEmbed] })
    }
}

const autoplayRemove = new AutoplayRemove();
export { autoplayRemove };