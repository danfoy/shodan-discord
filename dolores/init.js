/* dotenv */      require('dotenv').config();
const Discordjs = require('discord.js');
const TOKEN     = process.env.TOKEN; // handled by dotenv
const path = require('path');
const Changelog = require('../commands/changelog');

const { operators, servers } = require('../config.json');

function init() {

    const Dolores = this;
    const { getCommand, handleMessage } = this;

    const client = new Discordjs.Client();
    client.login(TOKEN);

    // Actions to perform on connection
    client.once('ready', () => {

        console.info(`Dolores logged into Discord as ${client.user.tag}`);

        // Load the changelog command for use
        const changelog = new Changelog();

        //const changelogCmd = getCommand(Dolores, 'changelog');

        // Loop through designated channels in {servers} from config.json
        // servers.forEach( server => {
        //     if (!client.channels.cache.get(server.testing)) return;
        //     client.channels.fetch(server.testing)
        //         .then(channel => {
        //             console.log(`Sending changelog to ${channel.name} as ${channel.id}`);
        //             changelogCmd.execute({channel});
        //         }) 
        //         .catch(error => console.error(error));
        // });
    });

    // Listen for commands
    client.on('message', (message) => handleMessage(client, message));

};

module.exports = init;
