module.exports = {
    name: 'prune',
    description: 'Delete a specified number of messages from the server',
    options: '`[number]` (between 2 and 99) posts to delete',
    aliases: ['purge', 'delete', 'del', 'clear'],
    args: true,
    operator: true,
    execute: prune
}

function prune(message, args) {
    const amount = parseInt(args[0]) + 1;   // Include command message

    if (isNaN(amount)) {
        message.channel.send(`Invalid number of messages to prune`);
        return;
    } else if (amount <= 1 || amount > 100) {
        message.channel.send('Number must be between 1 and 99');
        return;
    };

    message.channel.bulkDelete(amount, true)
        .catch((error) => {
            console.error(error);
            message.channel.send('Unable to prune messages');
        });
}
