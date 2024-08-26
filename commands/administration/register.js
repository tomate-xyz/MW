import {
    registerAllCommands
} from "../../bot_modules/bot.js";
import dotenv from 'dotenv';
dotenv.config()

export default {
    name: "register",
    description: "Register all commands",
    devOnly: true,
    default_member_permissions: 'Administrator',

    async execute(interaction, client) {
        const guildId = process.env.GUILD_ID;
        registerAllCommands(guildId);

        interaction.reply({
            content: `Successfully registered all commands for guild \`${guildId}\` ✅`,
            ephemeral: true
        });
    },
};