/**
 * norabot: a multi-purpose Discord bot
 *
 * Copyright (C) 2018 by nitroignika
 *
 * This file is part of norabot.
 *
 * norabot application is free software: you can redistribute
 * it and/or modify it under the terms of the GNU Affero General Public
 * License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *
 * norabot application is distributed in the hope that it will
 * be useful, but WITHOUT ANY WARRANTY; without even the implied warranty
 * of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU A General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with norabot.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @license AGPL-3.0+ <http://spdx.org/licenses/AGPL-3.0+>
 */

import * as fs from 'fs';
import * as Discord from 'discord.js';
import * as Sequelize from 'sequelize';

// const { prefix, token }: {prefix: string, token: string} = require("./config.json");
import { prefix, token} from './config.json';
import commandConfig from './commands.json';
import { isUndefined, isString, isNull } from 'util';
export class Command {
    name: string;
    description: string;
    aliases: string[] | undefined;
    usage: string;
    guildOnly: boolean;
    adminReq: boolean;
    cooldown: number;
    args: boolean;
    execute: (message: Discord.Message, args?: string[]) => void;
    constructor(props: {
        name: string,
        description: string;
        aliases: string[] | undefined;
        usage: string;
        guildOnly: boolean;
        adminReq: boolean;
        cooldown: number;
        args: boolean;
        execute: (message: Discord.Message, args?: string[]) => void;
    }) {
        this.name = props.name;
        this.description = props.description;
        this.aliases = props.aliases;
        this.usage = props.usage;
        this.guildOnly = props.guildOnly;
        this.adminReq = props.adminReq;
        this.execute = props.execute;
        this.cooldown = props.cooldown;
        this.args = props.args;
    }
}

export class NoraClient extends Discord.Client {
    handler: any; //Rip no types in reaction-core
    prefixes: Discord.Collection<string, Discord.Collection<string, string | Command>>;
    constructor(props: Discord.ClientOptions) {
        super(props);
        this.prefixes = new Discord.Collection();
        const commandFolders: string[] = fs.readdirSync('./commands');

        for (const folder of commandFolders) {
            const commands: Discord.Collection<string, any> = new Discord.Collection();
            const commandFiles: string[] = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command: any = require(`./commands/${folder}/${file}`);
            commands.set(command.name, command);
        }
        this.prefixes.set(commandConfig[folder].prefix, commands);
        commands.set('name', commandConfig[folder].prefix);
        }
    }
}

console.log("Generating client...");
const client = new NoraClient({sync: true});


const cooldowns:Discord.Collection<string,Discord.Collection<string,number>> = new Discord.Collection();    

client.on('ready', () => {
    console.log('Ready!');

    // Tags.sync().then(() => console.log("Synced!"));
});

client.on('message', message => {
    if (message.author.bot) return;

    let commandType: string | undefined;

    // Find the command group the the command belongs to
    // TODO: Bug! Cannot read property 'get' of undefined

    for(const prefixes of client.prefixes) {
        if(message.content.startsWith(prefixes[1].get('name') + prefix)) {
            commandType = prefixes[1].get('name') as string;
        }
    }

    if (isUndefined(commandType)) return;

    // Get possible arguments & command name used (full name or alias)
    const args: string[] = message.content
        .slice(commandType.length + prefix.length)
        .split(/ +/);

    const _commandName: string | undefined = args.shift()
    if (!_commandName) return;
    const commandName: string = _commandName.toLowerCase();

    const possibleCommands: Discord.Collection<string, string | Command> | undefined = client.prefixes.get(commandType);
    if(isUndefined(possibleCommands)) return;
    // Check if the command exists under the command type (full name of alias)
    // const command = client.prefixes.get(commandType).get(commandName)
    //     || client.prefixes.get(commandType).find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    const command = (
        possibleCommands.get(commandName) ||
        possibleCommands.find((cmd: string | Command) => {
            if(isString(cmd)) return false;
            if(cmd.aliases && cmd.aliases.includes(commandName)) return true;
            else return false;
        })) as Command;

    if (isNull(command)) return;

    // Handle guild-only commands
    if (command.guildOnly && message.channel.type !== 'text') {
        return message.reply("Sorry, but you can only use that command on servers!")
    }

    // Handle administrator-only commands
    if (command.adminReq && !message.member.hasPermission("ADMINISTRATOR")) {
        return message.reply("You don't have the adequate permissions!");
    }

    // Handle insufficient arguments
    if (command.args && !args.length) {
        let reply = `You didn't provide the necessary arguments, ${message.author}! `;

        if (command.usage) {
            reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
        }

        return message.channel.send(reply)
    }

    // Handle commands w/o cooldowns
    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps:Discord.Collection<string, number> | undefined = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown) * 1000;

    // Start cooldown for commands w/ cooldowns
    if (!timestamps.has(message.author.id)) {
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }
    // Handle commands w/ cooldowns
    else {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`Please wait ${timeLeft.toFixed(1)} before trying again`);
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }

    // Execute the command
    try {
        command.execute(message, args);
    }
    catch (error) {
        console.error(error);
        message.reply('Sorry, something went wrong! If the issue persists, please contact a developer').then((msg:Discord.Message) => {
            if(message.channel.type != 'dm') {
                msg.delete(8000)
            }
        }).catch(err => {
           console.log(err);
        });
        message.delete(8000).then(msg => {
            if(message.channel.type != 'dm') {
                msg.delete(8000);
            }
        });
    }
});

client.login(token);
process.on('unhandledRejection', console.error);