import {
    ApplicationCommandOptionType,
    AttachmentBuilder
} from "discord.js";
import {
    createCanvas,
    loadImage
} from "canvas";
import {
    easyEmbed
} from "../../bot_modules/utils.js";

export default {
    name: "stretch",
    description: "Stretch images",
    options: [{
            name: "image",
            description: "Image to modify (png/jpg)",
            type: ApplicationCommandOptionType.Attachment,
            required: true
        },
        {
            name: "multiplier",
            description: "Multiplier of the stretch",
            type: ApplicationCommandOptionType.Number,
            required: true,
            min_value: 1,
            max_value: 99
        }
    ],

    async execute(interaction, client) {
        const imageURL = interaction.options.getAttachment('image').proxyURL;
        const multiplier = interaction.options.getNumber('multiplier');

        if (!isPngOrJpg(imageURL)) {
            return interaction.reply({
                embeds: [easyEmbed("#ff0000", "Attachment is not a png/jpg image")],
                ephemeral: true
            });
        }

        const image = await loadImage(imageURL);
        let canvas;

        try {
            canvas = createCanvas(image.width * multiplier, image.height)
        } catch {
            return interaction.reply({
                embeds: [easyEmbed("#ff0000", "Image width is too long")],
                ephemeral: true
            })
        }

        const ctx = canvas.getContext('2d');

        ctx.drawImage(image, 0, 0, image.width * multiplier, image.height);

        const buffer = canvas.toBuffer();
        const attachment = new AttachmentBuilder(buffer, {
            name: 'mw-stretch.gif'
        });

        return interaction.reply({
            files: [attachment]
        });
    },
};

function isPngOrJpg(url) {
    const urlWithoutQuery = url.split('?')[0].toLowerCase();
    return urlWithoutQuery.endsWith('.png') ||
        urlWithoutQuery.endsWith('.jpg') ||
        urlWithoutQuery.endsWith('.jpeg');
}