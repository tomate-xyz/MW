// import * as utils from '../../bot_modules/utils.js';
// import {
//     createAudioPlayer,
//     createAudioResource,
//     joinVoiceChannel,
//     getVoiceConnection
// } from "@discordjs/voice";
// import {
//     ApplicationCommandOptionType
// } from "discord.js";

// export default {
//     name: "audio",
//     description: "Manage the audioplayer, play & stop",
//     options: [{
//             name: "play",
//             description: "Play an audio by direct source",
//             type: ApplicationCommandOptionType.Subcommand,
//             options: [{
//                 name: "source",
//                 description: "Audio source",
//                 type: ApplicationCommandOptionType.String,
//                 required: true,
//             }]
//         },
//         {
//             name: "stop",
//             description: "Stop the current audio",
//             type: ApplicationCommandOptionType.Subcommand,
//         }
//     ],

//     async execute(interaction, client) {
//         const channel = interaction.member.voice.channel;

//         if (!channel) {
//             return interaction.reply({
//                 embeds: [utils.easyEmbed("#ffff00", "You must be in a voice channel to use this command")],
//                 ephemeral: true
//             });
//         }

//         const subcommand = interaction.options.getSubcommand();

//         if (subcommand === "play") {
//             try {
//                 const source = createAudioResource(interaction.options.get("source").value);

//                 const connection = joinVoiceChannel({
//                     channelId: channel.id,
//                     guildId: channel.guild.id,
//                     adapterCreator: channel.guild.voiceAdapterCreator,
//                 });

//                 const player = createAudioPlayer();
//                 const subscription = connection.subscribe(player);

//                 console.log(source)

//                 player.play(source);
//             } catch (error) {
//                 console.log(error)
//                 return interaction.reply({
//                     embeds: [utils.easyEmbed("#ff0000", "An Error occured")],
//                     ephemeral: true
//                 });
//             }
//         } else if (subcommand === "stop") {
//             const connection = getVoiceConnection(interaction.guild.id);

//             if (!connection) {
//                 return interaction.reply({
//                     embeds: [utils.easyEmbed("#ffff00", "There is no audio being played right now")],
//                     ephemeral: true
//                 });
//             }

//             const player = connection.subscriptions.find(subscription => subscription.player);

//             if (player) {
//                 player.stop();
//                 connection.disconnect();
//                 interaction.reply({
//                     embeds: [utils.easyEmbed("#00ffff", "Audio playback stopped")],
//                     ephemeral: true
//                 });
//             } else {
//                 interaction.reply({
//                     embeds: [utils.easyEmbed("#ffff00", "")],
//                     ephemeral: true
//                 });
//             }
//         }
//     },
// };