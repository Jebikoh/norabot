import { Message } from "discord.js";

module.exports = {
  name: "removeroles",
  description: "Remove role(s) from a user",
  aliases: ["rr"],
  usage: `[@user] [role(s)]`,
  guildOnly: true,
  adminReq: true,
  execute(message: Message, args: string[]) {
    let unable = [];
    let able = [];
    let prexist = [];

    const member = message.mentions.members.first();
    if (member === undefined) {
      message.reply("You didn't specify a user!");
      return;
    }
    for (let i = 1; i < args.length; i++) {
      const role = message.guild.roles.find(x => x.name === args[i]);
      if (!member.roles.has(role.id)) {
        prexist.push(args[i]);
        continue;
      }
      member.removeRole(role).catch(err => {
        unable.push(args[i]);
        console.log(err);
      });
      if (role) {
        able.push(args[i]);
      } else {
        unable.push(args[i]);
      }
    }

    if (able.length > 0) {
      message.reply(
        "I removed the following roles: " + "`" + able.join("`, `") + "`"
      );
    }
    if (prexist.length > 0) {
      message.reply(
        "The user doesn't have the following roles already: " +
          "`" +
          prexist.join("`, `") +
          "`"
      );
    }
    if (unable.length > 0) {
      message.reply(
        "I was unable to remove the following roles. Please check your spelling or permissions before trying again: " +
          "`" +
          unable.join("`, `") +
          "`"
      );
    }
  }
};
