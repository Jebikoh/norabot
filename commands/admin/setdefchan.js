
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

 const index = require('../../index');

module.exports = {
    name: 'setdefchan',
    description: 'Set the default channel of a server',
    aliases: ['sdc'],
    usage: `[command]`,
    guildOnly: true,
    adminReq: true,
    async execute(message) {
        const GuildID = message.guild.id;
        const defaultChannel = message.channel.id;
        try {
            if(await index.tags.findOne({ where: { guildid: GuildID } })) {
                const affectedRows = await index.tags.update({ defchain: defaultChannel }, { where: { guildid: GuildID } });
                if (affectedRows > 0) {
                    return message.reply("This channel is set as your default channel.");
                }
                return message.reply("Something went wrong!");

            } else {
                const tag = await index.tags.create({
                    guildid: GuildID,
                    defchan: defaultChannel,
                });
                message.reply("This channel is set as your default channel");
            }
        } catch(err) {

        }
    }
};