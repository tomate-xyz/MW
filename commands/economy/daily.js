import {
    easyEmbed,
    easyLog
} from "../../bot_modules/utils.js";
import {
    modifyUserMoney,
    getUserDailyTimestamp,
    setUserDailyTimestamp
} from "../../database/handleData.js";

export default {
    name: "daily",
    description: "Claim your daily money",

    async execute(interaction) {
        const serverID = interaction.guild.id;
        const userID = interaction.user.id;

        const currentTime = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;
        const lastDailyTimestamp = await getUserDailyTimestamp(serverID, userID);
        const timeDifference = currentTime - lastDailyTimestamp;
        const isDailyAvailable = timeDifference >= oneDay;

        if (isDailyAvailable) {
            const randomMoney = Math.floor(Math.random() * 10) + 1;

            setUserDailyTimestamp(serverID, userID, currentTime);
            modifyUserMoney(serverID, userID, randomMoney);
            interaction.reply({
                embeds: [easyEmbed("#2564ff", "Daily Money", `Claimed \`${randomMoney}€\`!`)]
            });
            easyLog(`User ${userID} claimed ${randomMoney}€`, 'INFO');
        } else {
            interaction.reply({
                embeds: [easyEmbed("#ffff00", "Daily Money", `Try again <t:${Math.floor((await getUserDailyTimestamp(serverID, userID) + oneDay) / 1000)}:R>!`)],
                ephemeral: true
            });
        }
    },
};