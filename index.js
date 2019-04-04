"use strict";
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
var Discord = __importStar(require("discord.js"));
var _a = require("./config.json"), prefix = _a.prefix, token = _a.token;
var commands_json_1 = __importDefault(require("commands.json"));
var Command = /** @class */ (function () {
    function Command() {
    }
    return Command;
}());
exports.Command = Command;
var client = new Discord.Client({ sync: true });
// REPLACE ANY
var prefixes = new Discord.Collection();
var commandFolders = fs.readdirSync('./commands');
for (var _i = 0, commandFolders_1 = commandFolders; _i < commandFolders_1.length; _i++) {
    var folder = commandFolders_1[_i];
    var commands = new Discord.Collection();
    var commandFiles = fs.readdirSync("./commands/" + folder).filter(function (file) { return file.endsWith('.js'); });
    for (var _b = 0, commandFiles_1 = commandFiles; _b < commandFiles_1.length; _b++) {
        var file = commandFiles_1[_b];
        var command = require("./commands/" + folder + "/" + file);
        commands.set(command.name, command);
    }
    prefixes.set(commands_json_1.default[folder].prefix, commands);
    commands.set('name', commands_json_1.default[folder].prefix);
}
var cooldowns = new Discord.Collection();
// const sequelize = new Sequelize('database', 'user', 'password', {
//     host: 'localhost',
//     dialect: 'sqlite',
//     logging: false,
//     operatorsAliases: false,
//     // SQLite only
//     storage: 'database.sqlite',
// });
// // Define Database
// const Tags = sequelize.define('tags', {
//     guildid: {
//         type: Sequelize.STRING,
//         unique: true,
//         allowNull: false,
//     },
//     defchan: {
//         type: Sequelize.TEXT,
//         unique: true,
//     },
// });
// module.exports.tags = Tags;
// module.exports.client = client;
client.on('ready', function () {
    console.log('Ready!');
    // Tags.sync().then(() => console.log("Synced!"));
});
client.on('message', function (message) {
    if (message.author.bot)
        return;
    var commandType;
    // Find the command group the the command belongs to
    prefixes.forEach(function (prefixCollection) {
        if (message.content.startsWith(prefixCollection[1].get('name') + prefix)) {
            commandType = prefixCollection[1].get('name');
        }
    });
    if (!commandType)
        return;
    // Get possible arguments & command name used (full name or alias)
    var args = message.content.slice(commandType.length + prefix.length).split(/ +/);
    var commandName = args.shift().toLowerCase();
    // Check if the command exists under the command type (full name of alias)
    var command = prefixes.get(commandType).get(commandName)
        || prefixes.get(commandType).find(function (cmd) { return cmd.aliases && cmd.aliases.includes(commandName); });
    if (!command)
        return;
    // Handle guild-only commands
    if (command.guildOnly && message.channel.type !== 'text') {
        return message.reply("Sorry, but you can only use that command on servers!");
    }
    // Handle administrator-only commands
    if (command.adminReq && !message.member.hasPermission("ADMINISTRATOR")) {
        return message.reply("You don't have the adequate permissions!");
    }
    // Handle insufficient arguments
    if (command.args && !args.length) {
        var reply = "You didn't provide the necessary arguments, " + message.author + "! ";
        if (command.usage) {
            reply += "\nThe proper usage would be: `" + prefix + command.name + " " + command.usage + "`";
        }
        return message.channel.send(reply);
    }
    // Handle commands w/o cooldowns
    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }
    var now = Date.now();
    var timestamps = cooldowns.get(command.name);
    var cooldownAmount = (command.cooldown) * 1000;
    // Start cooldown for commands w/ cooldowns
    if (!timestamps.has(message.author.id)) {
        timestamps.set(message.author.id, now);
        setTimeout(function () { return timestamps.delete(message.author.id); }, cooldownAmount);
    }
    // Handle commands w/ cooldowns
    else {
        var expirationTime = timestamps.get(message.author.id) + cooldownAmount;
        if (now < expirationTime) {
            var timeLeft = (expirationTime - now) / 1000;
            return message.reply("Please wait " + timeLeft.toFixed(1) + " before trying again");
        }
        timestamps.set(message.author.id, now);
        setTimeout(function () { return timestamps.delete(message.author.id); }, cooldownAmount);
    }
    // Execute the command
    try {
        command.execute(message, args);
    }
    catch (error) {
        console.error(error);
        message.reply('Sorry, something went wrong! If the issue persists, please contact a developer').then(function (msg) {
            if (message.channel.type != 'dm') {
                msg.delete(8000);
            }
        }).catch(function (err) {
            console.log(err);
        });
        message.delete(8000).then(function (msg) {
            if (message.channel.type != 'dm') {
                msg.delete(8000);
            }
        });
    }
});
client.login(token);
process.on('unhandledRejection', console.error);
