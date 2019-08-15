import Discord from "discord.js";
import Command from "./Command";
import * as fs from "fs";
import { commandCfg } from "../index";

export default class NoraClient extends Discord.Client {
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
