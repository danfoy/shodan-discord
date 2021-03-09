class Dolores {

    // Methods
    send                    = require('./send');
    getChannel              = require('./getChannel');
    checkInlineReply        = require('./checkInlineReply');
    getInlineReplyParent    = require('./getInlineReplyParent');
    generateQuoteEmbed      = require('./generateQuoteEmbed');
    getPrefix               = require('./getPrefix');
    loadCommands            = require('./loadCommands');
    getCommand              = require('./getCommand');
    formatSeconds           = require('./formatSeconds');

    // Subclasses
    Command                 = require('./Command');

    // Properties
    prefix = this.getPrefix();
    commands = this.loadCommands('/commands/**/*.dolores.js');

};

module.exports = new Dolores;
