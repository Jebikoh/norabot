import { Message } from "discord.js";
import { dateDifference, deleteMessage } from "../../utils";

module.exports = {
  name: "prune",
  description: "Delete up to 99 messages",
  aliases: ["p"],
  usage: `[amount]`,
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
