const Command = require('../../dolores/Command');
const command = new Command({
    name:           'move',
    aliases:        ['crosspost', 'quote', 'copy'],
    description:    'Move a post to another channel by doing an inline reply' +
                    'to that message with this command. If the command ' + 
                    'issued is `move` then the original will be deleted. ' +
                    'Otherwise, it will be copied.',
    execute: move
});

command.addOption(  '[channel(s)]', '(optional) tagged channels to copy ' +
                    'this message to. If this is ommitted, the message will' +
                    'be moved/copied to the current channel.');
command.addExample( 'move #foo', 'Move this message to the channel `foo` ' +
                    'and delete it from the current channel.');
command.addExample( 'copy #foo #bar', 'Copy this message to the `foo` and ' +
                    '`bar` channels.');
command.addExample( 'quote', 'Copy this message to the bottom of the ' +
                    'current channel.');

/*
 * At the moment Shodan is only running on trusted servers. This command
 * could be used to cause significant mischief, so this command should be
 * locked down as soon as there is a database in place to track authorised
 * users.
 */
command.setAccessLevel('anon');

module.exports = command;

const Dolores = require('../../dolores/Dolores');

function move(message, args=[], commandName) {

    // Command should only operate on inline replies
    if (!Dolores.checkInlineReply(message)) {
        return message.channel.send(
            `You can only use this command as an inline reply ` + 
            `${ message.author }. RTFM.`
        );
    };

    // Quote message in same channel if no arguments provided
    if (!args.length) {
        return Dolores.generateQuoteEmbed(message)
            .then(quotedMessage => message.channel.send(
                {embed: quotedMessage}
            ));
    };

    // Check that the user has tagged the channels
    if (args.length > message.mentions.channels.size) {
        return message.channel.send(
            `Tag the channels, idiot. You want me to do all the work ` +
            `for you?`);
    };

    // Array of channels that received copies
    let deliveredMessageChannels = [];

    // Copy message to channels if they are mentioned. This will allow for
    // a report to be issued at the end if the original messages are deleted.
    if (message.mentions.channels) {
        message.mentions.channels.forEach((thisChannel) => {
            Dolores.generateQuoteEmbed(message)
                .then( (quotedMessage) => {
                    thisChannel.send({ embed: quotedMessage });
                })
                .catch( (error) => {
                    console.error(`Unable to move message: ${error}`);
                });
            // Add this channel to the list of transfers
            deliveredMessageChannels.push(thisChannel)
        });

        // If message is being moved, delete the original
        if (commandName == 'move') {
            Dolores.getInlineReplyParent(message)
                .then( (oldMessage) => {
                    message.channel.bulkDelete([oldMessage]);
                })
                .then( () => {
                        // Delete the command message. It looks messy when 
                        // the reply is to a missing message.
                        return message.channel.bulkDelete([message]);
                    })
                .catch( (error) => {
                    console.error('Unable to delete message: ' + error);
                    message.channel.send(
                        'Unable to delete the original message. Possibly it ' +
                        'is over 2 weeks old.');
                });

            // Now there is no explanation for what happened, so tell the
            // channel
            message.channel.send(
                `I moved a message to ${
                    deliveredMessageChannels.join(', ')
                }`
            );
        };
    };
};