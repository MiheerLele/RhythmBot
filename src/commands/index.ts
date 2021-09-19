import { Command } from "./interfaces/Command";
import { ping } from "./ping";
import { play } from "./play";

const commands: Command[] = [ping, play];
export { commands };