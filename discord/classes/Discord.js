const Discordjs = require('discord.js');

class Discord {
    constructor() {
        this.prefix = this.getPrefix();
    };

    MessageEmbed = require('./MessageEmbed');

    send(recipient, content) {
        if (Array.isArray(content)) {
            return content.forEach( item => recipient.send(item) );
        }
        return recipient.send(content);
    };

    /**
     * Get the Discord command prefix
     * @return {string} Discord command prefix
     */
    getPrefix() {
        const config = require('../../config.json');
        return config.prefix; 
    };

    getCommand(client, commandName) {
        return  client.commands.get(commandName) ||
                client.commands.find( (cmd) =>
                    cmd.aliases &&
                    cmd.aliases.includes(commandName)
                );
    };
};

module.exports = new Discord;