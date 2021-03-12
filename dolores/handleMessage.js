const { operators } = require('../config.json');

function handleMessage(client, message) {

    const {prefix, getCommand } = this;
 
    // React with ping command if pinged
    if (    !message.content.startsWith(prefix)
            && message.mentions.has(client.user)
            && message.author != client.userh
            && !message.author.bot ){

        const ping = getCommand('ping');
        return ping.execute(message);
    };

    // Ignore messages without Discord.prefix or from other bots
    if (!message.content.startsWith(prefix) || message.author.bot) return;


    // Split message into arguments
    const args = message.content
        .slice(prefix.length)           // Remove prefix from message
        .split(/ +/);                   // Split using spaces as delimiter

    // Isolate command part of message
    const commandName = args.shift()    // Isolate the command
        .toLowerCase();                 // Normalise case

    // Get the command object itself
    const command = getCommand(commandName);

    // Check command exists
    if (!command) {
        message.channel.send([
            `\`${commandName}\` is just some nonsense you made up`
            ]);
        return;
    };

    // Check permissions
    if (command.accessLevel > 1 && ! operators.includes(message.author.id)) {
        message.channel.send([
            `You are not authorized to use \`${commandName}\``,
            `Your infraction has been noted. I am watching you, ${message.author.username}.`
            ]);
        return;
    };

    // Check command arguments exist if required
    if (command.args && !args[0]) {
        message.channel.send([
            `\`${commandName}\` command is missing its argument(s)`,
            `${message.author.username} you fuckin n00b. RTFM \`${prefix + 'help ' + commandName }\``
            ]);
        return;
    };

    // Execute command
    try {
        (command.execute(message, args, commandName));
    } catch (error) {
        console.error(error);
        message.channel.send(`Failure processing \`${commandName}\``);
    };
};

module.exports = handleMessage;
