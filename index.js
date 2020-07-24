/* dotenv */      require('dotenv').config();
const fs        = require('fs');
const Discord   = require('discord.js');
const { prefix,
        operators,
        servers } = require('./config.json');
const TOKEN     = process.env.TOKEN; // handled by dotenv

const { getCommand } = require('./utils.js');

// Setup client
const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands')
    .filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
};


// Login client to Discord
client.login(TOKEN);

// Actions to perform on connection
client.once('ready', () => {

    // Log login
    console.info(`Logged into Discord as ${client.user.tag}`);

    // Check when changelog was last updated
    fs.stat(__dirname + '/CHANGELOG.md', (error, stats) => {
        if (error) return console.error(error);

        // Make changelog command available
        const changelog = getCommand(client, 'changelog');
        // Get time since change in seconds
        const changelogTimer = Math.floor((new Date - stats.mtime) / 1000);

        // Execute if changelog modified time < #seconds
        if (changelogTimer < 120) {
            // Loop through each server in config.json
            servers.forEach( server => {
                // Send to 'logging' value for each server
                changelog.execute(client, [], 'channel', server.logging);
            });
        };
    });
});


// Listen for commands
client.on('message', (message) => {

    // React with ping command if pinged
    if (    !message.content.startsWith(prefix)
            && message.mentions.has(client.user)
            && message.author != client.user
            && !message.author.bot ){

        const ping = getCommand(client, 'ping');
        return ping.execute(message);
    };

    // Ignore messages without prefix or from other bots
    if (!message.content.startsWith(prefix) || message.author.bot) return;


    // Split message into arguments
    const args = message.content
        .slice(prefix.length)           // Remove prefix from message
        .split(/ +/);                   // Split using spaces as delimiter

    // Isolate command part of message
    const commandName = args.shift()    // Isolate the command
        .toLowerCase();                 // Normalise case

    // Get the command object itself
    const command = getCommand(client, commandName);

    // Check command exists
    if (!command) {
        message.channel.send([
            `\`${commandName}\` is just some nonsense you made up`
            ]);
        return;
    };

    if (command.operator && ! operators.includes(message.author.id)) {
        message.channel.send([
            `You are not authorized to use \`${commandName}\``,
            `Your infraction has been noted. I am watching you, ${message.author.username}.`
            ]);
        return;
    }

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
        (command.execute(message, args));
    } catch (error) {
        console.error(error);
        message.channel.send(`Failure processing \`${commandName}\``);
    };

});
