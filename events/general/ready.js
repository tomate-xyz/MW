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
    setInterval(updatePresence, 30000)
  }
};

function formatUptime(uptime) {
  const days = Math.floor(uptime / (24 * 3600));
  uptime %= 24 * 3600;
  const hours = Math.floor(uptime / 3600);
  uptime %= 3600;
  const minutes = Math.floor(uptime / 60);

  return `${days}d ${hours}h ${minutes}m`
}