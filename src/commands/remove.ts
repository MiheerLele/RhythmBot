import { Message } from "discord.js";
import { Command } from "./interfaces/Command";
import { queue } from "../util/Queue";
import { MessageUtil } from "../util/MessageUtil";

class Remove implements Command {
    name: string;

    constructor() {
        this.name = "remove";
    }

    execute(message: Message, args: string[]) {
        MessageUtil.setMessage(message);
        const arg = args.join(' ');
        let index: number = parseInt(arg);
        // if (isNaN(index)) {
        //     queue.removeString(arg);
        //     // need a way to tell if the remove failed
        // }
        // Translate human numbering to computer numbering with index - 1
        if (isNaN(index)) { return }
        index = index - 1;
        if (index >= 0 && index < queue.size()) {
            queue.remove(index);
        } else {
            message.channel.send(`Not a valid song. ${queue.size()} songs in the queue`);
        }
    }
}

const remove = new Remove();
export { remove };