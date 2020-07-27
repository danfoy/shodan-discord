module.exports = {
    name: 'help',
    description: 'Displays a list of commands or information on a specific command',
    options: [
        {   arg:   '[command]',
            effect: 'Detailed information on this specific command',
            required: false } ],
    usage:
        'Learn how to use Shodan commands. Use by itself to list all ' +
        'commands, or add the command you wish to see the manual for.',
    examples: [
        {   args:   'help help',
            effect: 'Show manual for the help command itself' },
        {   args:   'help roll',
            effect: 'Show manual for the roll command' } ],
    default: 'List all available commands',
    aliases: ['man'],
    execute: man
};

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
            output += `\`${ option.arg }\`${ option.required ? '' : ' (optional) '} — *${ option.effect }*\n\u200b\n`
        });
        return output;
    }

    embedObj.setTitle(`__\`${prefix + command.name}\`` + aliases + '__');
    if (command.description)    embedObj.setDescription(command.description + '\n\u200b\n');
    if (command.options)        embedObj.addField('**Options:**', parseOptions(command.options));
    if (command.usage)          embedObj.addField('**Usage:**', command.usage + '\n\u200b\n');
    if (command.examples)       embedObj.addField('**Examples:**', parseExamples(command.examples));
    if (command.default)        embedObj.addField(`__**Default (just \`${prefix + command.name}\`):**__`, command.default);

    sendMessage(context, type, target, embedObj);

}
