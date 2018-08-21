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
    aliases: ['lolcmp'],
    usage: `[command champion]`,
    execute(message, args) {
        // Get the latest patch version from datadragon's version.json
        var jsonLink;
        var championJSON;
        let championName = args[0];

        $.getJSON('https://ddragon.leagueoflegends.com/api/versions.json', function(data) {
            handleDataDragon(data);
        });

        function handleDataDragon(data) {
            var patch = data[0];
            let jsonLink = "http://ddragon.leagueoflegends.com/cdn/" + patch + "/data/en_US/champion/" + championName + ".json";

        }
    }
};