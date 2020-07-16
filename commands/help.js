module.exports = {
    name: 'help',
    description: 'Displays a list of commands or information on a specific command',
    usage: '[command] (optional) specific command. Displays list of all commands if ommitted.',
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

    embedObj.setTitle(`\`${prefix + command.name}\`` + aliases);
    if (command.description) embedObj.setDescription(command.description);
    if (command.usage) embedObj.addField('Usage', `${command.usage}`);


    // data.push(`\`${prefix + command.name}\`` + aliases);
    // data.push(hr());

    // if (command.description)    data.push(`*${command.description}*`);
    // if (command.usage)          data.push(`\n**Usage:**\n${command.usage}`);

    message.channel.send(embedObj);

}
