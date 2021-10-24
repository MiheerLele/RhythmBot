import { Command } from "./interfaces/Command";
import { ping } from "./ping";
import { play } from "./play";
import { skip } from "./skip";
import { queue } from "./queue";
import { autoplay } from "./autoplay";
import { remove } from "./remove";
import { stop } from "./stop";
import { autoplayRemove } from "./autoplayRemove";

const commands: Command[] = [ping, play, skip, queue, autoplay, remove, stop, autoplayRemove];
export { commands };