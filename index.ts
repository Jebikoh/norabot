import { VoiceConnection } from "discord.js";
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

// Libraries
import * as fs from "fs";
import * as Discord from "discord.js";

// Types & Utilities
import {
  isUndefined,
  isNull,
  isString,
  isNumber,
  deleteMessage
} from "./utils";
import Command from "./types/Command";
// import NoraClient from "./types/NoraClient";
import AudioLength from "./types/AudioLength";

// Configuration
import { prefix, token, deleteTimer } from "./config.json";
import commandConfig from "./commands.json";

// Create server data mapping
export let servers: {
  [guildId: string]: {
    queue: {
      url: string;
      title: string;
      thumbnailUrl: string;
      authorUrl: string;
      length: AudioLength;
    }[];
    dispatcher?: Discord.StreamDispatcher;
    boombox: boolean;
  };
} = {};

export class NoraClient extends Discord.Client {
  handler: any;
  prefixes: Discord.Collection<
    string,
    Discord.Collection<string, string | Command>
  >;
  constructor(props: {
    clientOptions: Discord.ClientOptions;
    commandFolder: string;
  }) {
    super(props.clientOptions);
    this.prefixes = new Discord.Collection();
    const commandFolders: string[] = fs.readdirSync(props.commandFolder);

    for (const folder of commandFolders) {
      const commands: Discord.Collection<
        string,
        any
      > = new Discord.Collection();
      const commandFiles: string[] = fs
        .readdirSync(`./commands/${folder}`)
        .filter(file => file.endsWith(".ts"));
      for (const file of commandFiles) {
        const command: any = require(`./commands/${folder}/${file}`);
        commands.set(command.name, command);
      }
      this.prefixes.set(commandCfg[folder].prefix, commands);
      commands.set("name", commandCfg[folder].prefix);
    }
  }
}

// Create command configuration
export const commandCfg: {
  [index: string]: { prefix: string; group: string };
} = commandConfig;

const client = new NoraClient({
  clientOptions: { sync: true },
  commandFolder: "./commands"
});

// Cooldown Mapping
const cooldowns: Discord.Collection<
  string,
  Discord.Collection<string, number>
> = new Discord.Collection();

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message", message => {
  if (message.author.bot) return;

  let commandType: string | undefined;

  for (const prefixes of client.prefixes) {
    if (message.content.startsWith(prefixes[1].get("name") + prefix)) {
      commandType = prefixes[1].get("name") as string;
    }
  }

  if (isUndefined(commandType)) return;

  // Get possible arguments & command name used (full name or alias)
  const args: string[] = message.content
    .slice(commandType.length + prefix.length)
    .split(/ +/);

  const _commandName: string | undefined = args.shift();
  if (!_commandName) return;
  const commandName: string = _commandName.toLowerCase();

  const possibleCommands:
    | Discord.Collection<string, string | Command>
    | undefined = client.prefixes.get(commandType);
  if (isUndefined(possibleCommands)) return;
  // Check if the command exists under the command type (full name of alias)
  // const command = client.prefixes.get(commandType).get(commandName)
  //     || client.prefixes.get(commandType).find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  const command = (possibleCommands.get(commandName) ||
    possibleCommands.find((cmd: string | Command) => {
      if (isString(cmd)) return false;
      if (cmd.aliases && cmd.aliases.includes(commandName)) return true;
      else return false;
    })) as Command;

  if (isNull(command)) return;

  // Handle guild-only commands
  if (command.guildOnly && message.channel.type !== "text") {
    return message.reply(
      "Sorry, but you can only use that command on servers!"
    );
  }

  // Handle administrator-only commands
  if (command.adminRequired && !message.member.hasPermission("ADMINISTRATOR")) {
    return message.reply("You don't have the adequate permissions!");
  }

  // Handle insufficient arguments
  if (command.argsRequired && !args.length) {
    let reply = `You didn't provide the necessary arguments, ${
      message.author
    }! `;

    if (command.usage) {
      reply += `\nThe proper usage would be: \`${commandType}${prefix}${
        command.name
      } ${command.usage}\``;
    }

    return message.channel.send(reply);
  }

  // Handle commands w/o cooldowns
  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }

  if (command.voiceRequired) {
    // Add to registry if not already there
    if (!servers[message.guild.id]) {
      servers[message.guild.id] = { queue: [], boombox: false };
    }
    // Return if the user is nohttps://www.youtube.com/watch?v=LwFBz2_qQfkt in a voice channel
    if (!message.member.voiceChannel) {
      return message.channel.send("You need to be in a voice channel!");
    }
  }

  const now = Date.now();
  const timestamps:
    | Discord.Collection<string, number>
    | undefined = cooldowns.get(command.name);

  const cooldownAmount = command.cooldown * 1000;

  // Start cooldown for commands w/ cooldowns
  if (!isUndefined(timestamps)) {
    if (!timestamps.has(message.author.id)) {
      timestamps.set(message.author.id, now);
      setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }
    // Handle commands w/ cooldowns
    else {
      const userCooldown: number | undefined = timestamps.get(
        message.author.id
      );
      //  + cooldownAmount;
      if (isNumber(userCooldown)) {
        const expirationTime = userCooldown + cooldownAmount;
        if (now < expirationTime) {
          const timeLeft = (expirationTime - now) / 1000;
          return message.reply(
            `Please wait ${timeLeft.toFixed(1)} before trying again`
          );
        }
      }

      timestamps.set(message.author.id, now);
      setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }
  }

  // Execute the command
  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message
      .reply(
        "Sorry, something went wrong! If the issue persists, please contact a developer"
      )
      .then((msg: Discord.Message | Discord.Message[]) => {
        if (message.channel.type != "dm") {
          deleteMessage(msg);
        }
      });
    message.delete(deleteTimer).then(msg => {
      if (message.channel.type != "dm") {
        msg.delete(deleteTimer);
      }
    });
  }
});

client.login(token);
process.on("unhandledRejection", console.error);
