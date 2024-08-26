import {
    ApplicationCommandOptionType
} from "discord.js";
import {
    getUserMoney,
    setUserMoney
} from "../../database/handleData.js";

export default {
    name: "modmoney",
    description: "Modify user profiles",
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
        const user = interaction.options.get('user').value;
        const amount = interaction.options.get('amount').value;
        const money = await getUserMoney(user) + amount;

        setUserMoney(user, money);

        console.log(user, money);
    },
};