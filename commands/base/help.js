const { prefix } = require('../../config.json');
const Discord = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Lists all commands, or specific info for a command',
    aliases: ['commands'],
    usage: '[command name]',
    cooldown: 0,
    group: 'Basic',
    execute(message, args) {
        const { commands } = message.client;

        const embedInitial = new Discord.RichEmbed()
            .setTitle(`**List of Commands:**`)
            .setDescription(`\nUse \`${prefix}help [command name]\` to get info on a specific command`)
            .setColor(0x00AE86)
            .setTimestamp();

        if (!args.length) {
            let commandList = commands.map(command => { return {name: command.name, group: command.group} });
            let commandGroups = commands.map(command => command.group).filter(onlyUnique);

            function onlyUnique(value, index, self) {
                return self.indexOf(value) === index;
            }

            for (i = 0; i < commandGroups.length; i++) {
                let currentGroup = commandGroups[i];
                let groupCommands = [];

                for (x = 0; x < commandList.length; x++) {
                    if (commandList[x]["group"] === currentGroup) {
                        groupCommands.push(commandList[x]["name"]);
                    }
                }

                let embedFieldBody = "`" + groupCommands.join("`, `") + "`";
                embedInitial.addField(currentGroup, embedFieldBody);
            }

            return message.author.send(embedInitial)
                .then(() => {
                    if (message.channel.type === 'dm') return;
                    message.reply(`Help is in your DM's!`);
                })
                .catch(error => {
                    console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                    message.reply(`I can't seem like I can\'t DM you! Do you have DMs disabled?`);
                });
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply(`Sorry, that's not a valid command`);
        }

        const embed = new Discord.RichEmbed()
            .setTitle(`**${command.name}**`)
            .setColor(0x00AE86)
            .setTimestamp();
        if (command.aliases) embed.addField("**Aliases:**", command.aliases);
        if (command.description) embed.addField("**Description:**", command.description);
        if (command.usage) embed.addField("**Usage:**", command.usage);
        if (command.cooldown) embed.addField("**Cooldown:**", command.cooldown);

        message.channel.send(embed);
    },
};