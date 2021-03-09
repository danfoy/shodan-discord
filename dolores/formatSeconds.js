/**
 * Formats an object representation of time into an English natural-language
 * string representation with MarkDown formatting.
 * 
 * Expects an object like {weeks, days, hours, minutes, seconds} where each
 * property is an integer. This can be generated using Shodan#parseSeconds, or
 * passed in as an object literal.
 *
 * @param {Object} timeObject Object like {weeks, days, hours, minutes, seconds}
 * @returns {String} Textual representation of time
 * @memberof Dolores
 */
function formatSeconds(timeObject) {

    let { weeks, days, hours } = timeObject;
    let mins = timeObject.minutes;
    let secs = timeObject.seconds;

    let output = '**';

    // Build output string
    if (weeks)output += weeks += weeks === 1 ? '** week, **'      : '** weeks, **'     ;
    if (days)  output += days  += days  === 1 ? '** day, **'       : '** days, **'      ;
    if (hours) output += hours += hours === 1 ? '** hour, **'      : '** hours, **'     ;
    if (mins)  output += mins  += mins  === 1 ? '** minute and **' : '** minutes and **';
               output += secs  += secs  === 1 ? '** second'        : '** seconds'       ;

    return output;
};

module.exports = formatSeconds;
