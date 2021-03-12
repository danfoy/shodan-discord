const fs = require('fs');

/**
 * Get the age of the changelog. This function operates directly on the
 * changelog file and the result returned is the time since the file was
 * 'touched' in Unix parlance. In practice this is useful for checking if the
 * system is restarting after a version update.
 *
 * @returns {Number} Seconds since the changelog file was touched
 */
 function ageInSeconds() {
    let fileStats = fs.statSync(process.cwd() + '/CHANGELOG.md');
    return Math.floor((new Date - fileStats.mtime) / 1000);
};

module.exports = ageInSeconds;
