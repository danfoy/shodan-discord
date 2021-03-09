class Dolores {

    constructor() {

        // Methods
        this.init                   = require('./init').bind(this);
        this.handleMessage          = require('./handleMessage').bind(this);
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
