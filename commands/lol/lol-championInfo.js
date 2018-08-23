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


// process.env.LEAGUE_API_PLATFORM_ID = 'na1';

const Discord = require('discord.js');

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

var $ = jQuery = require('jquery')(window);

// const { riotapi } = require('../config.json');
//
// const LeagueJs = require('leaguejs');
// const LeagueJsInstance = new LeagueJs(riotapi);

module.exports = {
    name: 'lol-champ',
    description: 'Retrieves information about a specific champion',
    aliases: ['lolc'],
    usage: `[command champion]`,
    group: 'LoL',
    execute(message, args) {
        // let championName = args[0];

        function getVersionJson() {
            return new Promise(function (resolve, reject) {
                $.getJSON('https://ddragon.leagueoflegends.com/api/versions.json', function(error, data) {
                    if (error) return reject(error);
                    resolve(data);
                });
            });
        }

        async function generateJsonLink() {
            try {
                let patch = await getVersionJson();
                console.log(patch[0]);
            } catch (error) {
                console.error(error);
            }
        }

        generateJsonLink();
    }
};