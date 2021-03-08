const Command = require('../../Dolores/Command');
const command = new Command({
    name: 'prune',
    aliases: ['purge', 'delete', 'del', 'clear'],
    description: 'Delete a specified number of messages from the server',
    operator: true,
    execute: prune
});
command.setAccessLevel('admin');
command.addOption('[number] (between 2 and 99)', 'Delete this many posts');
module.exports = command;

const Dolores = require('../../dolores/Dolores');

function prune(message, args = []) {

    if (args[0] && isNaN(parseInt(args[0]))) {
        return Dolores.send(message.channel,
            `Digits only please, <@${message.author.id}>`);
    };

    const amount = args[0] ? parseInt(args[0]) + 1 : 2;   // Include command message

    if (amount > 100) {
        return Dolores.send(message.channel,
            `You are pruning too greedily and too deep, <@${message.author.id}>. ` +
            `Knock off at least ${amount - 100} and then we'll see.`);
    };

    message.channel.bulkDelete(amount, true)
        .catch((error) => {
            console.error(error);
            Dolores.send(message.channel, 'Unable to prune messages');
        });
}
