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
 * @license AGPL-3.0+ <http://spdx.org/licenses/AGPL-3.0+>
 */

import { Message } from "discord.js";
import { servers } from "../../index";
import { isUndefined } from "../../utils";

module.exports = {
  name: "Resume",
  description: "Resume whatever the bot is playing",
  aliases: ["r"],
  usage: `v?resume`,
  guildOnly: true,
  adminRequired: false,
  argsRequired: false,
  execute(message: Message) {
    if (message.member.voiceChannel) {
      if (!servers[message.guild.id]) {
        servers[message.guild.id] = { queue: [] };

        message.reply("Nothing is paused!");
      } else {
        let server = servers[message.guild.id];

        if (!isUndefined(server.dispatcher) && server.dispatcher.paused) {
          server.dispatcher.resume();
        }
      }
    } else {
      message.reply("You aren't in a voice channel!");
    }
  }
};
