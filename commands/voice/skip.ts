import { Message } from "discord.js";
import { servers } from "../../index";
import { isUndefined } from "../../utils";
import Command from "../../types/Command";

module.exports = new Command({
  name: "skip",
  description: "Skip to the next song in queue",
  aliases: ["s"],
  usage: `v?skip`,
  guildOnly: true,
  voiceRequired: true,
  execute(message: Message) {
    if (message.member.voiceChannel) {
      if (!servers[message.guild.id]) {
        servers[message.guild.id] = { queue: [], boombox: false };

        message.reply("Nothing in queue!");
      } else {
        let server = servers[message.guild.id];

        if (!isUndefined(server.dispatcher)) {
          server.dispatcher.end();
        }
      }
    } else {
      message.reply("You aren't in a voice channel!");
    }
  }
});
