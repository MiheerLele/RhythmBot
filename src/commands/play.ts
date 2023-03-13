import { ChatInputCommandInteraction, GuildMember } from "discord.js";
import { Command } from "./structures/Command";
import { AudioUtil } from "../util/AudioUtil";
import { ChildUtil } from "../util/ChildUtil";

class Play extends Command {

    constructor(name: string, description: string) {
        super(name, description);
        this.slashCommand.addStringOption((option) => {
            return option
                .setName("query")
                .setDescription("The song or artist you want to play")
                .setRequired(true)
        });
    }

    execute(interaction: ChatInputCommandInteraction) {
        const member = interaction.member as GuildMember
        const voiceChannel = member.voice.channel
        if (!voiceChannel) { return interaction.reply("Get in a voice channel first"); }

        const query = interaction.options.getString("query");
        AudioUtil.setup(voiceChannel);
        ChildUtil.send({query: query});

        interaction.reply(`Searching for: ***${query}***\nRequested by: ${member}`);
    }
}

const play = new Play("play", "Plays a song or adds to the queue if a song is already playing");
export { play };