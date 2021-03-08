const Command = require('../../dolores/Command');
const command = new Command({
    name: 'flip',
    aliases: ['which', 'choose', 'decide'],
    description:    'Flip a coin, get a yes/no answer to a single question,' +
                    'or choose between multiple options.\n\n' +
                    'Ask a single question for a yes/no answer, or provide multiple options ' +
                    'to choose between them. I will ignore the words `coin`, `whether`, ' +
                    'and `between` when they appear at the start of the sentence.',
    standalone: 'Flip a coin',
    execute: flip
});
command.setAccessLevel('anon');
command.addOption(  '[question]', 'Question you\'d like a yes/no answer to, without ' + 
                    'any of the reserved words or characters from `[options]` below');
command.addOption(  '[options]', 'List of options to choose from seperated by slashes, ' +
                    'commas, `and`, or `or`');
command.addExample('flip', 'Flip a coin');
command.addExample('flip Apex/PUBG', 'Decide between Apex or PUBG');
command.addExample( 'choose whether to hot drop or be a coward',
                    'Decide between `to hot drop` or `be a coward`');
command.addExample( 'decide to crush your enemies, see them driven before you, ' + 
                    'or to hear the lamentations of their women',
                    'Determine [what is best in life](https://www.youtube.com/watch?v=Oo9buo9Mtos)');

module.exports = command;

const Dolores = require('../../dolores/Dolores');

function flip(message, args = []) {

    function parseFlip(params) {
        // Default values
        const defaultFlip = ['heads', 'tails']; // no arguments
        const booleanFlip = ['yes', 'no'];      // one argument

        // Remove natural language keywords
        if (params[0] == 'coin' ||
            params[0] == 'whether' ||
            params[0] == 'between') params.shift();

        // Split arguments at appropriate positions and trim whitespace
        let parsedParams = params.length
            ? params
                .join(' ')
                .split(/\/|,|\\|\s+or\s+|\s+and\s+/)
                .map(parsedParam => parsedParam.trim())
                .filter(parsedParam => parsedParam != '')
            : [];

        // Determine return value
        if (parsedParams.length >  1)   return {type: 'multiple', possibilities: parsedParams};
        if (parsedParams.length == 1)   return {type: 'boolean', possibilities: booleanFlip};
        /* default fallback */          return {type: 'coin', possibilities: defaultFlip};
    };

    let thisFlip = parseFlip(args);
    let result = thisFlip.possibilities[
        Math.floor( Math.random() * thisFlip.possibilities.length )
    ];

    if (thisFlip.type == 'multiple') {
        return Dolores.send(
            message.channel,
            `Out of those ${thisFlip.possibilities.length} options, I have chosen **${result}**`
        );
    };

    if (thisFlip.type == 'boolean') {
        return Dolores.send(
            message.channel,
            `My decision on \`${args[0].toString().trim()}\` is **${result}**`
        );
    };

    return Dolores.send(
        message.channel,
        `${message.author} flipped a coin. The result is **${result}**`
    );
}