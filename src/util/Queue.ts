import { AudioResource, createAudioResource } from '@discordjs/voice';
import { MessageEmbed } from 'discord.js';
import yts from 'yt-search';
import ytdl from 'ytdl-core';
import { AudioUtil } from './AudioUtil'; 

class Queue {
    private _store: AudioResource<yts.VideoSearchResult>[] = [];

    private push(val: AudioResource<yts.VideoSearchResult>) {
        this._store.push(val);
    }

    private pop(): AudioResource<yts.VideoSearchResult> | undefined{
        return this._store.shift();
    }

    public size(): number {
        return this._store.length;
    }

    public duration(): number {
        return this._store.reduce((sum, resource) => sum + resource.metadata.seconds, 0);
    }

    public list(): MessageEmbed[] {
        // Create a copy of the queue and reverse it
        let songsCopy = [...this._store].reverse();
        const maxEmbedPerMessage = 10;
        let embeds: MessageEmbed[] = [];
        const iters = Math.min(maxEmbedPerMessage, this._store.length);

        // Loop through and create message embeds for each item
        for (let i = 0; i < iters; i++) {
            const val = songsCopy[i];
            const embed = new MessageEmbed()
                .setTitle(val.metadata.title)
                .setThumbnail(val.metadata.thumbnail)
                .addField("Position in queue", (iters-i).toString(), true)
                .addFields(
                    { name: "Position in queue", value: (iters - i).toString(), inline: true },
                    { name: "Duration", value: val.metadata.timestamp, inline: true }
                )
            embeds.push(embed);
        }
        return embeds;
    }

    public play() {
        const resource: AudioResource | undefined = this.pop();
        if (resource) {
            AudioUtil.audioPlayer.play(resource);
        }
    }

    public add(video: yts.VideoSearchResult) {
        const stream = ytdl(video.url, {quality: 'highestaudio', filter: 'audioonly'})
        this.push(createAudioResource<yts.VideoSearchResult>(stream, {metadata: video}));
    }
}

export const queue = new Queue();