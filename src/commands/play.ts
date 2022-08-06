import { CommandInteraction, GuildMember } from "discord.js";
import { Command } from "./interfaces/Command";
import { AudioUtil } from "../util/AudioUtil";
import { ChildUtil } from "../util/ChildUtil";
import { MessageUtil } from "../util/MessageUtil";
import { OptionType, SlashCommandDefinition } from "./interfaces/SlashCommand";

class Play implements Command {
    name: string;
    description: string;
    slashCommandDefinition: SlashCommandDefinition;

    constructor() {
        this.name = "play";
        this.description = "Plays a song or adds to the queue if a song is already playing"
        this.slashCommandDefinition = {
            name: this.name,
            description: this.description,
            options: [{
                name: "query",
                description: "The song or artist you want to play",
                type: OptionType.STRING,
                required: true
            }]
        }
    }

    execute(interaction: CommandInteraction) {
        const member = interaction.member as GuildMember
        const voiceChannel = member.voice.channel
        if (!voiceChannel) { return interaction.reply("Get in a voice channel first"); }
        
        AudioUtil.setup(voiceChannel);
        MessageUtil.setMessage(interaction);
        ChildUtil.child.send({query: interaction.options.getString("query")});
    }
}

const play = new Play();
export { play };