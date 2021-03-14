/**
 * Fetch a specific version of the changelog by its SemVer version number.
 * Returns an object representation parsed from MarkDown in the original
 * `CHANGELOG.md` file in the project root, or `undefined` if not found.
 *
 * @param {String} version Version to fetch in SemVer notation
 * @returns {Object|undefined} Changelog version object or undefined
 * @memberof Changelog
 */
function getByVersion(version) {
    return this.all.versions.find(
        candidate => candidate.title == version.toString()
    );
};

module.exports = getByVersion;
