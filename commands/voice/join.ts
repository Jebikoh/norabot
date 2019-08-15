import { Message } from "discord.js";
import Command from "../../types/Command";

module.exports = new Command({
  name: "join",
  description: "Have the bot join your current channel",
  aliases: ["j"],
  usage: ``,
  guildOnly: true,
  voiceRequired: true,
  async execute(message: Message) {
    message.member.voiceChannel.join();
  }
});
