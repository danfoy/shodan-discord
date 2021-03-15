const Dolores = require('../../dolores');
const command = new Dolores.Command({
    name: 'roll',
    aliases: ['dice', 'd'],
    description: 'Generate a random number. Roll a dice.',
    standalone: 'Roll a 6-sided dice',
    execute: roll
});
command.setAccessLevel('anon');
command.addOption('[number]', 'Number of sides on the dice');
command.addExample('roll 100', 'Random number between 1-100');
command.addExample('d 20', 'Roll a 20-sided dice');

module.exports = command;

function roll(message, args = []) {

    // Command syntax check
    if (args[0] && ! parseInt(args[0])) {
        return Dolores.send(message.channel,
            `Digits only please <@${message.author.id}>, rtfm\n` +
            'Type (or DM me) `!help roll` for correct usage, ' +
            'or `!help` for all available commands'
        );
    };

    // Get number of sides or use default
    const sides = parseInt(args[0]) ? args[0] : 6;

    function rollDice(sides) {
        return Math.floor((Math.random() * sides) + 1);
    };

    Dolores.send(message.channel, `<@${message.author.id}> rolled ${rollDice(sides)}`);
}
