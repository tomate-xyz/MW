import {
    easyArrayPicker,
    easyArrayShuffle
} from "../../bot_modules/utils.js";
import {
    countriesAndCapitals
} from "../../database/quiz.js";
import {
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder
} from 'discord.js';

export default {
    name: "quiz",
    description: "Play quizzes for prizes",

    async execute(interaction) {
        const userID = interaction.user.id;

        const topics = ["Geography", "Maths"];
        const topic = easyArrayPicker(topics);

        let currentTime = Math.floor(Date.now() / 1000);
        let endTime = currentTime + 15;

        let quizMessage = `> 🎲 **Quiz Time!** Ends <t:${endTime}:R>\n> -# Topic: ${topic}\n> `;
        let question;
        let answers = [];
        let correctAnswer;

        switch (topic) {
            case "Geography":
                const mode = Math.random() < 0.5 ? "country" : "capital";
                const countries = Object.keys(countriesAndCapitals);

                if (mode === "country") {
                    const country = easyArrayPicker(countries);
                    const correctCapital = countriesAndCapitals[country];

                    correctAnswer = correctCapital;

                    question = `What is the capital of \`${country}\`?`;
                    answers = [correctCapital];

                    const incorrectCapitals = Object.values(countriesAndCapitals).filter(capital => capital !== correctCapital);
                    while (answers.length < 4) {
                        const randomCapital = easyArrayPicker(incorrectCapitals);
                        if (!answers.includes(randomCapital)) {
                            answers.push(randomCapital);
                        }
                    }
                } else {
                    const capital = easyArrayPicker(Object.values(countriesAndCapitals));
                    const correctCountry = Object.keys(countriesAndCapitals).find(key => countriesAndCapitals[key] === capital);

                    correctAnswer = correctCountry;

                    question = `Which country has the capital \`${capital}\`?`;
                    answers = [correctCountry];

                    const incorrectCountries = countries.filter(c => c !== correctCountry);
                    while (answers.length < 4) {
                        const randomCountry = easyArrayPicker(incorrectCountries);
                        if (!answers.includes(randomCountry)) {
                            answers.push(randomCountry);
                        }
                    }
                }

                answers = easyArrayShuffle(answers);
                break;

            case "Maths":
                const num1 = Math.floor(Math.random() * 10) + 1;
                const num2 = Math.floor(Math.random() * 10) + 1;
                correctAnswer = num1 + num2;

                question = `What is ${num1} + ${num2}?`;
                answers = [correctAnswer];

                while (answers.length < 4) {
                    const wrongAnswer = Math.floor(Math.random() * 20) + 1;
                    if (!answers.includes(wrongAnswer)) {
                        answers.push(wrongAnswer);
                    }
                }

                answers = easyArrayShuffle(answers);
                break;
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

        interaction.reply({
            content: quizMessage + question,
            components: actionRows
        });

        const filter = i => i.user.id === userID && answers.map(a => a.toString()).includes(i.customId);
        const collector = interaction.channel.createMessageComponentCollector({
            filter,
            time: 15000
        });

        collector.on('collect', async i => {
            let response = '';
            if (i.customId === correctAnswer.toString()) {
                response = `> ✅ \`${i.customId}\` is correct!`;
            } else {
                response = `> ❌ \`${i.customId}\` is incorrect. The correct answer would've been \`${correctAnswer.toString()}\`!`;
            }

            actionRows.forEach(row => row.components.forEach(button => button.setDisabled(true)));

            await i.update({
                content: `> 🎲 **Quiz Time!** Ended <t:${endTime}:R>\n> -# Topic: ${topic}\n> ${question}\n> \n${response}`,
                components: actionRows
            });

            collector.stop();
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                actionRows.forEach(row => row.components.forEach(button => button.setDisabled(true)));

                interaction.editReply({
                    content: `> 🎲 **Quiz Time!** Ended <t:${endTime}:R>\n> -# Topic: ${topic}\n> ${question}\n> \n> ⌛ Time is up. The correct answer would've been \`${correctAnswer.toString()}\`!`,
                    components: actionRows
                });
            }
        });
    },
};