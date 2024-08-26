import {
    getUserMoney,
    getUserDailyTimestamp
} from "../../database/handleData.js";

export default {
    name: "profile",
    description: "Check your own profile",

    async execute(interaction) {
        const serverID = interaction.guild.id;
        const userID = interaction.user.id;

        interaction.reply({
            content: `> 💰 Money: \`${await getUserMoney(serverID, userID)}€\`\n> 🕑 Last Daily: <t:${Math.floor(await getUserDailyTimestamp(serverID, userID) / 1000)}:R>`,
            ephemeral: true
        });
    },
};