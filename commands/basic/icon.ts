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

import { Message } from "discord.js";

module.exports = {
  name: "icon",
  description: "Get the icon URL of the specified user/yourself",
  aliases: ["avatar"],
  usage: `b?icon [@user(s)]`,
  execute(message: Message) {
    if (!message.mentions.users.size) {
      return message.channel.send(
        `Your icon: ${message.author.displayAvatarURL}`
      );
    }

    const avatarList = message.mentions.users.map(user => {
      return `${user.username}'s icon: ${user.displayAvatarURL}`;
    });

    message.channel.send(avatarList);
  }
};
