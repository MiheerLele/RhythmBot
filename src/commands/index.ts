import { Command } from "./structures/Command";
import { ping } from "./ping";
import { play } from "./play";
import { skip } from "./skip";
import { queue } from "./queue";
import { remove } from "./remove";
import { pause } from "./pause";
import { stop } from "./stop";
import { autoplay } from "./autoplay";
import { autoPlayList } from "./autoplayList";
import { autoplayRemove } from "./autoplayRemove";

const commands: Command[] = [ping, play, skip, queue, remove, pause, stop, autoplay, autoPlayList, autoplayRemove];
export { commands };