const Command = require('../classes/Command');
const command = new Command({
    name: 'say',
    description: 'Talk via Shodan',
    aliases: ['speak'],
    execute: speak
});
command.setAccessLevel('operator');
module.exports = command;

const {servers} = require('../../config.json');
const Discord = require('../classes/Discord');

function speak(context, args = []) {

    const serverArg = args.shift();

    const server = servers.find( ({name}) => name === serverArg.toLowerCase());
    if (!server) {
        return Discord.send(context.channel, `\`${serverArg}\` is not a recognised server`);
    }

    const channel = server[args.shift()];
    if (!channel) {
        return Discord.send(context.channel, `\`${channel}\` is not a channel on \`${server.name}\``)
    }

    return context.client.channels.cache.get(channel).send(args.join(' '));
}
