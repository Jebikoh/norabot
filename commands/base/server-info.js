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
    name: 'guild',
    description: 'Get information about the current server',
    aliases: ['g'],
    usage: `[command]`,
    group: 'Basic',
    prefix: 'b' + prefix,
    execute(message) {
        const embed = new Discord.RichEmbed()
            .setTitle(`**${message.guild.name}**`)
            .setColor(0x00AE86)
            .setDescription("Below is information about your server:")
            .setThumbnail(`${message.guild.iconURL}`)
            .setTimestamp()
            .addField(`Member Count:` ,`${message.guild.memberCount}`)
            .addField(`Server:`, `${message.guild.region}`)
            .addField(`AFK Timeout:`, `${message.guild.afkTimeout}`)
            .addField(`AFK Channel:`, `${message.guild.afkChannel}`)
            .addField(`Default Channel:`, `${message.guild.defaultChannel}`)
            .addField(`Date of Formation:`, `${message.guild.createdAt}`);

        message.channel.send({embed});
    }
};