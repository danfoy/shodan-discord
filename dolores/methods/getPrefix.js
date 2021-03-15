/**
 * Get the prefix for Dolores commands. This is the string which is prepended
 * to each command to allow Dolores to parse commands when issued via a
 * Discord message.
 * 
 * @return {string} Discord command prefix
 * @memberof Dolores
 */
function getPrefix() {
    const { prefix } = require('../../config.json');
    return prefix; 
};

module.exports = getPrefix;
