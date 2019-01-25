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
const { prefix, token } = require('./config.json');
const commandConfig = require('./commands.json');
const Sequelize = require('sequelize');

const client = new Discord.Client({sync: true});

client.prefixes = new Discord.Collection();
const commandFolders = fs.readdirSync('./commands');
for (const folder of commandFolders) {
    const commands = new Discord.Collection();
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);
        commands.set(command.name, command);
    }
    client.prefixes.set(commandConfig[folder].prefix, commands);
    commands.set('name', commandConfig[folder].prefix);
}

const cooldowns = new Discord.Collection();

const sequelize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    operatorsAliases: false,
    // SQLite only
    storage: 'database.sqlite',
});

// Define Database
const Tags = sequelize.define('tags', {
    guildid: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
    },
    defchan: {
        type: Sequelize.TEXT,
        unique: true,
    },
});

module.exports.tags = Tags;
module.exports.client = client;

client.on('ready', () => {
    console.log('Ready!');
    Tags.sync().then(console.log("Synced!"));
});

client.on('guildMemberAdd', member => {  
    const tags = await Tags.findOne({ where: { guildid: message.guild.id } });

    if(guildDB) {
        const channel = member.guild.channels.get(tags.get('defchan'));
        channel.send(`Welcome to the server, ${member}!`);
    }
});

client.on('message', message => {
    if (message.author.bot) return;

    let commandType;

    // Find the command group the the command belongs to
    for (const prefixCollection of client.prefixes) {
        if (message.content.startsWith(prefixCollection[1].get('name') + prefix)) {
            commandType = prefixCollection[1].get('name');
        }
    }
    if (!commandType) return;

    // Get possible arguments & command name used (full name or alias)
    const args = message.content.slice(commandType.length + prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    // Check if the command exists under the command type (full name of alias)
    const command = client.prefixes.get(commandType).get(commandName)
        || client.prefixes.get(commandType).find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

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
    const timestamps = cooldowns.get(command.name);
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
        message.reply('Sorry, something went wrong! If the issue persists, please contact a developer').then(msg => {
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