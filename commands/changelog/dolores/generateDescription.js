/**
 * Generate the description text for the changelog embed
 *
 * @param {Object} version changelog version object to parse
 * @returns {String} text description of this changelog entry
 * @memberof changelog.dolores
 */
function generateDescription(version) {

    function findSection(title) {
        try { return version.changes
                .find(section => section.title === title).content.length }
        catch { return false };
    };

    // Get number of changes for each section
    const features = findSection('Features');
    const bugs     = findSection('Bug Fixes');
    const plumbing = findSection('Plumbing');

    // Store each section string in an array
    let output = [];

    // Generate desciptive text for each section
    if (features)   output.push(`${features} new or enhanced ${
                        features > 1 ? 'features' : 'feature'}`);
    if (bugs)       output.push(`${bugs} ${
                        bugs > 1 ? 'bugfixes' : 'bugfix'}`);
    if (plumbing)   output.push(`${plumbing} under-the-hood ${
                        plumbing > 1 ? 'tweaks' : 'tweak'}`);

    // Add grammatical 'and' where appropriate
    if (output.length > 1)
        output[output.length -1 ] = `and  ${output[output.length - 1]}`;

    // Squash array into a string joined by Oxford commas
    output = output.length > 2 ? output.join(', ') : output.join(' ');

    // Return description with release-type introduction
    return output =     `This is a **${
                            features ? 'feature' : 'maintenance'
                            } release** comprised of ${output}.`;
};

module.exports = generateDescription;
