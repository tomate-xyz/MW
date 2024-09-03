import {
    EmbedBuilder
} from "discord.js";
import fs from "fs";
import path from "path";

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


export function easyLog(message, state, serverID) {
    const logDir = path.join('./logs');

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0];

    const logEntry = `[${dateStr}:${timeStr}] [${state}] ${message}\n`;

    const serverLogDir = path.join(logDir, serverID);
    const logFile = path.join(serverLogDir, `${dateStr}.log`);
    const latestLogFile = path.join(serverLogDir, 'latest.log');

    if (!fs.existsSync(serverLogDir)) {
        fs.mkdirSync(serverLogDir, {
            recursive: true
        });
    }

    fs.appendFileSync(logFile, logEntry, 'utf8');
    fs.writeFileSync(latestLogFile, logEntry, {
        flag: 'a',
        encoding: 'utf8'
    });
}