import { Message } from "discord.js";
import { servers } from "../../index";
import { isUndefined } from "../../utils";
import Command from "../../types/Command";

module.exports = new Command({
  name: "resume",
  description: "Resume whatever the bot is playing",
  aliases: ["r"],
  usage: `v?resume`,
  guildOnly: true,
  voiceRequired: true,
  execute(message: Message) {
    if (message.member.voiceChannel) {
      if (!servers[message.guild.id]) {
        servers[message.guild.id] = { queue: [], boombox: false };

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
});
