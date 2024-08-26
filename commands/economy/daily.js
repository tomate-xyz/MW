import {
    easyEmbed
} from "../../bot_modules/utils.js";
import {
    getUserMoney,
    setUserMoney,
    getUserDailyTimestamp,
    setUserDailyTimestamp
} from "../../database/handleData.js";

export default {
    name: "daily",
    description: "Claim your daily money",
    devOnly: true,

    async execute(interaction) {
        const userID = interaction.user.id;

        const currentTime = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;
        const lastDailyTimestamp = await getUserDailyTimestamp(userID);
        const timeDifference = currentTime - lastDailyTimestamp;
        const isDailyAvailable = timeDifference >= oneDay;

        if (isDailyAvailable) {
            const randomMoney = Math.floor(Math.random() * 10) + 1;
            const money = await getUserMoney(userID) + randomMoney;

            setUserDailyTimestamp(userID, currentTime);
            setUserMoney(userID, money);
            interaction.reply({
                embeds: [easyEmbed("#2564ff", "Daily Money", `Claimed \`${randomMoney}€\`!`)]
            });
        } else {
            interaction.reply({
                embeds: [easyEmbed("#ffff00", "Daily Money", `Try again <t:${Math.floor((await getUserDailyTimestamp(userID) + oneDay) / 1000)}:R>!`)],
                ephemeral: true
            });
        }
    },
};