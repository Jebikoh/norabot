import { Message } from "discord.js";

module.exports = {
  name: "kick",
  description: "Kicks a user",
  aliases: ["k"],
  usage: `[@user]`,
  guildOnly: true,
  adminReq: true,
  execute(message: Message) {
    const user = message.mentions.users.first();
    if (user) {
      const member = message.guild.member(user);
      if (member) {
        member
          .kick("An administrator has requested to kick this user")
          .then(() => {
            message.reply(`I have kicked the following user: ${user.tag}`);
          })
          .catch(err => {
            message.reply("I was unable to kick the member");
            console.error(err);
          });
      } else {
        message.reply("Sorry, I couldn't find that person");
      }
    } else {
      message.reply("Sorry, you didn't mention anyone to kick!");
    }
  }
};
