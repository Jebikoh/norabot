import { Message, VoiceConnection, RichEmbed } from "discord.js";
import ytdl from "ytdl-core";
import { servers } from "../../index";
import { isValidUrl, isUndefined } from "../../utils";
import Command from "../../types/Command";

function play(connection: VoiceConnection, message: Message) {
  let server = servers[message.guild.id];

  console.log(server.queue);

  server.dispatcher = connection.playStream(
    ytdl(server.queue[0].url, { filter: "audioonly", quality: "highestaudio" })
  );

  server.dispatcher.on("end", () => {
    console.log("end");

    server.queue.shift();
    if (server.queue[0]) {
      play(connection, message);
    } else {
      console.log("Disconnect");
      connection.disconnect();
    }
  });
}

module.exports = new Command({
  name: "play",
  description: "Have the bot play some music",
  aliases: ["p"],
  usage: `[url]`,
  guildOnly: true,
  voiceRequired: true,
  argsRequired: true,
  execute(message: Message, args: string[]) {
    if (!isValidUrl(args[0])) {
      message.reply("Sorry, that isn't a valid URL");
    } else {
      let server = servers[message.guild.id];

      message.channel.send("🔎 searching for `" + args[0] + "`...");

      // Send the embed
      ytdl
        .getInfo(args[0])
        .then(info => {
          const thumbnails =
            info.player_response.videoDetails.thumbnail.thumbnails;
          const hqThumbnail = thumbnails[thumbnails.length - 1].url;
          const minutes = Math.trunc(
            info.player_response.videoDetails.lengthSeconds / 60
          );
          const seconds = info.player_response.videoDetails.lengthSeconds % 60;

          server.queue.push({
            url: args[0],
            title: info.player_response.videoDetails.title,
            thumbnailUrl: hqThumbnail,
            authorUrl: info.author.avatar,
            length: {
              hours: 0,
              minutes: minutes,
              seconds: seconds
            }
          });

          const embed = new RichEmbed()
            .setTitle(info.player_response.videoDetails.title)
            .setAuthor(info.author.name, info.author.avatar)
            .setThumbnail(hqThumbnail)
            .setURL(args[0])
            .setColor("#ff0000")
            .addField("Length", minutes + ":" + seconds, true)
            .addField(
              "Viewcount",
              info.player_response.videoDetails.viewCount
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
              true
            )
            .addField("Position in Queue", server.queue.length, true);

          message.channel.send(embed);
        })
        .then(() => {
          // If the server dispatcher is undefined (meaning nothing is playing
          // Otherwise, the song will be added to the queue, and the currently running
          // play command will move onto it
          if (isUndefined(server.dispatcher)) {
            message.member.voiceChannel.join().then(connection => {
              play(connection, message);
            });
          }
        });
    }
  }
});
