import { Message } from "discord.js";
import { deleteMessage } from "./../../utils";
import Command from "../../types/Command";

module.exports = new Command({
  name: "ping",
  description: "A basic ping command to test bot availability",
  aliases: ["p"],
  usage: `b?ping`,
  execute(message: Message) {
    message.channel.send("Pong!").then(msg => {
      deleteMessage(msg);
    });
    deleteMessage(message);
  }
});
