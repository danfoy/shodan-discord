module.exports = {
    name: 'roll',
    aliases: ['dice', 'd'],
    description: 'Roll a dice or generate a random number',
    options: '`[number]` (optional) - Number of sides on the dice',
    examples:
        '`!roll 100`\nRandom number between 1-100\n' +
        '`!d 20`\nRoll a 20-sided dice',
    default: 'Roll a 6-sided dice',
    execute: roll
}

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
