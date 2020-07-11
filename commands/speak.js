module.exports = {
    name: 'speak',
    description: 'Talk via Shodan',
    aliases: ['say'],
    args: false,
    operator: true,
    execute: speak
}

const {servers} = require('../config.json');

function speak(message, args) {

    const serverArg = args.shift();

    const server = servers.find( ({name}) => name === serverArg.toLowerCase());
    if (!server) {
        return message.channel.send(`\`${serverArg}\` is not a recognised server`);
    }

    const channel = server[args.shift()];
    if (!channel) {
        return message.channel.send(`\`${channel}\` is not a channel on \`${server.name}\``)
    }

    return message.client.channels.cache.get(channel).send(args.join(' '));

}
