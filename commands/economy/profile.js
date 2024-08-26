import {
    getUserMoney,
    getUserDailyTimestamp
} from "../../database/handleData.js";

export default {
    name: "profile",
    description: "Check your own profile",

    async execute(interaction) {
        const userID = interaction.user.id;

        interaction.reply({
            content: `> 💰 Money: \`${await getUserMoney(userID)}€\`\n> 🕑 Last Daily: <t:${Math.floor(await getUserDailyTimestamp(userID) / 1000)}:R>`,
            ephemeral: true
        });
    },
};