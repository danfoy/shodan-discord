const Dolores = require('../../dolores');
const command = new Dolores.Command({
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

const Discord = require('discord.js');

function man(message, args = []) {

    const { commands } = Dolores;
    const embedObj     = new Discord.MessageEmbed();

    embedObj.setColor('GREEN');

    // Return list of commands if used without arguments
    if( !args.length ) {

        embedObj.setTitle('**Available commands:**');

        commands.map(command => {
            if (command.aliases) {
                embedObj.addField(
                    `__**\`${Dolores.prefix + command.name}\`**__ (or \`${Dolores.prefix + command.aliases.join(`\`, \`${Dolores.prefix}`)}\`)`,
                    `*${command.description}*\n\u200b`
                );
            } else {
                embedObj.addField(
                    `__**\`${Dolores.prefix + command.name}\`**__`,
                    `${command.description}\n\u200b`
                );
            }
        });

        embedObj.setFooter(`Type ${Dolores.prefix}help [command] for help on specific commands`);

        return Dolores.send(message.channel, embedObj);
    };

    const command = Dolores.getCommand(args[0]);

    // We will be doing some transforms, so we need to clone the command so that
    // changes we make don't affect the original commands.
    const cmd = { ...command };

    const aliases = cmd.aliases ?
                        ` (or \`${cmd.aliases.join('\`, \`')}\`)` :
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
            output += `\`${ Dolores.prefix + example.args }\`\n*${ example.effect }*\n\u200b\n`;
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

    // If the command has a `detail` field, append to the description
    if (cmd.detail) {
        cmd.description = cmd.description +'\n\u200b\n'+ cmd.detail;
    };

    embedObj.setTitle(`__\`${Dolores.prefix + cmd.name}\`` + aliases + '__');
    if (cmd.description)    embedObj.setDescription(cmd.description + '\n\u200b\n')
    if (cmd.options.length) embedObj.addField('**Options:**', parseOptions(cmd.options));
    if (cmd.usage)          embedObj.addField('**Usage:**', cmd.usage + '\n\u200b\n');
    if (cmd.examples.length)embedObj.addField('**Examples:**', parseExamples(cmd.examples));
    if (cmd.default)        embedObj.addField(`__**Default (just \`${Dolores.prefix + cmd.name}\`):**__`, cmd.default);

    Dolores.send(message.channel || message.dmChannel, embedObj);

}
