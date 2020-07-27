const Command = require('../classes/command');
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

const { sendMessage } = require('../utils.js');

function prune(context, args = [], type, target) {

    console.log(command.accessLevel);

    if (args[0] && isNaN(parseInt(args[0]))) {
        return sendMessage(context, type, target,
            `Digits only please, <@${context.author.id}>`);
    };

    const amount = args[0] ? parseInt(args[0]) + 1 : 2;   // Include command message

    if (amount > 100) {
        return sendMessage(context, type, target,
            `You are pruning too greedily and too deep, <@${context.author.id}>. ` +
            `Knock off at least ${amount - 100} and then we'll see.`);
    };

    context.channel.bulkDelete(amount, true)
        .catch((error) => {
            console.error(error);
            sendMessage(context, type, target, 'Unable to prune messages');
        });
}
