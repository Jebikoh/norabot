import Discord, { Message } from "discord.js";
import { isNull } from "util";
import Command from "../../types/Command";

const verificationLevels: { [index: number]: { level: string } } = {
  0: {
    level: "None"
  },
  1: {
    level: "Low"
  },
  2: {
    level: "Medium"
  },
  3: {
    level: "(╯°□°）╯︵ ┻━┻"
  },
  4: {
    level: "┻━┻彡 ヽ(ಠ益ಠ)ノ彡┻━┻"
  }
};

module.exports = new Command({
  name: "guild",
  description: "Get information about the current server",
  aliases: ["g"],
  usage: ``,
  guildOnly: true,
  execute(message: Message) {
    let embed = new Discord.RichEmbed()
      .setTitle(`**${message.guild.name}**`)
      .setColor(0x00ae86)
      .setDescription("Below is information about your server:")
      .setTimestamp()
      .addField(`Member Count:`, `${message.guild.memberCount}`)
      .addField(`Server:`, `${message.guild.region}`)
      .addField(`AFK Timeout:`, `${message.guild.afkTimeout}`)
      .addField(
        `Verification Level:`,
        `${verificationLevels[message.guild.verificationLevel].level}`
      )
      .addField(`Date of Formation:`, `${message.guild.createdAt}`);

    if (!isNull(message.guild.iconURL))
      embed.setThumbnail(`${message.guild.iconURL}`);
    if (!isNull(message.guild.afkChannel))
      embed.addField(`AFK Channel`, `${message.guild.afkChannel}`);

    message.channel.send({ embed });
  }
});
