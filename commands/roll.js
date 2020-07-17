module.exports = {
    name: 'roll',
    aliases: ['dice', 'd'],
    description: 'Roll a dice',
    usage: `[number] (optional) - Number of sides on the dice (default 6)`
}

function roll(message, args) {

    if (args[0] && ! parseInt(args[0])) {
        return message.channel.send(`Digits only please <@${message.author.id}>, rtfm`);
    };

    const sides = parseInt(args[0]) ? args[0] : 6;

    function rollDice(sides) {
        return Math.floor((Math.random() * sides) + 1);
    };


    message.channel.send(`<@${message.author.id}> rolled ${rollDice(sides)}`);
    message.delete();
}
