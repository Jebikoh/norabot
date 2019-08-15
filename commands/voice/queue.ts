import { Message, RichEmbed } from "discord.js";
import { servers } from "../../index";
import Command from "../../types/Command";

module.exports = new Command({
  name: "queue",
  description: "Display the bot's queue for your server",
  aliases: ["q"],
  usage: `v?queue`,
  guildOnly: true,
  voiceRequired: true,
  execute(message: Message) {
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
});
