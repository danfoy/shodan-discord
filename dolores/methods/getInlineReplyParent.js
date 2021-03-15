/**
 * Fetch the message to which the passed-in message is an inline reply
 *
 * @param {Message} message the child message
 * @returns {Promise} parent Message object
 * @memberof Dolores
 */
async function getInlineReplyParent(message) {
    return message.channel.messages.fetch(message.reference.messageID);
};

module.exports = getInlineReplyParent;
