export default {
  name: "ping",
  description: "Pong!",
  default_member_permissions: 'Administrator',

  async execute(interaction, client) {
    interaction.reply({
      content: `> Latency: \`${Date.now() - interaction.createdTimestamp}ms\`\n> API Latency: \`${Math.round(client.ws.ping)}ms\``,
      ephemeral: true
    });
  },
};