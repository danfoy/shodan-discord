const Discordjs = require('discord.js');
const Shodan    = require('../../classes/shodan');

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

    formatSeconds(seconds) {
        const parsed = Shodan.parseSeconds(seconds);

        let { weeks, days, hours } = parsed;
        let mins = parsed.minutes;
        let secs = parsed.seconds;

        let output = '**';

        // Build output string
        if (weeks) output += weeks += weeks === 1 ? '** week, **'      : '** weeks, **'     ;
        if (days)  output += days  += days  === 1 ? '** day, **'       : '** days, **'      ;
        if (hours) output += hours += hours === 1 ? '** hour, **'      : '** hours, **'     ;
        if (mins)  output += mins  += mins  === 1 ? '** minute and **' : '** minutes and **';
                   output += secs  += secs  === 1 ? '** second'        : '** seconds'       ;

        return output;
    }
};

module.exports = new Discord;