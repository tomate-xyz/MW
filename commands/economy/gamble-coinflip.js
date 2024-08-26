import {
    ApplicationCommandOptionType,
    ActionRowBuilder,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType
} from "discord.js";
import {
    modifyUserMoney,
    getUserMoney
} from "../../database/handleData.js";
import {
    easyEmbed
} from "../../bot_modules/utils.js";

export default {
    name: "gamble-coinflip",
    description: "Bet on Heads or Tails and lose all your money",
    options: [{
            name: "bet",
            description: "Bet amount",
            type: ApplicationCommandOptionType.Integer,
            required: true,
            min_value: 1
        },
        {
            name: "choice",
            description: "Heads or Tails",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [{
                    name: "Heads",
                    value: "heads"
                },
                {
                    name: "Tails",
                    value: "tails"
                }
            ]
        }
    ],

    async execute(interaction, client) {
        const bet = interaction.options.getInteger("bet");
        const choice = interaction.options.getString("choice");
        const userID = interaction.user.id;
        const serverID = interaction.guild.id;

        const money = await getUserMoney(serverID, userID);

        if (money < bet) {
            return interaction.reply({
                embeds: [easyEmbed("#ff0000", "You do not have enough money")],
                ephemeral: true
            });
        }

        await modifyUserMoney(serverID, userID, -bet);

        const headsortails = pickHeadsOrTails();
        const currentTime = Math.floor(Date.now() / 1000);
        const endTime = currentTime + 30;

        let userIds = [
            [userID, choice]
        ];
        let pot = bet;

        const headsbtn = new ButtonBuilder()
            .setCustomId("heads")
            .setLabel("Heads")
            .setStyle(ButtonStyle.Success);

        const tailsbtn = new ButtonBuilder()
            .setCustomId("tails")
            .setLabel("Tails")
            .setStyle(ButtonStyle.Success);

        const usersbtn = new ButtonBuilder()
            .setCustomId("users")
            .setLabel(`Users: ${userIds.length}`)
            .setStyle(ButtonStyle.Primary);

        const potbtn = new ButtonBuilder()
            .setCustomId("pot")
            .setLabel(`Pot: ${pot}€`)
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true);

        const embed = new EmbedBuilder()
            .setColor("#e6b400")
            .setTitle("Heads or Tails?")
            .addFields({
                name: " ",
                value: `\`\`\`Bet ${bet}€ on the correct answer!\`\`\``
            }, {
                name: " ",
                value: `Game ends <t:${endTime}:R>`
            });

        const row = new ActionRowBuilder().addComponents(
            headsbtn,
            tailsbtn,
            usersbtn,
            potbtn
        );

        const game = await interaction.reply({
            embeds: [embed],
            components: [row]
        });

        const collector = game.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 30000
        });

        collector.on("collect", async (i) => {
            if (i.customId !== "heads" && i.customId !== "tails" && i.customId !== "users") return;

            if (i.customId === "users") {
                let usersheads = [];
                let userstails = [];

                userIds.forEach(([userId, userChoice]) => {
                    if (userChoice === 'heads') {
                        usersheads.push(`<@${userId}>`);
                    } else if (userChoice === 'tails') {
                        userstails.push(`<@${userId}>`);
                    }
                });

                return i.reply({
                    content: `Heads: ${usersheads.join(', ')}\nTails: ${userstails.join(', ')}`,
                    ephemeral: true,
                    allowedMentions: {
                        parse: []
                    }
                });
            }

            const alreadyJoined = userIds.some(([id]) => id === i.user.id);

            if (!alreadyJoined) {
                const userMoney = await getUserMoney(serverID, i.user.id);

                if (userMoney < bet) {
                    return i.reply({
                        content: `You do not have enough money to participate. You only have ${userMoney}€`,
                        ephemeral: true
                    });
                }

                await modifyUserMoney(serverID, i.user.id, -bet);

                i.reply({
                    content: "Successfully entered the game!",
                    ephemeral: true
                });

                userIds.push([i.user.id, i.customId]);
                pot += bet;

                usersbtn.setLabel(`Users: ${userIds.length}`);
                potbtn.setLabel(`Pot: ${pot}€`);

                await interaction.editReply({
                    components: [row]
                });
            } else {
                i.reply({
                    content: "You have already entered this game!",
                    ephemeral: true
                });
            }
        });

        collector.on("end", async (collected) => {
            embed.spliceFields(0, 1);
            embed.spliceFields(0, 1);

            embed.addFields({
                name: " ",
                value: `\`\`\`Bet ${bet}€ on the correct answer!\`\`\``
            }, {
                name: " ",
                value: `Game ended <t:${endTime}:R>`
            });

            headsbtn.setDisabled(true);
            tailsbtn.setDisabled(true);
            usersbtn.setDisabled(true);

            await interaction.editReply({
                embeds: [embed],
                components: [row]
            });

            let winners = [];
            let losers = [];

            userIds.forEach(([userId, userChoice]) => {
                if (userChoice === headsortails) {
                    winners.push(userId);
                } else {
                    losers.push(userId);
                }
            });

            if (userIds.length === 1) {
                pot *= 2;
            } else if (losers.length === 0) {
                pot += bet;
            }

            const {
                text,
                actualpot
            } = pickEvent(pot, winners);

            const finalEmbed = new EmbedBuilder()
                .setColor("#e6b400")
                .setTitle(`It was ${capitalize(headsortails)}!`);

            const winnerFieldName = headsortails === "heads" ?
                "Chose Heads" :
                "Chose Tails";

            const loserFieldName = headsortails === "heads" ?
                "Chose Tails" :
                "Chose Heads";

            const winnerValue = winners.length > 0 ?
                winners.map(userId => `<@${userId}>`).join(", ") + text :
                `<@${client.user.id}>` + text;

            const loserValue = losers.length > 0 ?
                losers.map(userId => `<@${userId}>`).join(", ") + `\n*${getLoserText()}*` :
                `<@${client.user.id}>` + `\n*${getLoserText()}*`;

            finalEmbed.addFields({
                name: winnerFieldName,
                value: winnerValue
            }, {
                name: loserFieldName,
                value: loserValue
            });

            potbtn.setLabel(`Pot: ${pot}€`);
            await interaction.editReply({
                components: [row]
            });

            pot = actualpot;

            if (winners.length > 0) {
                const amountPerWinner = pot / winners.length;
                winners.forEach(id => modifyUserMoney(serverID, id, amountPerWinner));
            }

            await interaction.followUp({
                embeds: [finalEmbed]
            });
        });
    },
};

