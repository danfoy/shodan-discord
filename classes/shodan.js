const fs = require('fs');

/**
 *  Utility functions
 *
 * @class Shodan
 */
class Shodan {
    constructor() {};

    /**
     * Shortcut for loading utility functions
     * @param {string} name - utility name/filename (should be same)
     */
    static getUtils(name) {
        return require(`../utilities/${name}.js`);
    };

    /**
     * Get the Discord command prefix
     * @return {string} - Discord command prefix
     */
    static getPrefix() {
        return this.getUtils('getPrefix');
    };
};

module.exports = Shodan;