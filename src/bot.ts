import dotenv from 'dotenv';
dotenv.config();

import { Client, Message, PresenceData, GuildChannel } from 'discord.js';
import { prefix } from './config.json';
import { messageManage } from './messages/messages';

const client: Client = new Client();


client.on('ready', () => {
  console.log('Bot is ready');

  client.user.setPresence({
    status: "online",
    game: {
      name: "Use & to call me",
      type: "PLAYING"
    }
  });

});

client.on('message', async (message: Message) => {
  messageManage(client, message, prefix);
});


client.on("guildCreate", (guild) => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);

  const channel: GuildChannel = guild.channels.find(t => t.name == 'general');
  if (!channel) return;
  // @ts-ignore
  channel.send('Ya llegue cerranos de mierda');

});


client.on("guildMemberAdd", (member) => {

  const channel: GuildChannel = member.guild.channels.find(t => t.name == 'general');
  if (!channel) return;

  // @ts-ignore
  //guild.channels.find(t => t.name == 'general').send(`Ya llego el baboso de ${member}`);
  channel.send(`Ya llego el baboso/a de <@${member.user.id}>`);

});



client.login(process.env.DISCORD_TOKEN);




