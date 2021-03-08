const Command = require('../../Dolores/Command');
const command = new Command({
    name: 'say',
    description: 'Talk via Shodan',
    aliases: ['speak'],
    execute: speak
});
command.setAccessLevel('operator');
module.exports = command;

const {servers} = require('../../config.json');
const Dolores = require('../../dolores/Dolores');

function speak(message, args = []) {

    const serverArg = args.shift();

    const server = servers.find( ({name}) => name === serverArg.toLowerCase());
    if (!server) {
        return Dolores.send(message.channel, `\`${serverArg}\` is not a recognised server`);
    }

    const channel = server[args.shift()];
    if (!channel) {
        return Dolores.send(message.channel, `\`${channel}\` is not a channel on \`${server.name}\``)
    }

    return message.client.channels.cache.get(channel).send(args.join(' '));
}
