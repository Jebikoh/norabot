const Discord = require('discord.js');

module.exports = {
    name: 'guild',
    description: 'Get information about the current server',
    aliases: ['g'],
    usage: `[command]`,
    group: 'Basic',
    execute(message) {
        const embed = new Discord.RichEmbed()
            .setTitle(`**${message.guild.name}**`)
            .setColor(0x00AE86)
            .setDescription("Below is information about your server:")
            .setThumbnail(`${message.guild.iconURL}`)
            .setTimestamp()
            .addField(`Member Count:` ,`${message.guild.memberCount}`)
            .addField(`Server:`, `${message.guild.region}`)
            .addField(`AFK Timeout:`, `${message.guild.afkTimeout}`)
            .addField(`AFK Channel:`, `${message.guild.afkChannel}`)
            .addField(`Default Channel:`, `${message.guild.defaultChannel}`)
            .addField(`Date of Formation:`, `${message.guild.createdAt}`);

        message.channel.send({embed});
    }
};