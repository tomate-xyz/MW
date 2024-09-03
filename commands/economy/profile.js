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

        const currentTime = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;
        const lastDailyTimestamp = await getUserDailyTimestamp(serverID, userID);
        const timeDifference = currentTime - lastDailyTimestamp;
        const isDailyAvailable = timeDifference >= oneDay;

        const dailyText = isDailyAvailable ? "\`Available!\`" : `<t:${Math.floor((await getUserDailyTimestamp(serverID, userID) + oneDay) / 1000)}:f>`;

        interaction.reply({
            content: `> 💰 Money: \`${await getUserMoney(serverID, userID)}€\`\n> 🕑 Next Daily: ${dailyText}`,
            ephemeral: true
        });
    },
};