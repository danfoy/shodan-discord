const fs = require('fs');
const path = require('path');

/**
 * Get the age of the changelog. This function operates directly on the
 * changelog file and the result returned is the time since the file was
 * 'touched' in Unix parlance. In practice this is useful for checking if the
 * system is restarting after a version update.
 *
 * @returns {Number} Seconds since the changelog file was touched
 */
async function ageInSeconds(file) {
    const result = await fs.stat('./CHANGELOG.md', (error, stats) => {
        if (error) return console.error(error);
        const age = Math.floor((new Date - stats.mtime) / 1000);
        console.log(`Internal ageInSeconds value: ${age}`);
        return age;
    });
    return result;
};

module.exports = ageInSeconds;
