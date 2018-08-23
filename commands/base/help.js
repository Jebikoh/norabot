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


const { prefix } = require('../../config.json');
const Discord = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Lists all commands, or specific info for a command',
    aliases: ['commands'],
    usage: '[command name]',
    cooldown: 0,
    group: 'Basic',
    execute(message, args) {
        const { commands } = message.client;

        const embedInitial = new Discord.RichEmbed()
            .setTitle(`**List of Commands:**`)
            .setDescription(`\nUse \`${prefix}help [command name]\` to get info on a specific command`)
            .setColor(0x00AE86)
            .setTimestamp();

        if (!args.length) {
            let commandList = commands.map(command => { return {name: command.name, group: command.group} });
            let commandGroups = commands.map(command => command.group).filter(onlyUnique);

            function onlyUnique(value, index, self) {
                return self.indexOf(value) === index;
            }

            for (i = 0; i < commandGroups.length; i++) {
                let currentGroup = commandGroups[i];
                let groupCommands = [];

                for (x = 0; x < commandList.length; x++) {
                    if (commandList[x]["group"] === currentGroup) {
                        groupCommands.push(commandList[x]["name"]);
                    }
                }

                let embedFieldBody = "`" + groupCommands.join("`, `") + "`";
                embedInitial.addField(currentGroup, embedFieldBody);
            }

            return message.author.send(embedInitial)
                .then(() => {
                    if (message.channel.type === 'dm') return;
                    message.reply(`Help is in your DM's!`);
                })
                .catch(error => {
                    console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                    message.reply(`I can't seem like I can\'t DM you! Do you have DMs disabled?`);
                });
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply(`Sorry, that's not a valid command`);
        }

        const embed = new Discord.RichEmbed()
            .setTitle(`**${command.name}**`)
            .setColor(0x00AE86)
            .setTimestamp();
        if (command.aliases) embed.addField("**Aliases:**", command.aliases);
        if (command.description) embed.addField("**Description:**", command.description);
        if (command.usage) embed.addField("**Usage:**", command.usage);
        if (command.cooldown) embed.addField("**Cooldown:**", command.cooldown);

        message.channel.send(embed);
    },
};