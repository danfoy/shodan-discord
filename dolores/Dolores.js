/**
 * Dolores is Shodan's Discord subsystem. She uses [Discord.js][1], a library 
 * which wraps the Discord API into object-oriented JavaScript classes, to 
 * interact with Discord.
 * 
 * Dolores was so named because she is the first host the audience is introduced
 * to in Westworld, just as the Discord functionality was the starting point
 * for Shodan. She is also the 'welcome wagon' to Westworld, greeting new
 * visitors, similar to how Discord was the original intended interface for
 * Shodan and the source of most of her personality. Conveniently, they also
 * both start with the letter D.
 * 
 * [1]: https://discord.js.org
 *
 * @class Dolores
 */
class Dolores {

    constructor() {

        // Methods
        this.init                   = require('./init');
        this.handleMessage          = require('./handleMessage');
        this.send                   = require('./send');
        this.getChannel             = require('./getChannel');
        this.checkInlineReply       = require('./checkInlineReply');
        this.getInlineReplyParent   = require('./getInlineReplyParent');
        this.generateQuoteEmbed     = require('./generateQuoteEmbed');
        this.getPrefix              = require('./getPrefix');
        this.loadCommands           = require('./loadCommands');
        this.formatSeconds          = require('./formatSeconds');
        this.getCommand             = require('./getCommand').bind(this);

        // Properties
        this.prefix = this.getPrefix();
        this.commands = this.loadCommands('/commands/**/*.dolores.js');
    }    

    // Subclasses
    Command                 = require('./Command');

};

module.exports = new Dolores;
