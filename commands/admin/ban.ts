import { Message } from "discord.js";

module.exports = {
  name: "ban",
  description: "Bans a user",
  aliases: ["b"],
  usage: `[@user]`,
  guildOnly: true,
  adminReq: true,
  execute(message: Message) {
    const user = message.mentions.users.first();
    if (user) {
      const member = message.guild.member(user);
      if (member) {
        member
          .ban({ reason: "An administrator has requested to ban this user" })
          .then(() => {
            message.reply(`I have banned the following user: ${user.tag}`);
          });
      } else {
        message.reply("Sorry, I couldn't find that person");
      }
    } else {
      message.reply("Sorry, you didn't mention anyone to ban!");
    }
  }
};
