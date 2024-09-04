import {
    ApplicationCommandOptionType,
    AttachmentBuilder
} from "discord.js";
import {
    createCanvas,
    loadImage,
    GlobalFonts
} from "@napi-rs/canvas";
import {
    easyEmbed
} from "../../bot_modules/utils.js";

export default {
    name: "header",
    description: "Add a header to an image",
    options: [{
            name: "image",
            description: "Image to modify (png/jpg)",
            type: ApplicationCommandOptionType.Attachment,
            required: true
        },
        {
            name: "text",
            description: "Text for the header",
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],

    async execute(interaction, client) {
        try {
            await interaction.deferReply();

            const imageURL = interaction.options.getAttachment('image').proxyURL;
            const text = interaction.options.getString('text');

            if (!isPngOrJpg(imageURL)) {
                return interaction.editReply({
                    embeds: [easyEmbed("#ff0000", "Attachment is not a png/jpg image")]
                });
            }

            if (text.length > 2000) {
                return interaction.editReply({
                    embeds: [easyEmbed("#ff0000", "Text is too long")]
                });
            }

            GlobalFonts.registerFromPath("./database/fonts/Futura Condensed ExtraBold.ttf", "Futura Condensed ExtraBold");

            const image = await loadImage(imageURL);

            const bannerHeightRatio = 0.15;
            const fontSizeRatio = 0.6;

            let barHeight = image.height * bannerHeightRatio;
            let fontSize = barHeight * fontSizeRatio;

            const maxTextWidth = image.width * 0.9;
            const words = text.split(" ");
            let line = "";
            let yOffset = 0;

            const tempCanvas = createCanvas(image.width, image.height + barHeight);
            const tempCtx = tempCanvas.getContext('2d');
            tempCtx.font = `${fontSize}px "Futura Condensed ExtraBold"`;

            for (let n = 0; n < words.length; n++) {
                const testLine = line + words[n] + " ";
                const metrics = tempCtx.measureText(testLine);
                const testWidth = metrics.width;

                if (testWidth > maxTextWidth && n > 0) {
                    yOffset += fontSize;
                    line = words[n] + " ";
                } else {
                    line = testLine;
                }
            }

            yOffset += fontSize;
            barHeight = Math.max(barHeight, yOffset * 1.2);

            const canvas = createCanvas(image.width, image.height + barHeight);
            const ctx = canvas.getContext('2d');

            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, image.width, barHeight);
            ctx.drawImage(image, 0, barHeight, image.width, image.height);

            ctx.font = `${fontSize}px "Futura Condensed ExtraBold"`;
            ctx.fillStyle = 'black';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            const textX = canvas.width / 2;
            let textY = barHeight / 2 - (yOffset - fontSize) / 2;

            line = "";
            yOffset = 0;

            for (let n = 0; n < words.length; n++) {
                const testLine = line + words[n] + " ";
                const metrics = ctx.measureText(testLine);
                const testWidth = metrics.width;

                if (testWidth > maxTextWidth && n > 0) {
                    ctx.fillText(line, textX, textY + yOffset);
                    line = words[n] + " ";
                    yOffset += fontSize;
                } else {
                    line = testLine;
                }
            }

            ctx.fillText(line, textX, textY + yOffset);

            const format = getFormatFromUrl(imageURL);
            const buffer = canvas.toBuffer(`image/${format}`);
            const attachment = new AttachmentBuilder(buffer, {
                name: 'mw-header.png'
            });

            interaction.editReply({
                files: [attachment]
            });
        } catch {
            return interaction.editReply({
                embeds: [easyEmbed("#ff0000", "An error occured while processing the image")]
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