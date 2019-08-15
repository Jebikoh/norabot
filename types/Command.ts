import Discord from "discord.js";

export default class Command {
  name: string;
  description: string;
  aliases: string[] | undefined;
  usage: string;
  guildOnly: boolean;
  adminRequired: boolean;
  argsRequired: boolean;
  voiceRequired: boolean;
  cooldown: number;
  execute: (message: Discord.Message, args: string[]) => void;
  constructor({
    name,
    description,
    aliases,
    usage,
    guildOnly = false,
    adminRequired = false,
    argsRequired = false,
    voiceRequired = false,
    cooldown = 0,
    execute = (message: Discord.Message, args: string[] = []) => void {}
  }: {
    name: string;
    description: string;
    aliases: string[] | undefined;
    usage: string;
    guildOnly?: boolean;
    adminRequired?: boolean;
    argsRequired?: boolean;
    voiceRequired?: boolean;
    cooldown?: number;
    execute: (message: Discord.Message, args: string[]) => void;
  }) {
    this.name = name;
    this.description = description;
    this.aliases = aliases;
    this.usage = usage;
    this.guildOnly = guildOnly;
    this.adminRequired = adminRequired;
    this.execute = execute;
    this.argsRequired = argsRequired;
    this.voiceRequired = voiceRequired;
    this.cooldown = cooldown;
  }
}
