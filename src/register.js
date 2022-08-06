require('dotenv').config()
const { REST } = require("@discordjs/rest");
const { Routes }  = require("discord-api-types/v9");
const { commands } = require("../dist/commands/index");

const definitions = commands.map(command => command.slashCommandDefinition)
// console.log(definitions)
// console.log(definitions[1].options)
// console.log(definitions[7].options)

const rest = new REST({version: '9'}).setToken(process.env.DISCORD_TOKEN);

rest.put(Routes.applicationGuildCommands(process.env.APP_ID, process.env.BOT_TEST_GUILD_ID), { body: definitions })
	.then(() => console.log('Successfully registered application commands for test guild.'))
	.catch(console.error)

// rest.put(Routes.applicationGuildCommands(process.env.APP_ID, process.env.MIKES_GUILD_ID), { body: definitions })
// 	.then(() => console.log('Successfully registered application commands for mikes guild.'))
// 	.catch(console.error)