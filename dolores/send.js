/**
 * Helper method for sending messages via the discord.js library.
 * 
 * The Discord API only allows sending one embed per message, but many of the 
 * Shodan commands split output into several embeds. To save having to manually
 * `.forEach` on every embed, using this function instead will send each
 * embed in series. It also works fine with both strings and arrays of strings
 * (as an alias of `*Channel.send()`).
 *
 * @param {(TextChannel|DMChannel|NewsChannel)} recipient Message recipient
 * @param {(String|String[]|Object[])} content String(s) or embed objects
 * @memberof Dolores
 */
function send(recipient, content) {
    if (Array.isArray(content)) {
        return content.forEach(
            item => recipient.send(item) );
    }
    return recipient.send(content);
};

module.exports = send;
