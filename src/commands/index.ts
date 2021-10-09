import { Command } from "./interfaces/Command";
import { ping } from "./ping";
import { play } from "./play";
import { skip } from "./skip";
import { queue } from "./queue";

const commands: Command[] = [ping, play, skip, queue];
export { commands };