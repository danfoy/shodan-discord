class Dolores {

    // Methods
    send                    = require('./send');
    getChannel              = require('./getChannel');
    checkInlineReply        = require('./checkInlineReply');
    getInlineReplyParent    = require('./getInlineReplyParent');
    generateQuoteEmbed      = require('./generateQuoteEmbed');
    getPrefix               = require('./getPrefix');
    getCommand              = require('./getCommand');
    formatSeconds           = require('./formatSeconds');

    // Subclasses
    Command                 = require('./Command');

    // Properties
    prefix = this.getPrefix();

};

module.exports = new Dolores;
