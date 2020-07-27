const Command = require('../classes/command');
const command = new Command({
    name: 'say',
    description: 'Talk via Shodan',
    aliases: ['speak'],
    execute: speak
});
command.setAccessLevel('operator');
module.exports = command;

const {servers} = require('../config.json');
const { sendMessage } = require('../utils.js');

function speak(context, args = [], type, target) {

    const serverArg = args.shift();

    const server = servers.find( ({name}) => name === serverArg.toLowerCase());
    if (!server) {
        return sendMessage(context, type, target, `\`${serverArg}\` is not a recognised server`);
    }

    const channel = server[args.shift()];
    if (!channel) {
        return sendMessage(context, type, target, `\`${channel}\` is not a channel on \`${server.name}\``)
    }

    return context.client.channels.cache.get(channel).send(args.join(' '));

}
