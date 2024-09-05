import {
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder
} from "discord.js";
import {
    easyArrayPicker,
    easyEmbed
} from "../../bot_modules/utils.js";
import {
    getUserMoney,
    modifyUserMoney
} from "../../database/handleData.js";

export default {
    name: "pick-gamble",
    description: "Pick a bomb and it's over. Play for 5€",

    async execute(interaction) {
        const userID = interaction.user.id;
        const serverID = interaction.guild.id;

        if (await getUserMoney(serverID, userID) < 5) {
            return interaction.reply({
                embeds: [easyEmbed("#ff0000", "You do not have enough money")],
                ephemeral: true
            });
        }

        modifyUserMoney(serverID, userID, -5);

        const availableSpaces = {
            "coin1": "🪙",
            "coin2": "🪙",
            "coin3": "🪙",
            "coin4": "🪙",
            "nothing1": "❌",
            "nothing2": "❌",
            "nothing3": "❌",
            "nothing4": "❌",
            "nothing5": "❌",
            "nothing6": "❌",
            "bomb1": "💣",
            "bomb2": "💣",
            "bomb3": "💣",
            "bomb4": "💣",
            "bomb5": "💣",
            "bomb6": "💣"
        };

        let win = 0;
        let moves = 0;
        let currentTime = Math.floor(Date.now() / 1000);
        let endTime = currentTime + 60;
        let message = `> 🎲 **Gamble Time!** Ends <t:${endTime}:R>\n> -# Spaces: 4 Coins, 6 Nothing, 6 Bombs\n> \`🪙\` Continue playing and win \`5€\`\n> \`❌\` Continue playing\n> \`💣\` Game over`;

        let buttons = [];
        const spaces = Object.keys(availableSpaces);

        while (buttons.length < 16) {
            const randomSpace = easyArrayPicker(spaces);
            if (!buttons.includes(randomSpace)) {
                buttons.push(randomSpace);
            }
        }

        const finalButtons = buttons.map(button =>
            new ButtonBuilder()
            .setCustomId(button.toString())
            .setLabel("❔")
            .setStyle(ButtonStyle.Secondary)
        );

        const actionRows = [];
        while (finalButtons.length > 0) {
            const rowButtons = finalButtons.splice(0, 4);
            const actionRow = new ActionRowBuilder().addComponents(rowButtons);
            actionRows.push(actionRow);
        }

        const messageReply = await interaction.reply({
            content: message,
            components: actionRows,
            fetchReply: true
        });

        const filter = i => i.customId in availableSpaces;
        const collector = interaction.channel.createMessageComponentCollector({
            filter,
            time: 60000
        });

        collector.on('collect', async i => {
            if (i.user.id !== userID) {
                return i.reply({
                    embeds: [easyEmbed("#ff0000", "You can't interact with this game!")],
                    ephemeral: true
                });
            }

            const content = availableSpaces[i.customId];
            let buttonStyle;

            moves++;

            switch (content) {
                case "💣":
                    buttonStyle = ButtonStyle.Danger;
                    break;
                case "🪙":
                    win += 5;
                    buttonStyle = ButtonStyle.Success;
                    break;
                default:
                    buttonStyle = ButtonStyle.Secondary;
                    break;
            }

            const button = new ButtonBuilder()
                .setCustomId(i.customId)
                .setLabel(content)
                .setStyle(buttonStyle)
                .setDisabled(true);

            const updatedRow = i.message.components.map(row => {
                const updatedComponents = row.components.map(comp => {
                    return comp.customId === i.customId ? button : comp;
                });
                return new ActionRowBuilder().addComponents(updatedComponents);
            });

            await i.update({
                content: i.message.content,
                components: updatedRow
            });

            if (content === "💣") {
                collector.stop();
            }
        });

        collector.on('end', async collected => {
            const finalRows = messageReply.components.map(row => {
                const updatedComponents = row.components.map(comp => {
                    const content = availableSpaces[comp.customId];
                    let finalButtonStyle = ButtonStyle.Secondary;

                    switch (content) {
                        case "💣":
                            finalButtonStyle = ButtonStyle.Danger;
                            break;
                        case "🪙":
                            finalButtonStyle = ButtonStyle.Success;
                            break;
                        default:
                            finalButtonStyle = ButtonStyle.Secondary;
                            break;
                    }

                    return new ButtonBuilder()
                        .setCustomId(comp.customId)
                        .setLabel(content)
                        .setStyle(finalButtonStyle)
                        .setDisabled(true);
                });
                return new ActionRowBuilder().addComponents(updatedComponents);
            });

            await interaction.editReply({
                content: `> 🎲 **Gamble Time!** Ended!\n> -# Spaces: 4 Coins, 6 Nothing, 6 Bombs\n> \`🪙\` Continue playing and win \`5€\`\n> \`❌\` Continue playing\n> \`💣\` Game over\n> \n> You won \`${win}€\` in ${moves} moves!`,
                components: finalRows
            });

            await modifyUserMoney(serverID, userID, win);
        });
    }
};