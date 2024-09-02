import {
    ApplicationCommandOptionType
} from "discord.js";
import {
    getUserMoney,
    modifyUserMoney
} from "../../database/handleData.js";
import {
    easyEmbed
} from "../../bot_modules/utils.js";

export default {
    name: "modmoney",
    description: "Modify user money",
    devOnly: true,
    default_member_permissions: 'Administrator',
    options: [{
            name: "user",
            description: "User to modify",
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: "amount",
            description: "Money by amount",
            type: ApplicationCommandOptionType.Integer,
            required: true,
            min_value: -9999,
            max_value: 9999
        }
    ],

    async execute(interaction, client) {
        const serverID = interaction.guild.id;
        const userID = interaction.options.getUser('user');
        const amount = interaction.options.getInteger('amount');

        await modifyUserMoney(serverID, userID, amount);

        const money = await getUserMoney(serverID, userID);

        return interaction.reply({
            embeds: [easyEmbed("#00ff00", "Transaction", `Set money of <@${userID}> to \`${money}€\``)],
            ephemeral: true
        });
    },
};