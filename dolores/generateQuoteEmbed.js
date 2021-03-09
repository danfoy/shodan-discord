/**
 * Generate an embed-compatible object based on the content of the parent
 * message, to which the provided message is an inline reply.
 *
 * @param {Message} message The message that performed this request
 * @returns {Promise} Resolves to embeddable object
 * @memberof Dolores
 */
 async function generateQuoteEmbed(message) {
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
        })
    );
};

module.exports = generateQuoteEmbed;
