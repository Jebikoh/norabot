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
    execute(message, args) {
        let patch;
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
                patch = await getVersionJson();
            } catch (error) {
                console.error(error);
            }
        }

        generateJsonLink();
        console.log(patch[0]);
    }
};