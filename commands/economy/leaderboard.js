import {
    getRichestUsers
} from "../../database/handleData.js";

export default {
    name: "leaderboard",
    description: "Display the top 5 richest users",

    async execute(interaction) {
        await interaction.deferReply();
        const users = await getRichestUsers(interaction.guild.id);
        let leaderboard = "**Top 5 Richest Users**\n"

        users.forEach((user, index) => {
            const placement = index + 1;
            leaderboard += `> ${placement}. <@${user.userID}> \`${user.money}€\`\n`
        })

        return interaction.editReply({
            content: leaderboard,
            ephemeral: true,
            allowedMentions: {
                parse: []
            }
        });
    },
};