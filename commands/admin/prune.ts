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
import { dateDifference, deleteMessage } from "../../utils";

module.exports = {
  name: "prune",
  description: "Delete up to 99 messages",
  aliases: ["p"],
  usage: `a?prune [amount]`,
  guildOnly: true,
  adminReq: true,
  execute(message: Message, args: string[]) {
    const amount = parseInt(args[0]) + 1;

    if (isNaN(amount)) {
      return message.reply("That is not a valid number.");
    } else if (amount <= 1 || amount > 100) {
      return message.reply("The number must be between 1 and 99.");
    }

    message.channel.fetchMessages({ limit: amount }).then(messages => {
      const currentDate = Date.now();
      const bulkDeleteMessages: Message[] = [];

      messages.forEach((message: Message) => {
        if (dateDifference(message.createdAt.getTime(), currentDate) >= 14) {
          deleteMessage(message);
        } else {
          bulkDeleteMessages.push(message);
        }
      });

      // This works!
      message.channel.bulkDelete(bulkDeleteMessages);
    });
  }
};
