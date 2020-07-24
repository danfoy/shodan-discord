module.exports = {
    name: 'prune',
    description: 'Delete a specified number of messages from the server',
    options: '`[number]` (between 2 and 99) posts to delete',
    aliases: ['purge', 'delete', 'del', 'clear'],
    args: true,
    operator: true,
    execute: prune
}

const { sendMessage } = require('../utils.js');

function prune(context, args = [], type, target) {
    const amount = parseInt(args[0]) + 1;   // Include command message

    if (isNaN(amount)) {
        sendMessage(context, type, target, `Invalid number of messages to prune`);
        return;
    } else if (amount <= 1 || amount > 100) {
        sendMessage(context, type, target, 'Number must be between 1 and 99');
        return;
    };

    context.channel.bulkDelete(amount, true)
        .catch((error) => {
            console.error(error);
            sendMessage(context, type, target, 'Unable to prune messages');
        });
}
