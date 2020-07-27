const Command = require('../classes/command');
const command = new Command({
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

const { sendMessage } = require('../utils.js');

function roll(context, args = [], type, target) {

    if (args[0] && ! parseInt(args[0])) {
        return sendMessage(context, type, target, `Digits only please <@${message.author.id}>, rtfm`);
    };

    const sides = parseInt(args[0]) ? args[0] : 6;

    function rollDice(sides) {
        return Math.floor((Math.random() * sides) + 1);
    };


    sendMessage(context, type, target, `<@${context.author.id}> rolled ${rollDice(sides)}`);
}
