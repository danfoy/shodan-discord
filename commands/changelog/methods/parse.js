/**
 * Take a hierarchically-structured CHANGELOG.md and parse it into an Object
 *
 * @return {Object} An Object representation of `/CHANGELOG.md`
 */
 function parse() {

    const Shodan = require('../../../classes/shodan');

    let changelogFile = Shodan.getFile('../CHANGELOG.md');

    // Split file into array at 2nd-level headings (versions)
    let changelogArray = changelogFile
        .split(/\n## /);

    // Remove messages from top of file
    let header = changelogArray
        .shift()
        .substring(11) // Need more elegant solution for this
        .trim();

    // Create the changelog object
    let changelog = {
        header: header,
        versions: []
    };

    // Loop through each version stanza
    for (let version = 0; version < changelogArray.length; version++) {

        // Split version into sections by 3rd-level heading
        let sections = changelogArray[version]
            .split(/\n### /);

        // Shift title from array into new variable
        let versionTitleHeading = sections
            .shift()
            .toString()
            .trim();

        // Split title into version and date components
        let versionTitleArray = versionTitleHeading
            .split(/ +/);

        let versionTitleTag = versionTitleArray[0]
            .replace(/[\[|\]]/g, '')
            .replace(/\(.*\)/g, '')


        // Split date component into array for Date construction
        let versionTitleDate = versionTitleArray[1]
            .replace(/[(|)]/g, '')
            .split(/-/);

        let thisVersion = {
            title: versionTitleTag,
            date: new Date(
                versionTitleDate[0],
                versionTitleDate[1] - 1, // Month is 0-indexed 🤨
                versionTitleDate[2]
                ),
            changes: []
        };

        // Loop through each section stanza
        for (let section = 0; section < sections.length; section ++){

            // Split by line into title + individual commmits
            let commit = sections[section]
                .split(/\n/);

            // Remove title
            let sectionTitle = commit
                .shift()
                .toString()
                .trim();

            // Remove empty lines and Markdown bullets from commit array
            let content = commit
                .filter(commit => commit != '')
                .map(entry => entry.replace(/^\*/, ''));

            let changes = {
                title: sectionTitle,
                content: content
            };

            thisVersion.changes.push(changes);
        };

        changelog.versions.push(thisVersion);

    };
    /*
     * Example object:
     * {
     *     header: 'Content between top of CHANGELOG.md and first version stanza',
     *     versions: [
     *         { title: 'version 2',
     *           date: Date,
     *           changes: [ { title: 'bugfixes',
     *                        content: ['commit 1', 'commit 2'] },
     *                      { title: 'features',
     *                        content: '['commit 1', 'commit 2'] } ] },
     *         { title: 'version 2',
     *           date: Date,
     *           changes: [ { title: 'bugfixes',
     *                        content: ['commit 1', 'commit 2']},
     *                      { title: 'features',
     *                        content: '['commit 1', 'commit 2'] } ] } ]
     * }
     */
    return changelog;
};

module.exports = parse;
