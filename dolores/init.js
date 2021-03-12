/* dotenv */      require('dotenv').config();
const fs        = require('fs');
const Discordjs = require('discord.js');
const TOKEN     = process.env.TOKEN; // handled by dotenv

const { operators, servers } = require('../config.json');

function init() {

    const Dolores = this;
    const { getCommand, handleMessage } = this;

    const client = new Discordjs.Client();
    const path = require('path');
    client.login(TOKEN);

    // Actions to perform on connection
    client.once('ready', () => {

        console.info(`Dolores logged into Discord as ${client.user.tag}`);

        // Load the changelog command for use
        const Changelog = require(path.dirname(require.main.filename) + '/commands/changelog/Changelog.js');
        const changelog = new Changelog();
        console.log(`Changelog: ${Object.keys(changelog)}`);
        console.log(`Changelog age: ${changelog.ageInSeconds()}s`);
        const changelogCmd = getCommand(Dolores, 'changelog');

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
