import {
    ApplicationCommandOptionType,
    AttachmentBuilder
} from "discord.js";
import {
    createCanvas,
    loadImage
} from "@napi-rs/canvas";
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
        try {
            await interaction.deferReply();

            const imageURL = interaction.options.getAttachment('image').proxyURL;
            const multiplier = interaction.options.getNumber('multiplier');

            if (!isPngOrJpg(imageURL)) {
                return interaction.editReply({
                    embeds: [easyEmbed("#ff0000", "Attachment is not a png/jpg image")]
                });
            }

            const image = await loadImage(imageURL);
            let canvas;

            try {
                canvas = createCanvas(image.width * multiplier, image.height);
            } catch {
                return interaction.editReply({
                    embeds: [easyEmbed("#ff0000", "Image width is too long")]
                });
            }

            const ctx = canvas.getContext('2d');
            ctx.drawImage(image, 0, 0, image.width * multiplier, image.height);

            const format = getFormatFromUrl(imageURL);
            const buffer = canvas.toBuffer(`image/${format}`);
            const attachment = new AttachmentBuilder(buffer, {
                name: `mw-stretch.${format}`
            });

            interaction.editReply({
                files: [attachment]
            });
        } catch {
            return interaction.editReply({
                embeds: [easyEmbed("#ff0000", "An error occurred while processing the image")]
            });
        }
    },
};

function isPngOrJpg(url) {
    const urlWithoutQuery = url.split('?')[0].toLowerCase();
    return urlWithoutQuery.endsWith('.png') ||
        urlWithoutQuery.endsWith('.jpg') ||
        urlWithoutQuery.endsWith('.jpeg');
}

function getFormatFromUrl(url) {
    const urlWithoutQuery = url.split('?')[0].toLowerCase();
    if (urlWithoutQuery.endsWith('.png')) return 'png';
    if (urlWithoutQuery.endsWith('.jpg') || urlWithoutQuery.endsWith('.jpeg')) return 'jpeg';
    return 'png';
}