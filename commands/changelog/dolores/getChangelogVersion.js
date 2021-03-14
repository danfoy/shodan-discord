/**
 * Fetches a specific version from the passed-in Changelog object and returns
 * it as a new object on success, or returns a String message on failure
 *
 * @param {Object} changelog Changelog object
 * @param {Array} args command arguments
 * @returns {Object|String} object on success, string message on failure
 * @memberof changelog.dolores
 */
function getChangelogVersion(changelog, args) {

    // Return the current version if no arguments provided
    if (!args[0]) return changelog.current;
    
    // Search by offset if argument starts with `-`
    if (args[0].startsWith('-')) { 
        const offset = args[0].replace('-', '');
        const thisChangelog = changelog.getByOffset(offset);
        if (!thisChangelog) {
            return `I may be a goddess, but I'm not THAT old.`
        };
        return thisChangelog;
    };

    // Search by SemVer identifier if argument starts with `v`
    if (args[0].startsWith('v')) {
        const thisVersion = args[0].replace('v', '');
        const thisChangelog = changelog.getByVersion(thisVersion);
        if (!thisChangelog) {
            return `Unable to find version ${args[0]}`
        };
        return thisChangelog;
    };

    // Default return value is an error message as a String
    return `${args[0]} is not a valid option`;
};

module.exports = getChangelogVersion;
