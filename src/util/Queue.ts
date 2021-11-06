import { AudioResource, createAudioResource } from '@discordjs/voice';
import { MessageEmbed } from 'discord.js';
import yts from 'yt-search';
import ytdl from 'ytdl-core';
import { AudioUtil } from './AudioUtil'; 
import { AutoPlayUtil } from './AutoPlayUtil';
import { MessageUtil } from './MessageUtil';

class Queue {
    private _store: AudioResource<yts.VideoSearchResult>[] = [];
    private _artists: Set<string> = new Set<string>();

    private push(val: AudioResource<yts.VideoSearchResult>) {
        this._store.push(val);
    }

    public pop(): AudioResource<yts.VideoSearchResult> | undefined{
        return this._store.shift();
    }

    public size(): number {
        return this._store.length;
    }

    /* 
        Returns the total length of the queue in milliseconds
    */
    public duration(): number {
        return this._store.reduce((sum, resource) => sum + (resource.metadata.seconds * 1000), 0);
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
                .addFields(
                    { name: "Position in queue", value: (iters - i).toString(), inline: true },
                    { name: "Duration", value: val.metadata.timestamp, inline: true }
                )
            embeds.push(embed);
        }
        return embeds;
    }

    // Needs refactor, maybe move the actual playing into the AudioUtil
    // public play() {
    //     const resource: AudioResource<yts.VideoSearchResult> | undefined = this.pop();
    //     if (resource) {
    //         if (!(resource.playStream.readableEnded || resource.playStream.destroyed)) {
    //             MessageUtil.sendPlaying(resource.metadata);
    //             AudioUtil.audioPlayer.play(resource);
    //             // client.user.setActivity({name: resource.metadata.title, type: 'LISTENING'});
    //         } else {
    //             console.log(resource); // gotta find out why the playstream is messed up
    //             this.play(); // move onto next song for now
    //         }
    //     } else {
    //         console.log(`Queue size: ${queue.size()}, Resource ${resource}`);
    //         // Probably should autoplay from here, but its kinda messy
    //         // Could throw an error and catch it
    //     }
    // }

    public add(video: yts.VideoSearchResult) {
        if (AudioUtil.isPlaying()) { MessageUtil.sendQueued(video) }
        AutoPlayUtil.addArtist(video);
        const stream = ytdl(video.url, {quality: 'highestaudio', filter: 'audioonly'});
        this.push(createAudioResource<yts.VideoSearchResult>(stream, {metadata: video}));
    }

    public remove(index: number): void {
        MessageUtil.sendRemoved(this._store[index].metadata);
        this._store.splice(index, 1);
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