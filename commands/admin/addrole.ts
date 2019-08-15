import { Message } from "discord.js";
import { isNull } from "../../utils";

module.exports = {
  name: "addroles",
  description: "Add role(s) to a user",
  aliases: ["ar"],
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

      if (isNull(role)) {
        message.reply("Sorry, I couldn't find that role.");
        return;
      }

      if (member.roles.has(role.id)) {
        prexist.push(args[i]);
        continue;
      }
      member.addRole(role).catch(err => {
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
        "I added the following roles: " + "`" + able.join("`, `") + "`"
      );
    }
    if (prexist.length > 0) {
      message.reply(
        "The user already has the following roles: " +
          "`" +
          prexist.join("`, `") +
          "`"
      );
    }
    if (unable.length > 0) {
      message.reply(
        "I was unable to add the following roles. Please check your spelling or permissions before trying again: " +
          "`" +
          unable.join("`, `") +
          "`"
      );
    }
  }
};
