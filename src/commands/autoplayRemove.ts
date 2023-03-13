import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { Command } from "./structures/Command";
import { AutoPlayUtil } from "../util/AutoPlayUtil";

class AutoplayRemove extends Command {

    constructor(name: string, description: string) {
        super(name, description);
        this.slashCommand.addStringOption((option) => {
            return option
                .setName("artist")
                .setDescription("The artist you want to remove")
                .setRequired(true)
        });
    }

    execute(interaction: ChatInputCommandInteraction) {
        const artist = interaction.options.getString("artist")
        const title = AutoPlayUtil.removeArtist(artist) ?
            `Removed ***${artist}*** from autoplay rotation` :
            `Artist: ***${artist}*** not found in autoplay rotation`
        const msgEmbed = new EmbedBuilder()
            .setTitle(title)
        interaction.reply({ embeds: [msgEmbed] })
    }
}

const autoplayRemove = new AutoplayRemove("autoplay-remove", "Removes a artist from the autoplay rotation");
export { autoplayRemove };