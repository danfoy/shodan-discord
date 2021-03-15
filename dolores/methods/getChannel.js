/**
 * Search same-guild channels by name and return a GuildChannel object
 * if found.
 *
 * @param {Message} message the message that performed the request
 * @param {String} potentialChannel Channel to search for
 * @returns {GuildChannel} GuildChannel Object
 * @memberof Dolores
 */
function getChannel(message, potentialChannel) {
    return message.guild.channels.cache.find(
        (channel) => channel.name == potentialChannel );
};

module.exports = getChannel;
