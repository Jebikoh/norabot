process.env.LEAGUE_API_PLATFORM_ID = 'na1'

const Discord = require('discord.js');

const { riotapi } = require('../config.json');

const LeagueJs = require('leaguejs');
const LeagueJsInstance = new LeagueJs(riotapi);

module.exports = {
    name: 'lol-user',
    description: 'Get basic profile information',
    aliases: ['lolusr'],
    usage: `[command username]`,
    execute(message, args) {
        let summonerIcon, summonerName, summonerLevel;

        LeagueJsInstance.Summoner
            .gettingByName(args[0])
            .then(data => {
                'use strict';
                console.log(data);
                summonerIcon = data.profileIconId;
                summonerName = data.name;
                summonerLevel = data.summonerLevel;

                let summonerIconURL = "http://ddragon.leagueoflegends.com/cdn/8.16.1/img/profileicon/" + summonerIcon + ".png";

                const embed = new Discord.RichEmbed()
                    .setTitle(`**` + summonerName + `**`)
                    .setColor(0x00AE86)
                    .setThumbnail(summonerIconURL)
                    .setTimestamp()
                    .addField(`Level:` , summonerLevel.toString());

                message.channel.send({embed});
            })
            .catch(err => {
                'use strict';
                console.log(err);
                message.channel.send('Sorry, something went wrong! Either you entered your summoner name wrong, or something else happened. If the issue persists, contact a dev!')
            });
    }
};