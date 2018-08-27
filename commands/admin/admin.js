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

module.exports = {
    name: 'admin',
    description: 'Check to see if you have admin privaleges',
    aliases: ['ad'],
    usage: `[command]`,
    execute(message) {
        if (message.channel.type === 'dm') {
            message.reply("Of course you're an admin in your own DM!").then(msg => {
                msg.delete(10000);
            }).catch(err => {
                console.log(err)
            });

            return;
        }
        if (message.member.hasPermission("ADMINISTRATOR")) {
            message.reply("yes");
        } else {
            message.reply("no");
        }
    }
};