/* dotenv */      require('dotenv').config();
const Discordjs = require('discord.js');
const TOKEN     = process.env.TOKEN; // handled by dotenv
const Changelog = require('../commands/changelog');

const { servers } = require('../config.json');

/**
 * Initializes Dolores
 *
 */
function init() {

    const Dolores = require('./Dolores');

    const client = new Discordjs.Client();
    client.login(TOKEN);

    // Actions to perform on connection
    client.once('ready', () => {

        console.info(`Dolores logged into Discord as ${client.user.tag}`);

        // Load the changelog command for use
        const changelog = new Changelog();

        // Check if there is a new changelog
        if (changelog.ageInSeconds() < 120) {
            const changelogCmd = Dolores.getCommand('changelog');

            //Loop through designated channels in {servers} from config.json
            servers.forEach( server => {
                if (!client.channels.cache.get(server.testing)) return;
                client.channels.fetch(server.testing)
                    .then(channel => {
                        console.log(`Sending changelog to ${channel.guild.name}#${channel.name}`);
                        changelogCmd.execute({channel}, ['current', 'summary']);
                    }) 
                    .catch(error => console.error(error));
            });
        };
    });

    // Listen for commands
    client.on('message', (message) => Dolores.handleMessage(client, message));

};

module.exports = init;
