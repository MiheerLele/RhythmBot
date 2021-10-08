import { AudioResource } from '@discordjs/voice';

interface QueueItem {
    audio: AudioResource;
    duration: number;
}

class Queue {
    private _store: AudioResource[] = [];
    push(val: AudioResource) {
        this._store.push(val);
    }
    pop(): AudioResource | undefined{
        return this._store.shift();
    }
    size(): number {
        return this._store.length;
    }
}

export const queue = new Queue();