const config = require('../config.json');

/**
 * Get the Discord command prefix
 * 
 * @return {string} Discord command prefix
 */
function getPrefix() { 
    return config.prefix; 
};

module.exports = getPrefix();