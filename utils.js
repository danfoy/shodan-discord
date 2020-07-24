/**
 * Get specific command object by name or alias
 *
 * @param  {Client} client      Discord.Client object
 * @param  {string} commandName Name or alias of required command
 * @return {object}             Command object as currently loaded onto
 *                              client
 */
function getCommand(client, commandName) {
    return  client.commands.get(commandName) ||
            client.commands.find( (cmd) =>
                cmd.aliases &&
                cmd.aliases.includes(commandName)
            );
}
module.exports.getCommand = getCommand;

/**
 * [sendMessage description]
 * @param  {object} context Pass in `client` or `message`
 * @param  {string} type    `reply` or `channel`
 * @param  {string} target  ID of channel
 * @param  {string} content What to send
 * @return {undefined}      Function is side-effect only
 */
function sendMessage(context, type = 'reply', target, content) {

    if (type === 'reply') {
        return context.channel.send(content)
            .catch(error => console.log(error));
    };

    if (type === 'channel') {
        return context.channels.fetch(target)
            .then(channel => channel.send(content))
            .catch(error => console.log(error));
    }
}
module.exports.sendMessage = sendMessage;

/**
 * Insert a Horizontal Rule
 *
 * @param  {string} weight      Bold/regular
 * @return {template string}    Consistent ruler
 */
function hr(weight) {
    let hr = ``;
    if (weight === "thick") hr = hr + `**`;
    hr = hr + `–`.repeat(30);
    if (weight === "thick") hr = hr + `**`;
    return hr;
}
module.exports.hr = hr;

/**
 * Send a response via the bot. Simple wrapper function for cleaner code.
 *
 * @param {object} message      The discord message object
 * @param {string} response     The response for Shodan to give
 */
function reply(message, response){
    message.channel.send(response)
        .catch(error => console.log(error));
}
module.exports.reply = reply;


function parseSeconds(seconds) {
    let days = Math.floor(   seconds / (60 * 60 * 24)               );
    let hrs  = Math.floor( ( seconds % (60 * 60 * 24) ) / (60 * 60) );
    let mins = Math.floor( ( seconds % (60 * 60)      ) /  60       );
    let secs = Math.floor(   seconds %  60                          );

    days += days === 1 ? ' day'    : ' days';
    hrs  += hrs  === 1 ? ' hour'   : ' hours';
    mins += mins === 1 ? ' minute' : ' minutes';
    secs += secs === 1 ? ' second' : ' seconds';

    return `${days}, ${hrs}, ${mins} and ${secs}`;
}
module.exports.parseSeconds = parseSeconds;
