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


process.env.LEAGUE_API_PLATFORM_ID = 'na1'

const Discord = require('discord.js');

const { riotapi } = require('../../config.json');

const LeagueJs = require('leaguejs');
const LeagueJsInstance = new LeagueJs(riotapi);

module.exports = {
    name: 'lol-user',
    description: 'Get basic profile information',
    aliases: ['lolusr'],
    usage: `[command username]`,
    group: 'LoL',
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