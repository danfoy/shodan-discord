const Shodan = require('./shodan');

class Changelog {
    constructor(file) {
        this.file = Shodan.getFile(file);
        this.all = this.parse(file);
        this.header = this.all.header;
        this.versions = {
            current: this.all.versions[0],
            byOffset: this.getByOffset()
        }
    }

    getByOffset(offset) {
        return this.all.versions[offset];
    }

    /**
     * Take a hierarchically-structured CHANGELOG.md and parse it into an Object
     *
     * @param  {file}   file    CHANGELOG.md loaded via nodejs
     * @return {Object}         An Object representation of `file`
     */
    parse(file) {

        // Split file into array at 2nd-level headings (versions)
        let changelogArray = this.file
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
            let versionTitle = sections
                .shift()
                .toString()
                .trim();

            // Split title into version and date components
            versionTitle = versionTitle
                .replace(/[(|)]/g, '')
                .split(/ +/)

            // Split date component into array for Date construction
            versionTitle[1] = versionTitle[1]
                .split(/-/)

            let thisVersion = {
                title: versionTitle[0],
                date: new Date(
                    versionTitle[1][0],
                    versionTitle[1][1] - 1, // Month is 0-indexed 🤨
                    versionTitle[1][2]
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
};

module.exports = Changelog;