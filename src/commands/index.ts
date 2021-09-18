import { Command } from "./interfaces/Command";
import { ping } from "./ping";

const commands: Command[] = [ping];
const commandNames: string[] = commands.map((command) => {return command.name});
export { commands, commandNames };