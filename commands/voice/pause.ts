import { Message } from "discord.js";
import { servers } from "../../index";
import { isUndefined } from "../../utils";
import Command from "../../types/Command";

module.exports = new Command({
  name: "pause",
  description: "Pause whatever the bot is playing.",
  aliases: ["pa"],
  usage: `v?pause`,
  guildOnly: true,
  voiceRequired: true,
  execute(message: Message) {
    if (!servers[message.guild.id].dispatcher) {
      message.reply("Nothing is playing!");
    } else {
      let server = servers[message.guild.id];

      if (!isUndefined(server.dispatcher) && !server.dispatcher.paused) {
        server.dispatcher.pause();
      } else {
        message.reply("Nothing to pause!");
      }
    }
  }
});
