import { Command } from "./interfaces/Command";
import { ping } from "./ping";
import { play } from "./play";
import { skip } from "./skip";

const commands: Command[] = [ping, play, skip];
export { commands };