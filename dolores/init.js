/* dotenv */      require('dotenv').config();
const fs        = require('fs');
const Discordjs = require('discord.js');
const TOKEN     = process.env.TOKEN; // handled by dotenv

const { operators, servers } = require('../config.json');

function init() {

    const { handleMessage } = this;

    const client = new Discordjs.Client();
    client.login(TOKEN);

    // Actions to perform on connection
    client.once('ready', () => {
        
        console.info(`Dolores logged into Discord as ${client.user.tag}`);

        // Send a changelog embed if there's a new changelog
        // fs.stat(__dirname + '/../CHANGELOG.md', (error, stats) => {
        //     if (error) return console.error(error);
            
        //     // Check whether changelog is new
        //     const changelogTimer = Math.floor((new Date - stats.mtime) / 1000);
        //     if (changelogTimer > 120) return;

        //     // Load the changelog command for use
        //     const changelogCmd = getCommand(Dolores, 'changelog');

        //     // Loop through designated channels in {servers} from config.json
        //     servers.forEach( server => {
        //         if (!client.channels.cache.get(server.testing)) return;
        //         client.channels.fetch(server.testing)
        //             .then(channel => {
        //                 console.log(`Sending changelog to ${channel.name} as ${channel.id}`);
        //                 changelogCmd.execute({channel});
        //             }) 
        //             .catch(error => console.error(error));
        //     });
        // });
    });

    // Listen for commands
    client.on('message', (message) => handleMessage(client, message));

};

module.exports = init;
