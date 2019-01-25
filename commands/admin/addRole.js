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
    name: 'addroles',
    description: 'Add role(s) to a user',
    aliases: ['ar'],
    usage: `[command user role(s)]`,
    guildOnly: true,
    adminReq: true,
    execute(message, args) {
        let unable = [];
        let able = [];
        let prexist = [];

        const member = message.mentions.members.first();
        if (member === undefined) {
            message.reply("You didn't specify a user!").then(msg => {
                msg.delete(deleteTimer);
            }).catch(err => {
                console.log(err);
            });
            return;
        }
        for (i = 1; i < args.length; i++) {
            const role = message.guild.roles.find(x => x.name === args[i]);
            if (member.roles.has(role.id)) {
                prexist.push(args[i]);
                continue;
            }
            member.addRole(role).catch(err => {
                unable.push(args[i]);
                console.log(err);
            });
            if (role) {
                able.push(args[i]);
            } else {
                unable.push(args[i]);
            }
        }

        if (able.length > 0) {
            message.reply("I added the following roles: " + '`' + able.join('`, `') + '`').then(msg => {
                msg.delete(deleteTimer);
            }).catch(err => {
                console.log(err);
            });
        } if (prexist.length > 0) {
            message.reply("The user already has the following roles: " + '`' + prexist.join('`, `') + '`').then(msg => {
                msg.delete(deleteTimer);
            }).catch(err => {
                console.log(err);
            });
        } if (unable.length > 0) {
            message.reply("I was unable to add the following roles. Please check your spelling or permissions before trying again: " + '`' + unable.join('`, `') + '`').then(msg => {
                msg.delete(deleteTimer);
            }).catch(err => {
                console.log(err);
            });
        }
        message.delete(deleteTimer);
    }
};