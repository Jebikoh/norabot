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
t * @license AGPL-3.0+ <http://spdx.org/licenses/AGPL-3.0+>
 */

import { Message, RichEmbed } from "discord.js";
import { servers } from "../../index";
import ytdl from "ytdl-core";

module.exports = {
  name: "queue",
  description: "Display the bot's queue for your server",
  aliases: ["q"],
  usage: `v?queue`,
  guildOnly: true,
  adminRequired: false,
  argsRequired: false,
  execute(message: Message) {
    if (!servers[message.guild.id]) {
      servers[message.guild.id] = { queue: [] };
    }

    let server = servers[message.guild.id];

    if (server.queue.length == 0) {
      message.reply("The queue is empty!");
    } else {
      const queueEmbed = new RichEmbed()
        .setTitle("Server Queue")
        .setAuthor(message.guild.name, message.guild.iconURL)
        .setColor("#30ff7c");

      for (let i = 0; i < server.queue.length; i++) {
        queueEmbed.addField(i + 1, server.queue[i].title);
      }

      message.channel.send(queueEmbed);
    }
  }
};
