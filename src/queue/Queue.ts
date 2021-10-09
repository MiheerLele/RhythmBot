import { AudioResource } from '@discordjs/voice';
import { MessageEmbed } from 'discord.js';
import yts from 'yt-search';

class Queue {
    private _store: AudioResource<yts.VideoSearchResult>[] = [];

    public push(val: AudioResource<yts.VideoSearchResult>) {
        this._store.push(val);
    }

    public pop(): AudioResource<yts.VideoSearchResult> | undefined{
        return this._store.shift();
    }

    public size(): number {
        return this._store.length;
    }

    public duration(): number {
        console.log(this._store[0]);
        return this._store.reduce((sum, resource) => sum + resource.metadata.seconds, 0);
    }

    public list(): MessageEmbed[] {
        let songsCopy = [...this._store].reverse();
        const maxEmbedPerMessage = 10;
        let embeds: MessageEmbed[] = [];
        for (let i = 0; i < Math.min(maxEmbedPerMessage, this._store.length); i++) {
            const val = songsCopy[i];
            const embed = new MessageEmbed()
                .setTitle(val.metadata.title)
                .setThumbnail(val.metadata.thumbnail)
            embeds.push(embed);
        }
        return embeds;
    }
}

export const queue = new Queue();