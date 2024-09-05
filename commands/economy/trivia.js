import {
    easyArrayPicker,
    easyArrayShuffle,
    easyEmbed
} from "../../bot_modules/utils.js";
import {
    getUserMoney,
    modifyUserMoney
} from "../../database/handleData.js"
import {
    countriesAndCapitals,
    languages,
    sentences,
    translateLanguage
} from "../../database/trivia.js";
import {
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    AttachmentBuilder
} from 'discord.js';

export default {
    name: "trivia",
    description: "Play trivia quizzes for prizes. Play for 2€",

    async execute(interaction) {
        const userID = interaction.user.id;
        const serverID = interaction.guild.id;

        if (await getUserMoney(serverID, userID) < 2) {
            return interaction.reply({
                embeds: [easyEmbed("#ff0000", "You do not have enough money")],
                ephemeral: true
            });
        }

        modifyUserMoney(serverID, userID, -2);

        const topics = ["Geography", "Maths", "Languages"];
        const topic = easyArrayPicker(topics);

        let currentTime = Math.floor(Date.now() / 1000);
        let endTime = currentTime + 15;

        let quizMessage = `> 🎲 **Quiz Time!** Ends <t:${endTime}:R>\n> -# Topic: ${topic}\n> `;
        let question;
        let attachment;
        let answers = [];
        let correctAnswer;

        switch (topic) {
            case "Geography":
                const geo_modes = ["country", "capital", "flag"];
                const geo_mode = easyArrayPicker(geo_modes);
                const countries = Object.keys(countriesAndCapitals);

                if (geo_mode === "country") {
                    const country = easyArrayPicker(countries);
                    const correctCapital = countriesAndCapitals[country];

                    correctAnswer = correctCapital;
                    question = `What is the capital of \`${country}\`?`;
                    answers = [correctCapital];

                    const incorrectCapitals = Object.values(countriesAndCapitals).filter(capital => capital !== correctCapital);

                    while (answers.length < 5) {
                        const randomCapital = easyArrayPicker(incorrectCapitals);
                        if (!answers.includes(randomCapital)) {
                            answers.push(randomCapital);
                        }
                    }
                } else if (geo_mode === "capital") {
                    const capital = easyArrayPicker(Object.values(countriesAndCapitals));
                    const correctCountry = Object.keys(countriesAndCapitals).find(key => countriesAndCapitals[key] === capital);

                    correctAnswer = correctCountry;
                    question = `Which country has the capital \`${capital}\`?`;
                    answers = [correctCountry];

                    const incorrectCountries = countries.filter(c => c !== correctCountry);

                    while (answers.length < 5) {
                        const randomCountry = easyArrayPicker(incorrectCountries);
                        if (!answers.includes(randomCountry)) {
                            answers.push(randomCountry);
                        }
                    }
                } else {
                    const country = easyArrayPicker(countries);

                    correctAnswer = country;
                    question = "Which country does this flag belong to?";
                    answers = [country];
                    attachment = new AttachmentBuilder(`./database/flags/${country}.png`, {
                        name: 'flag.png'
                    });

                    const incorrectCountries = countries.filter(c => c !== country);

                    while (answers.length < 5) {
                        const randomCountry = easyArrayPicker(incorrectCountries);
                        if (!answers.includes(randomCountry)) {
                            answers.push(randomCountry);
                        }
                    }
                }

                answers = easyArrayShuffle(answers);
                break;

            case "Maths":
                const math_modes = ["addition", "substraction", "multiplication", "division"];
                const math_mode = easyArrayPicker(math_modes);

                if (math_mode === "addition") {
                    const num1 = Math.floor(Math.random() * 10000) + 1;
                    const num2 = Math.floor(Math.random() * 10000) + 1;

                    correctAnswer = num1 + num2;
                    question = `What is ${num1} + ${num2}?`;
                    answers = [correctAnswer];

                    while (answers.length < 5) {
                        const offset = Math.floor(Math.random() * 5) + 1;
                        const additionaloffset = Math.floor(Math.random() * 100) + 1;
                        const wrongAnswer = (Math.random() < 0.5) ? correctAnswer + offset + additionaloffset : correctAnswer - offset - additionaloffset;
                        if (!answers.includes(wrongAnswer) && wrongAnswer > 0) {
                            answers.push(wrongAnswer);
                        }
                    }

                    answers = easyArrayShuffle(answers);
                } else if (math_mode === "substraction") {
                    const num1 = Math.floor(Math.random() * 10000) + 1;
                    const num2 = Math.floor(Math.random() * 10000) + 1;

                    correctAnswer = num1 - num2;
                    question = `What is ${num1} - ${num2}?`;
                    answers = [correctAnswer];

                    while (answers.length < 5) {
                        const offset = Math.floor(Math.random() * 5) + 1;
                        const additionaloffset = Math.floor(Math.random() * 100) + 1;
                        const wrongAnswer = (Math.random() < 0.5) ? correctAnswer + offset + additionaloffset : correctAnswer - offset - additionaloffset;

                        if (!answers.includes(wrongAnswer)) {
                            answers.push(wrongAnswer);
                        }
                    }

                    answers = easyArrayShuffle(answers);
                } else if (math_mode === "multiplication") {
                    const num1 = Math.floor(Math.random() * 100) + 1;
                    const num2 = Math.floor(Math.random() * 100) + 1;

                    correctAnswer = num1 * num2;
                    question = `What is ${num1} × ${num2}?`;
                    answers = [correctAnswer];

                    while (answers.length < 5) {
                        const offset = Math.floor(Math.random() * 5) + 1;
                        const additionaloffset = Math.floor(Math.random() * 100) + 1;
                        const wrongAnswer = (Math.random() < 0.5) ? correctAnswer + offset + additionaloffset : correctAnswer - offset - additionaloffset;

                        if (!answers.includes(wrongAnswer)) {
                            answers.push(wrongAnswer);
                        }
                    }

                    answers = easyArrayShuffle(answers);
                } else {
                    const num1 = Math.floor(Math.random() * 100) + 1;
                    const num2 = Math.floor(Math.random() * 100) + 1;

                    correctAnswer = (num1 / num2).toFixed(2);
                    question = `What is ${num1} ÷ ${num2}?`;
                    answers = [correctAnswer];

                    while (answers.length < 5) {
                        const offset = Math.floor(Math.random() * 10) + 1;
                        const randomValue = Math.random() * offset;
                        const wrongAnswer = (num1 / num2 + randomValue).toFixed(2);

                        if (!answers.includes(wrongAnswer)) {
                            answers.push(wrongAnswer);
                        }
                    }

                    answers = easyArrayShuffle(answers);
                }
                break;
            case "Languages":
                const lang_modes = ["language"];
                const lang_mode = easyArrayPicker(lang_modes);
                const langs = Object.keys(languages);

                if (lang_mode === "language") {
                    const language = easyArrayPicker(langs);

                    correctAnswer = language;
                    question = `Which language is this: \`${await translateLanguage(easyArrayPicker(sentences), languages[language])}\`?`;
                    answers = [correctAnswer];

                    const incorrectLanguages = Object.keys(languages).filter(language => language !== correctAnswer);

                    while (answers.length < 5) {
                        const randomLanguage = easyArrayPicker(incorrectLanguages);
                        if (!answers.includes(randomLanguage)) {
                            answers.push(randomLanguage);
                        }
                    }
                }
                break
        }

        const buttons = answers.map(answer =>
            new ButtonBuilder()
            .setCustomId(answer.toString())
            .setLabel(answer.toString())
            .setStyle(ButtonStyle.Primary)
        );

        const actionRows = [];
        while (buttons.length > 0) {
            const rowButtons = buttons.splice(0, 5);
            const actionRow = new ActionRowBuilder().addComponents(rowButtons);
            actionRows.push(actionRow);
        }

        const replyOptions = {
            content: quizMessage + question,
            components: actionRows
        };

        if (attachment) {
            replyOptions.files = [attachment];
        }

        const messageReply = await interaction.reply(replyOptions);

        const filter = i => answers.map(a => a.toString()).includes(i.customId);
        const collector = messageReply.createMessageComponentCollector({
            filter,
            time: 15000
        });

        collector.on('collect', async i => {
            if (i.user.id !== userID) {
                return i.reply({
                    embeds: [easyEmbed("#ff0000", "You can't interact with this game!")],
                    ephemeral: true
                });
            }

            let response = '';
            if (i.customId === correctAnswer.toString()) {
                response = `> ✅ \`${i.customId}\` is correct!\n> You won \`2€\`!`;

                await modifyUserMoney(serverID, userID, 4);
            } else {
                response = `> ❌ \`${i.customId}\` is incorrect. The correct answer would've been \`${correctAnswer.toString()}\`!\n> You lost \`2€\`!`;
            }

            actionRows.forEach(row => row.components.forEach(button => button.setDisabled(true)));

            await i.update({
                content: `> 🎲 **Quiz Time!** Ended!\n> -# Topic: ${topic}\n> ${question}\n> \n${response}`,
                components: actionRows
            });

            collector.stop();
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                actionRows.forEach(row => row.components.forEach(button => button.setDisabled(true)));

                interaction.editReply({
                    content: `> 🎲 **Quiz Time!** Ended!\n> -# Topic: ${topic}\n> ${question}\n> \n> ⌛ Time is up. The correct answer would've been \`${correctAnswer}\`!\n> You lost \`2€\`!`,
                    components: actionRows
                });
            }
        });
    },
};