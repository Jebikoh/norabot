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

const { deleteTimer }  = require("../../commands.json");

module.exports = {
    name: 'kick',
    description: "Kicks a user",
    aliases: ['k'],
    usage: `[command user]`,
    execute(message) {
        if (message.channel.type === 'dm') {
            message.reply("You have to be on a server!").then(msg => {
                msg.delete(deleteTimer);
            }).catch(err => {
                console.log(err)
            });

            return;
        }

        if (message.member.hasPermission("ADMINISTRATOR")) {
            const user = message.mentions.users.first();
            if (user) {
                const member = message.guild.member(user);
                if (member) {
                    member.kick('An administrator has requested to kick this user').then(() => {
                        message.reply(`I have kicked the following user: ${user.tag}`);
                    }).catch(err => {
                        message.reply('I was unable to kick the member');
                        console.error(err);
                    });
                } else {
                    message.reply("Sorry, I couldn't find that person");
                }
            } else {
                message.reply("Sorry, you didn't mention anyone to kick!");
            }
        } else {
            message.reply("Sorry, seems like you don't have the required permissions!");
        }
    }
};