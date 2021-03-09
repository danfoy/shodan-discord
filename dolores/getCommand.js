/**
 * Fetches a Dolores Command from the collection attached to the Dolores class.
 * Searches for the canonical name first, then loops through aliases if there
 * is not an exact match.
 * 
 * For consistency with the discord.js library, commands are attached to the
 * client using their Collection helper, which in turn extends ES6 Map.
 *
 * @param {Class} target Class hosting the commands
 * @param {String} commandName Command to search for
 * @returns {Command} Dolores#Command object
 * @memberof Dolores
 */
function getCommand(target, commandName) {
    const command = 
        target.commands.get(commandName) ||
        target.commands.find( (cmd) =>
            cmd.aliases &&
            cmd.aliases.includes(commandName)
        );
    return command;
};

module.exports = getCommand;
