const Discordjs = require('discord.js');
const Shodan    = require('../classes/shodan');

class Dolores {
    constructor() {
        this.prefix = this.getPrefix();
    };

    send(recipient, content) {
        if (Array.isArray(content)) {
            return content.forEach( item => recipient.send(item) );
        }
        return recipient.send(content);
    };

    /**
     * Search same-guild channels by name and return a GuildChannel object
     * if found.
     *
     * @param {Message} message the message that performed the request
     * @param {String} potentialChannel Channel to search for
     * @returns {GuildChannel} GuildChannel Object
     * @memberof Discord
     */
    getChannel(message, potentialChannel) {
        return message.guild.channels.cache.find(
            (channel) => channel.name == potentialChannel );
    };

    /**
     * Check if a message is an inline reply
     *
     * @param {Message} message The message that performed this request
     * @returns {boolean} Whether this message is an inline reply
     * @memberof Discord
     */
    checkInlineReply(message) {
        // Check if the message contains any references
        if (!message.reference) return false;
        // Check that the reference is to another message
        // This will always fail if the test above is ommitted
        if (!message.reference.messageID) return false;
        return true;
    };

    /**
     * Fetch the message to which the passed-in message is an inline reply
     *
     * @param {Message} message the child message
     * @returns {Promise} parent Message object
     * @memberof Discord
     */
    async getInlineReplyParent(message) {
        return message.channel.messages.fetch(message.reference.messageID);
    }

    /**
     * Generate an embed-compatible object based on the content of the parent
     * message, to which the provided message is an inline reply.
     *
     * @param {Message} message The message that performed this request
     * @returns {Promise} Resolves to embeddable object
     * @memberof Discord
     */
    async generateQuoteEmbed(message) {
        return message.channel.messages.fetch(message.reference.messageID)
            .then( (quotedMessage) => ({
                author: {
                    name: quotedMessage.author.username,
                    icon_url: quotedMessage.author.displayAvatarURL()
                },
                description: quotedMessage.content,
                footer: {
                    text: `Originally posted in #${quotedMessage.channel.name}`
                },
                timestamp: new Date(quotedMessage.createdTimestamp)
            }))
    };


    /**
     * Get the Discord command prefix
     * @return {string} Discord command prefix
     */
    getPrefix() {
        const config = require('../config.json');
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

module.exports = new Dolores;