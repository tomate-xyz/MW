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

        const member = await interaction.guilf.members.fetch(userID);

        const currentTime = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;
        const lastDailyTimestamp = await getUserDailyTimestamp(serverID, userID);
        const timeDifference = currentTime - lastDailyTimestamp;
        const isDailyAvailable = timeDifference >= oneDay;

        if (isDailyAvailable) {
            let message;
            const randomMoney = Math.floor(Math.random() * 10) + 1;
            const boostRandomMoney = Math.floor(Math.random() * 10) + 1;

            message = `> 🪙 Daily Money\n> Claimed \`${randomMoney}€\``;

            if (member.premiumSinceTimestamp) {
                message = `> 🪙 Daily Money\n> Claimed \`${randomMoney}€\` + \`${boostRandomMoney}€\` Booster Bonus`
                modifyUserMoney(serverID, userID, boostRandomMoney);
            }

            setUserDailyTimestamp(serverID, userID, currentTime);
            modifyUserMoney(serverID, userID, randomMoney);

            interaction.reply({
                content: message
            });
            easyLog(`User ${userID} claimed ${randomMoney}€`, 'INFO', serverID);
        } else {
            interaction.reply({
                embeds: [easyEmbed("#ff0000", "Daily Money", `Try again <t:${Math.floor((await getUserDailyTimestamp(serverID, userID) + oneDay) / 1000)}:R>!`)],
                ephemeral: true
            });
        }
    },
};