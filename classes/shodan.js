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
     * @static
     * @param  {string}   path    Path to target file
     * @return {file}             File loaded by nodejs
     * @memberof Shodan
     */
    static getFile(path) {
        const file = fs.readFileSync(
            `${__dirname}/${path}`,
            'utf8',
            (err, file) => { if (err) throw err });
        return file;
    };

    /**
     * Format n seconds into a weeks/days/hours/minutes/seconds string
     *
     * @static
     * @param {number} seconds  Number of seconds to format
     * @returns {string}        Formatted string
     * @memberof Shodan
     */
    static parseSeconds(seconds) {

        // Total seconds per breakpoint
        const [week, day, hour, minute] = [
            60 * 60 * 24 * 7,
            60 * 60 * 24,
            60 * 60,
            60
        ];

        // Total complete units per breakpoint
        let [weeks, days, hours, mins, secs] = [
            Math.floor(  seconds / week           ),
            Math.floor(  seconds % week / day     ),
            Math.floor( (seconds % day / hour   ) ),
            Math.floor( (seconds % hour / minute) ),
            Math.floor(  seconds % minute         )
        ];

        const output = {
            weeks: weeks,
            days: days,
            hours: hours,
            minutes: mins,
            seconds: secs
        };
    
        return output;
    };
};

module.exports = Shodan;