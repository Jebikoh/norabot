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

const fs = require('fs');
const Discord = require('discord.js');
const { token } = require('./config.json');

const cooldowns = new Discord.Collection();

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFolders = fs.readdirSync('./commands');
for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.name, command);
    }
}

client.on('ready', () => {
    console.log('Ready!');
});

client.on('message', message => {
    const { commands } = message.client;

    // Get a unique list of all prefixes
    let commandPrefixes = commands.map(command => command.prefix).filter(onlyUnique);
    let output = [];

    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

    if (!startsWithAny(message.content, commandPrefixes) || message.author.bot) return;

    function startsWithAny(string, prefixes) {
        for (i = 0; i < prefixes.length; i++) {
            if (string.startsWith(prefixes[i])) {
                output.push(prefixes[i]);
                break;
            } else {
                 continue;
            }
        }
        if (output.length === 0) {
            return false;
        } else {
            return true;
        }
    }

    const args = message.content.slice(output[0].length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    if (command.prefix != output[0]) return;

    if (command.guildOnly && message.channel.type !== 'text') {
        return message.reply("Sorry, but you can only use that command on servers!")
    }

    if (command.args && !args.length) {
        let reply = `You didn't provide the necessary arguments, ${message.author}! `;

        if (command.usage) {
            reply += `\nThe proper usage would be: \`${command.prefix}${command.name} ${command.usage}\``;
        }

        return message.channel.send(reply)
    }

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown) * 1000;

    if (!timestamps.has(message.author.id)) {
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }
    else {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`Please wait ${timeLeft.toFixed(1)} before trying again`);
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }

    try {
        command.execute(message, args);
    }
    catch (error) {
        console.error(error);
        message.reply('Sorry, something went wrong! If the issue persists, please contact a developer')
    }
});

client.login(token);