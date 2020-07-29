const fs = require('fs');

/**
 *  Utility functions
 *
 * @class Shodan
 */
class Shodan {
    constructor() {};

    /**
     * Load a file from the filesystem.
     *
     * Abstraction of nodejs functionality for easier refactoring later.
     *
     * @param  {string}   path    Path to target file
     * @return {file}             File loaded by nodejs
     */
    static getFile(path) {
        const file = fs.readFileSync(
            `${__dirname}/${path}`,
            'utf8',
            (err, file) => { if (err) throw err });
        return file;
    };
};

module.exports = Shodan;