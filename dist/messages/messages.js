"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ytdl_core_1 = __importDefault(require("ytdl-core"));
const servers = {};
function play(connection, message) {
    var server = servers[message.guild.id];
    let url = server.queue[0];
    server.dispatcher = connection.playStream(ytdl_core_1.default(url, { filter: "audioonly" }));
    server.queue.shift();
    server.dispatcher.on("end", function () {
        if (server.queue[0]) {
            //Play next in queue 
            play(connection, message);
        }
        else {
            connection.disconnect();
        }
    });
}
function checkVoiceChannel(message) {
    var server = servers[message.guild.id];
    if (!server)
        return message.channel.send("There currently isn't any music playing in this guild");
    if (message.member.voiceChannel !== message.guild.me.voiceChannel)
        return message.channel.send("Sorry, you aren't in the same voice channel as the bot");
}
async function messageManage(client, message, prefix) {
    if (message.content.startsWith(`${prefix}`)) {
        let args = message.content.substring(prefix.length).split(" ");
        switch (args[0]) {
            case 'ping':
                message.channel.send('pong');
                break;
            case 'kick':
                if (message.member.hasPermission(["KICK_MEMBERS"])) {
                    const member = message.mentions.members.first();
                    if (member) {
                        try {
                            const kickedMember = await member.kick();
                            console.log(kickedMember.user.username);
                            return message.channel.send(`${kickedMember.user.username} has been kicked`);
                        }
                        catch (e) {
                            return message.channel.send("Error");
                        }
                    }
                }
                return message.reply('You need permitions');
                break;
            case 'deletemessages':
                const messages = await message.channel.fetchMessages();
                await message.channel.bulkDelete(messages);
                break;
            case 'play':
                var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
                if (!args[1] || !regExp.test(args[1])) {
                    message.channel.send("you need to provide a link!");
                    return;
                }
                if (!message.member.voiceChannel) {
                    message.reply("you must be in a channel to do this");
                    return;
                }
                if (!servers[message.guild.id]) {
                    servers[message.guild.id] = {
                        queue: []
                    };
                }
                console.log("args: ", args);
                console.log("guild: ", message.guild.id);
                servers[message.guild.id]
                    .queue.push(args[1]);
                console.log("Queue: ", servers[message.guild.id].queue);
                if (!message.guild.voiceConnection) {
                    message.member.voiceChannel.join()
                        .then((connection) => {
                        play(connection, message);
                    });
                }
                break;
            case 'stop':
                var server = servers[message.guild.id];
                console.log("Splice");
                if (message.guild.voiceConnection) {
                    for (var i = server.queue.length - 1; i >= 0; --i) {
                        console.log("Queue: ", server.queue);
                        server.queue.splice(i, 1);
                    }
                    server.dispatcher.end();
                    console.log("Stop");
                }
                break;
            case 'skip':
                var server = servers[message.guild.id];
                if (server.dispatcher)
                    server.dispatcher.end();
                break;
            case 'pause':
                checkVoiceChannel(message);
                var server = servers[message.guild.id];
                if (server.dispatcher.paused)
                    return message.channel.send('Is already paused');
                server.dispatcher.pause();
                message.channel.send('Paused');
                break;
            case 'resume':
                checkVoiceChannel(message);
                var server = servers[message.guild.id];
                if (!server.dispatcher.paused)
                    return message.channel.send('Is not paused');
                server.dispatcher.resume();
                message.channel.send('Resumed');
                break;
            case 'volumen':
                checkVoiceChannel(message);
                var server = servers[message.guild.id];
                let volumen = Number(args[1]);
                if (isNaN(volumen) || volumen > 200 || volumen < 0)
                    return message.channel.send('Please input a number between 0-200');
                server.dispatcher.setVolume(volumen / 100);
                message.channel.send('Succesfully set the volumen');
            default:
                break;
        }
    }
}
exports.messageManage = messageManage;
//# sourceMappingURL=messages.js.map