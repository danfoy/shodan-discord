/**
 * Get a version offset back from the current version by `Number`. It works by
 * simply grabbing the index of the offset provided, because the changelog is
 * automatically generated in reverse chronological order anyway, with the
 * current version being at index 0.
 * 
 * This means it won't handle any cases where an older version has been patched,
 * but I don't ever intend to be deploying versions older than the current
 * anyway so it shouldn't matter.
 *
 * @param {Number} offset Offset of versions prior to current release
 * @returns {Object|undefined} Version object, or `undefined` if not found
 * @memberof Changelog
 */
function getByOffset(offset) {
    return this.all.versions[offset];
};

module.exports = getByOffset;
