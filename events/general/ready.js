import {
  ActivityType
} from "discord.js";

export default {
  name: "ready",
  once: true,

  execute(client) {
    console.log(`✅ ${client.user.tag} is online.\n`);

    function updatePresence() {
      const uptime = process.uptime();
      const formattedUptime = formatUptime(uptime);

      client.user.setPresence({
        activities: [{
          type: ActivityType.Custom,
          name: "custom",
          state: `🗣️ ${formattedUptime}`
        }]
      })
    }

    updatePresence();
    setInterval(updatePresence, 30000);
  }
};

function formatUptime(uptime) {
  let totalSeconds = uptime;
  let days = Math.floor(totalSeconds / 86400);
  totalSeconds %= 86400;
  let hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  let minutes = Math.floor(totalSeconds / 60);

  let formattedDays = String(days).padStart(2, '0');
  let formattedHours = String(hours).padStart(2, '0');
  let formattedMinutes = String(minutes).padStart(2, '0');

  console.log(`${formattedDays}d ${formattedHours}h ${formattedMinutes}m`, process.uptime());

  return `${formattedDays}d ${formattedHours}h ${formattedMinutes}m`;
}