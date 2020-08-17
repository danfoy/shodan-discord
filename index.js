/* dotenv */      require('dotenv').config();

const fs        = require('fs');
const Discord   = require('./discord/classes/Discord');
const Shodan    = require('./classes/shodan');

const Discordjs = require('discord.js');

const { operators,
        servers } = require('./config.json');

const TOKEN     = process.env.TOKEN; // handled by dotenv

const { getCommand } = require('./utils.js');

// Setup client
const client = new Discordjs.Client();
client.commands = new Discordjs.Collection();

const commandFiles = fs.readdirSync('./discord/commands/')
    .filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./discord/commands/${file}`);
    client.commands.set(command.name, command);
};


// Login client to Discord
client.login(TOKEN);

// Actions to perform on connection
client.once('ready', () => {

    // Log login
    console.info(`Logged into Discord as ${client.user.tag}`);

    // Send a changelog embed if there's a new changelog
    fs.stat(__dirname + '/CHANGELOG.md', (error, stats) => {
        if (error) return console.error(error);
        
        // Check whether changelog is new
        const changelogTimer = Math.floor((new Date - stats.mtime) / 1000);
        if (changelogTimer > 120) return;

        // Load the changelog command for use
        const changelogCmd = getCommand(client, 'changelog');

        // Loop through designated channels in {servers} from config.json
        servers.forEach( server => {
            if (!client.channels.cache.get(server.testing)) return;
            client.channels.fetch(server.testing)
                .then(channel => {
                    console.log(`Sending changelog to ${channel.name} as ${channel.id}`);
                    changelogCmd.execute({channel});
                }) 
                .catch(error => console.error(error));
        });
    });
});


// Listen for commands
client.on('message', (message) => {

    // React with ping command if pinged
    if (    !message.content.startsWith(Discord.prefix)
            && message.mentions.has(client.user)
            && message.author != client.user
            && !message.author.bot ){

        const ping = getCommand(client, 'ping');
        return ping.execute(message);
    };

    // Ignore messages without Discord.prefix or from other bots
    if (!message.content.startsWith(Discord.prefix) || message.author.bot) return;


    // Split message into arguments
    const args = message.content
        .slice(Discord.prefix.length)           // Remove Discord.prefix from message
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

    if (command.accessLevel > 1 && ! operators.includes(message.author.id)) {
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
            `${message.author.username} you fuckin n00b. RTFM \`${Discord.prefix + 'help ' + commandName }\``
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
