/**
 * norabot: a multi-purpose Discord bot
 *
 * Copyright (C) 2018 by nitroignika
 *
 * This file is part of norabot.
 *
 * norabot application is free software: you can redistribute
 * it and/or modify it under the terms of the GNU Affero General Public
 * License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *
 * norabot application is distributed in the hope that it will
 * be useful, but WITHOUT ANY WARRANTY; without even the implied warranty
 * of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU A General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with norabot.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @license AGPL-3.0+ <http://spdx.org/licenses/AGPL-3.0+>
 */

import { prefix } from "../../config.json";
import { commandCfg } from "../../index";
import Discord, { Message } from "discord.js";
import * as fs from "fs";

module.exports = {
  name: "help",
  description: "Lists all commands, or specific info for a command",
  aliases: ["commands"],
  usage: "b?help {command}",
  cooldown: 0,
  guildOnly: false,
  adminReq: false,
  argsRequired: false,
  execute(message: Message, args: string[]) {
    var commands = new Map();
    var aliases = new Map();

    const embedInitial = new Discord.RichEmbed()
      .setTitle(`**List of Commands:**`)
      .setDescription(
        `\nUse \`${
          commandCfg["basic"].prefix
        }${prefix}help [command name]\` to get info on a specific command.`
      )
      .setColor(0x00ae86)
      .setTimestamp();

    const commandFolders = fs.readdirSync("./commands/");
    for (const folder of commandFolders) {
      let commandList = [];
      const commandFiles = fs
        .readdirSync(`./commands/${folder}`)
        .filter(file => file.endsWith(".ts"));
      for (const file of commandFiles) {
        const command = require(`../${folder}/${file}`);
        commandList.push(command.name);
        command.name;
        if (!commands.has(command.name)) {
          commands.set(command.name, command);
          command.aliases.forEach((element: string) => {
            aliases.set(element, command);
          });
        }
      }
      let groupConfig = commandCfg[folder];
      let embedFieldBody = "`" + commandList.join("`, `") + "`";
      embedInitial.addField(
        groupConfig.group + " (`" + groupConfig.prefix + prefix + "`)",
        embedFieldBody
      );
    }

    if (!args.length) {
      return message.author
        .send(embedInitial)
        .then(() => {
          if (message.channel.type === "dm") return;
          message.reply(`Help is in your DM's!`);
        })
        .catch(error => {
          console.error(error);
          message.reply(
            `I can't seem like I can\'t DM you! Do you have DMs disabled?`
          );
        });
    }

    const name = args[0].toLowerCase();
    const command = commands.get(name) || aliases.get(name);

    if (!command) {
      return message.reply(`Sorry, that's not a valid command`);
    }

    const embed = new Discord.RichEmbed()
      .setTitle(`**${command.name}**`)
      .setColor(0x00ae86)
      .setTimestamp();
    if (command.aliases) embed.addField("**Aliases:**", command.aliases);
    if (command.description)
      embed.addField("**Description:**", command.description);
    if (command.usage) embed.addField("**Usage:**", command.usage);
    if (command.cooldown) embed.addField("**Cooldown:**", command.cooldown);

    message.channel.send(embed);
  }
};
