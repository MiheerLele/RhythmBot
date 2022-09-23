import { AudioResource } from '@discordjs/voice';
import { MessageEmbed } from 'discord.js';
import yts from 'yt-search';
import { AudioUtil } from './AudioUtil'; 
import { MessageAction, MessageUtil } from './MessageUtil';

class Queue {
    private _store: AudioResource<yts.VideoSearchResult>[] = [];

    // Adds to end
    private push(val: AudioResource<yts.VideoSearchResult>) {
        this._store.push(val);
    }

    // Removes from front
    public pop(): AudioResource<yts.VideoSearchResult> | undefined{
        return this._store.shift();
    }

    // Adds to front, currently unused
    public unpop(val: AudioResource<yts.VideoSearchResult>) {
        this._store.unshift(val);
    }

    public size(): number {
        return this._store.length;
    }

    // Returns the total length of the queue in milliseconds
    public duration(): number {
        return this._store.reduce((sum, resource) => sum + (resource.metadata.seconds * 1000), 0);
    }

    public list(): MessageEmbed[] {
        // Create a copy of the first 10 songs in the queue and reverse it
        const maxEmbedPerMessage = 10;
        const iters = Math.min(maxEmbedPerMessage, this._store.length);
        let songsReverse = this._store.slice(0, iters).reverse();
        let embeds: MessageEmbed[] = [];

        // Loop through and create message embeds for each item
        for (let i = 0; i < iters; i++) {
            const val = songsReverse[i];
            const embed = new MessageEmbed()
                .setTitle(val.metadata.title)
                .setThumbnail(val.metadata.thumbnail)
                .addFields(
                    { name: "Position in queue", value: (iters - i).toString(), inline: true },
                    { name: "Duration", value: val.metadata.timestamp, inline: true }
                )
            embeds.push(embed);
        }
        return embeds;
    }

    public add(video: yts.VideoSearchResult) {
        if (AudioUtil.isPlaying()) { MessageUtil.send(MessageAction.QUEUED ,video) }
        this.push(AudioUtil.createAudioResource(video));
    }

    public remove(index: number): yts.VideoSearchResult {
        const video = this._store[index].metadata
        this._store.splice(index, 1);
        return video;
    }

    // public removeString(specifier: string) {
    //     // Search queue for title or something
    //     // Remove last occurance
    // }

    public clear() {
        this._store = [];
    }
}

export const queue = new Queue();