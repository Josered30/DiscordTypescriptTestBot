"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const discord_js_1 = require("discord.js");
const config_json_1 = require("./config.json");
const messages_1 = require("./messages/messages");
const client = new discord_js_1.Client();
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
client.on('message', async (message) => {
    messages_1.messageManage(client, message, config_json_1.prefix);
});
client.on("guildCreate", (guild) => {
    // This event triggers when the bot joins a guild.
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
    const channel = guild.channels.find(t => t.name == 'general');
    if (!channel)
        return;
    // @ts-ignore
    channel.send('Ya llegue cerranos de mierda');
});
client.on("guildMemberAdd", (member) => {
    const channel = member.guild.channels.find(t => t.name == 'general');
    if (!channel)
        return;
    // @ts-ignore
    //guild.channels.find(t => t.name == 'general').send(`Ya llego el baboso de ${member}`);
    channel.send(`Ya llego el baboso/a de <@${member.user.id}>`);
});
client.login(process.env.DISCORD_TOKEN);
//# sourceMappingURL=bot.js.map