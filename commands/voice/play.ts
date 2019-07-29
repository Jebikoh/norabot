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

import { Message, VoiceConnection, RichEmbed } from "discord.js";
import ytdl from "ytdl-core";
import { servers } from "../../index";
import { isValidUrl } from "../../utils";

function play(connection: VoiceConnection, message: Message) {
  let server = servers[message.guild.id];
  ytdl.getInfo(server.queue[0]).then(info => {
    const thumbnails = info.player_response.videoDetails.thumbnail.thumbnails;
    const hqThumbnail = thumbnails[thumbnails.length - 1].url;
    const embed = new RichEmbed()
      .setTitle(info.title)
      .setAuthor(info.author.name, info.author.avatar)
      .setThumbnail(hqThumbnail)
      .setURL(server.queue[0]);
    message.channel.send(embed);
  });
  server.dispatcher = connection.playStream(
    ytdl(server.queue[0], { filter: "audioonly" })
  );

  server.queue.shift();
  server.dispatcher.on("end", () => {
    if (server.queue[0]) {
      play(connection, message);
    } else {
      connection.disconnect();
    }
  });
}

module.exports = {
  name: "play",
  description: "Have the bot play some music",
  aliases: ["p"],
  usage: `v?play`,
  guildOnly: true,
  adminRequired: false,
  argsRequired: true,
  execute(message: Message, args: string[]) {
    if (!isValidUrl(args[0])) {
      message.reply("Sorry, that isn't a valid URL");
    } else {
      if (message.member.voiceChannel) {
        if (!servers[message.guild.id]) {
          servers[message.guild.id] = { queue: [] };
        }
        let server = servers[message.guild.id];
        server.queue.push(args[0]);

        message.member.voiceChannel.join().then(connection => {
          play(connection, message);
        });
      } else {
        message.reply("You aren't in a voice channel!");
      }
    }
  }
};
