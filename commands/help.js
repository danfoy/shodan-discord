module.exports = {
    name: 'help',
    description: 'Displays a list of commands or information on a specific command',
    options: '`command` (optional) specific command',
    usage:
        'Learn how to use Shodan commands. Use by itself to list all ' +
        'commands, or add the command you wish to see the manual for.',
    examples:
        '`!help`\nList all commands\n' +
        '`!help help`\nShow manual for the help command itself\n' +
        '`!help roll`\nShow manual for the roll command\n',
    default: 'List all available commands',
    aliases: ['man'],
    execute: man
};

const Discord           = require('discord.js');
const { prefix }        = require('../config.json');
const { getCommand }    = require('../utils.js')

function man(message, args) {

    const { commands } = message.client;
    const embedObj     = new Discord.MessageEmbed();

    embedObj.setColor('GREEN');

    // Return list of commands if used without arguments
    if( !args.length ) {

        embedObj.setTitle('**Available commands:**');

        commands.map(command => {
            if (command.aliases) {
                embedObj.addField(
                    `__**\`${prefix + command.name}\`**__ (or \`${command.aliases.join('`, `')}\`)`,
                    `*${command.description}*\n\u200b`
                );
            } else {
                embedObj.addField(
                    `__**\`${prefix + command.name}\`**__`,
                    `${command.description}\n\u200b`
                );
            }
        });

        embedObj.setFooter(`Type ${prefix}help [command] for help on specific commands`);

        return message.channel.send(embedObj);
    };

    const command = getCommand(message.client, args[0]);

    const aliases = command.aliases ?
                        ` (or \`${command.aliases.join('\`, \`')}\`)` :
                        '';

    embedObj.setTitle(`__\`${prefix + command.name}\`` + aliases + '__');
    if (command.description) embedObj.setDescription(command.description);
    if (command.options) embedObj.addField('**Options:**', command.options);
    if (command.usage) embedObj.addField('**Usage:**', command.usage);
    if (command.examples) embedObj.addField('**Examples:**', command.examples);
    if (command.default) embedObj.addField('**Default:**', command.default);


    // data.push(`\`${prefix + command.name}\`` + aliases);
    // data.push(hr());

    // if (command.description)    data.push(`*${command.description}*`);
    // if (command.usage)          data.push(`\n**Usage:**\n${command.usage}`);

    message.channel.send(embedObj);

}
