import {
  Message,
  VoiceConnection,
  RichEmbed,
  Channel,
  TextChannel,
  Guild
} from "discord.js";
import ytdl from "ytdl-core";
import { servers } from "../../index";
import { isValidUrl, isUndefined } from "../../utils";
import Command from "../../types/Command";

function play(connection: VoiceConnection, message: Message) {
  let server = servers[message.guild.id];

  server.dispatcher = connection.playStream(
    ytdl(server.queue[0].url, { filter: "audioonly", quality: "highestaudio" })
  );

  server.dispatcher.on("end", () => {
    server.queue.shift();
    if (server.queue[0]) {
      play(connection, message);
    } else {
      connection.disconnect();
    }
  });
}

module.exports = new Command({
  name: "boombox",
  description: "Create a control panel to control the music",
  aliases: ["bb"],
  usage: ``,
  guildOnly: true,
  voiceRequired: true,
  async execute(message: Message) {}
});
