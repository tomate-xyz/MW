import {
    EmbedBuilder
} from "discord.js";

export function easyEmbed(color, title, description) {
    const embed = new EmbedBuilder()
        .setColor(color ? color : "#373737")
        .setTitle(title ? title : null)
        .setDescription(description ? description : null)
    return embed;
}

export function easyArrayPicker(array) {
    const index = Math.floor(Math.random() * array.length);
    return array[index];
}

export function easyArrayShuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}