function pickEvent(pot, winners) {
    const randomNum = Math.random();
    const triggerChance = 0.1;

    if (randomNum < triggerChance) {
        const eventIndex = Math.floor(Math.random() * events.length);
        const event = events[eventIndex];
        return event.code(pot, winners);
    } else {
        return {
            text: `\n*Congratulations on ${winners.length !== 0 ? (pot / winners.length) : pot}€!*`,
            actualpot: pot
        };
    }
}

const events = [{
        name: "-35%",
        code: (pot, winners) => {
            pot *= 0.65;
            return {
                text: `\n*The Finanzamt took 35%.\nCongrats on ${winners.length !== 0 ? (pot / winners.length) : pot}€ anyways!*`,
                actualpot: pot
            };
        }
    },
    {
        name: "-15%",
        code: (pot, winners) => {
            pot *= 0.85;
            return {
                text: `\n*The Finanzamt took 15%.\nCongrats on ${winners.length !== 0 ? (pot / winners.length) : pot}€ anyways!*`,
                actualpot: pot
            };
        }
    },
    {
        name: "+25%",
        code: (pot, winners) => {
            pot *= 1.25;
            return {
                text: `\n*The pot somehow increased in value by 25%\nCongrats on ${winners.length !== 0 ? (pot / winners.length) : pot}€!*`,
                actualpot: pot
            };
        }
    },
    {
        name: "+40%",
        code: (pot, winners) => {
            pot *= 1.4;
            return {
                text: `\n*The pot magically increased in value by 40%\nCongrats on ${winners.length !== 0 ? (pot / winners.length) : pot}€!*`,
                actualpot: pot
            };
        }
    },
    {
        name: "insolvent",
        code: (pot, winners) => {
            pot = 0;
            return {
                text: "\n*Your plan to hide from the Finanzamt didn't work out well.\nThey took all of it, nothing is left.*",
                actualpot: pot
            };
        }
    }
];

function pickHeadsOrTails() {
    return Math.random() < 0.5 ? "tails" : "heads";
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function getLoserText() {
    return "Better luck next time!";
}