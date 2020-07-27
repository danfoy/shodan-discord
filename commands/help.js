const Command = require('../classes/command');

const command = new Command({
    name: 'help',
    aliases: ['man'],
    description: 'Displays a list of commands or information on a specific command',
    usage:
        'Learn how to use Shodan commands. Use by itself to list all ' +
        'commands, or add the command you wish to see the manual for.',
    standalone: 'List all available commands',
    execute: man
});
command.setAccessLevel('anon');
command.addOption('[command]', 'Detailed information on this specific command');
command.addExample('help help', 'Show manual for the help command itself (this page)');
command.addExample('help roll', 'Show manual for the roll command');
module.exports = command;

const Discord           = require('discord.js');
const prefix            = require('../classes/shodan').getPrefix();
const { getCommand, sendMessage }    = require('../utils.js')

function man(context, args = [], type, target) {

    const { commands } = context.client;
    const embedObj     = new Discord.MessageEmbed();

    embedObj.setColor('GREEN');

    // Return list of commands if used without arguments
    if( !args.length ) {

        embedObj.setTitle('**Available commands:**');

        commands.map(command => {
            if (command.aliases) {
                embedObj.addField(
                    `__**\`${prefix + command.name}\`**__ (or \`${prefix + command.aliases.join(`\`, \`${prefix}`)}\`)`,
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

        return sendMessage(context, type, target, embedObj);
    };

    const command = getCommand(context.client, args[0]);

    const aliases = command.aliases ?
                        ` (or \`${command.aliases.join('\`, \`')}\`)` :
                        '';

    /**
     * Parse examples field into a string
     * 
     * @param {object} examples - command.examples
     * @returns {string}
     */
    function parseExamples(examples) {
        let output = '';
        examples.forEach(example => {
            output += `\`${ prefix + example.args }\`\n*${ example.effect }*\n\u200b\n`;
        });
        return output;
    };

    /**
     * Parse options into a string
     * @param {object} options - command.options
     * @returns {string}
     */
    function parseOptions(options) {
        let output = '';
        options.forEach(option => {
            output += `\`${ option.arg }\`${ option.required ? '' : ' (optional)'}\n*${ option.effect }*\n\u200b\n`
        });
        return output;
    };

    embedObj.setTitle(`__\`${prefix + command.name}\`` + aliases + '__');
    if (command.description)    embedObj.setDescription(command.description + '\n\u200b\n');
    if (command.options.length) embedObj.addField('**Options:**', parseOptions(command.options));
    if (command.usage)          embedObj.addField('**Usage:**', command.usage + '\n\u200b\n');
    if (command.examples.length)embedObj.addField('**Examples:**', parseExamples(command.examples));
    if (command.default)        embedObj.addField(`__**Default (just \`${prefix + command.name}\`):**__`, command.default);

    sendMessage(context, type, target, embedObj);

}
