/**
 * Check if a message is an inline reply
 *
 * @param {Message} message The message that performed this request
 * @returns {boolean} Whether this message is an inline reply
 * @memberof Dolores
 */
function checkInlineReply(message) {
    // Check if the message contains any references
    if (!message.reference) return false;
    // Check that the reference is to another message
    // This will always fail if the test above is ommitted
    if (!message.reference.messageID) return false;
    return true;
};

module.exports = checkInlineReply;
