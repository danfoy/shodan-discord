module.exports = {
    name: 'help',
    description: 'Displays a list of commands or information on a specific command',
    usage: '[command] (optional) specific command. Displays list of all commands if ommitted.',
    aliases: ['man'],
    execute: man
};

const { prefix }          = require('../config.json');
const { getCommand, hr }  = require('../utils.js')

function man(message, args) {

    const { commands } = message.client;

    // Return list of commands if used without arguments
    if( !args.length ) {
        message.channel.send(
            `${hr("thick")}\n` +
            `**Available commands:** \`${commands.map(command => command.name).join('`, `')}\`\n` +
            `*Use* \`${prefix}help [command]\` *for help on specific commands*\n` +
            `${hr("thick")}`);
        return;
    };

    const command = getCommand(message.client, args[0]);
    let data = [hr("thick")]

    const aliases = command.aliases ?
                        ' (or `' + command.aliases.join('`, `') + '`)' :
                        '';

    data.push(`\`${prefix + command.name}\`` + aliases);
    data.push(hr());

    if (command.description)    data.push(`*${command.description}*`);
    if (command.usage)          data.push(`\n**Usage:**\n${command.usage}`);

    data.push(hr("thick"));

    message.channel.send(data);

}
