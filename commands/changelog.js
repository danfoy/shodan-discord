const Command = require('../classes/command');
const command = new Command({
    name: 'changelog',
    aliases: ['version', 'updates', 'update', 'changes'],
    description: 'Shows recent updates to Shodan',
    standalone: 'Show the changelog for the current version',
    execute: changelog
});
command.setAccessLevel('anon');
command.addOption('-[number]', '-n changelogs prior to the current version');
command.addExample('version -1', 'Show the changelog for the previous version');
module.exports = command;

const fs = require('fs');
const MessageEmbed = require('../discord/classes/Discord').MessageEmbed;
const { sendMessage } = require('../utils.js');

function changelog(context, args = [], type, target) {

    const changelog = parseChangelog(getFile('../CHANGELOG.md'));

    let offset = 0;
    
    // Parse options
    if (args[0]) {
        if (args[0].startsWith('-')) offset = args[0].replace('-', '');
        else return sendMessage(context, type, target, `${args.join(/ +/)} is invalid usage, n00b.`);
    }

    let embedMessages = generateEmbeds(changelog, offset);
    return embedMessages.forEach(embed => sendMessage(context, type, target, embed));


    // Functions

    /**
     * Load a file from the filesystem.
     *
     * Abstraction of nodejs functionality for easier refactoring later.
     *
     * @param  {path}   path    Path to target file
     * @return {file}           File loaded by nodejs
     */
    function getFile(path) {
        return fs.readFileSync(
            __dirname + '/' + path,
            'utf8',
            (err, file) => { if (err) throw err });
            ;
    };

    /**
     * Take a hierarchically-structured CHANGELOG.md and parse it into an Object
     *
     * Example object:
     *
     * {
     *     header: 'Content between top of CHANGELOG.md and first version stanza',
     *     versions: [
     *         {
     *             title: 'version 2',
     *             date: Date,
     *             changes: [
     *                 {
     *                     title: 'bugfixes',
     *                     content: ['commit 1', 'commit 2']
     *                 },
     *                 {
     *                     title: 'features',
     *                     content: '['commit 1', 'commit 2']
     *                 }
     *             ]
     *         },
     *         {
     *             title: 'version 1',
     *             date: Date,
     *             changes: [
     *                 {
     *                     title: 'bugfixes',
     *                     content: ['commit 1', 'commit 2']
     *                 },
     *                 {
     *                     title: 'features',
     *                     content: '['commit 1', 'commit 2']
     *                 }
     *             ]
     *         }
     *     ]
     * }
     *
     * @param  {file}   file    CHANGELOG.md loaded via nodejs
     * @return {Object}         An Object representation of `file`
     */
    function parseChangelog(file) {

        // Split file into array at 2nd-level headings (versions)
        let changelogArray = file
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

                // Remove empty lines from commit array
                let content = commit.filter(commit => commit != '');


                let changes = {
                    title: sectionTitle,
                    content: content
                };

                thisVersion.changes.push(changes);
            };

            changelog.versions.push(thisVersion);

        };

        return changelog;
    };

    /**
     * Generate a changelog embed object to send to Discord
     *
     * @param  {object} changelog       Representation of changelog from parseChangelog()
     * @param  {Number} offset          Offset changelog version since most recent
     * @return {Array}                  Array of Discord.MessageEmbed objects
     */
    function generateEmbeds(changelog, offset = 0) {

        // Validate offset format
        if (offset && ! parseInt(offset)) {
            return ['Offset must be in digits, n00b. Try again.'];
        }
        
        const version = changelog.versions[offset];

        // Check this version exists
        if (!version) {
            return [
                "I may be a goddess, but I'm not *that* old.",
                `Maximum offset is \`-${changelog.versions.length - 1}\`. Try again.`
            ];
        }

        let embeds = [];

        /**
         * Generate description text for the header
         */
        function generateDescription() {

            function findSection(title) {
                try { return version.changes.find(section => section.title === title).content.length }
                catch { return 0 };
            }

            // Get number of changes for each section
            const features = findSection('Features');
            const bugs     = findSection('Bug Fixes');
            const plumbing = findSection('Plumbing');

            // Store each section string in an array
            let output = [];
            
            // Generate desciptive text for each section
            if (features)   output.push(`${features} new or enhanced ${features > 1 ? 'features' : 'feature'}`)
            if (bugs)       output.push(`${bugs} ${bugs > 1 ? 'bugfixes' : 'bugfix'}`);
            if (plumbing)   output.push(`${plumbing} under-the-hood ${plumbing > 1 ? 'tweaks' : 'tweak'}`)

            // Add grammatical 'and' where appropriate
            if (output.length > 1) output[output.length -1 ] = `and  ${output[output.length - 1]}`;

            // Squash array into a string joined by Oxford commas
            output = output.length > 2 ? output.join(', ') : output.join(' ');

            // Return description with release-type introduction
            return output = `This is a **${features ? 'feature' : 'maintenance'} release** comprised of ${output}.`;
        }

        const headerDescription = generateDescription();

        const
        headerEmbed = new MessageEmbed();
        headerEmbed.setColor('GREEN');
        headerEmbed.setTitle(`Shodan v${version.title}`);
        headerEmbed.setDescription(headerDescription);
        headerEmbed.setFooter(`Released on ${version.date.toLocaleDateString('en-GB', {dateStyle: 'full'})}`);
        embeds.push(headerEmbed);

        for (   let section = 0;
                section < version.changes.length;
                section++) {
            
            let commits = version.changes[section].content;
            let contentBlocks = []

            for (   let thisCommit = 0, characterCount = 0, thisContent = [];
                    thisCommit < commits.length;
                    thisCommit ++) {
                
                if (commits[thisCommit].length + characterCount < 2048) {
                    characterCount += commits[thisCommit].length;
                    thisContent.push(commits[thisCommit]);
                } else {
                    contentBlocks.push(thisContent.join('\n'));
                    characterCount = commits[thisCommit].length;
                    thisContent = [commits[thisCommit]];
                };

                if (thisCommit === commits.length - 1) {
                    contentBlocks.push(thisContent.join('\n'));
                };
            }

            // Set up some variables for tracking forEach state
            let sectionTitleSet = false;
            let sectionPage = 1;

            // Generate paginated `Discord.MessageEmbed`s
            contentBlocks.forEach(contentBlock => {

                // New Discord.MessageEmbed for each iteration
                const thisEmbed = new MessageEmbed;
                
                // Set up embed
                thisEmbed.setColor('GREEN');
                thisEmbed.setDescription(contentBlock);

                // Add a title if this section doesn't have one yet
                if (!sectionTitleSet) thisEmbed.setTitle(version.changes[section].title);
                sectionTitleSet = true;

                // Add page numbers if content is paginated
                if (contentBlocks.length > 1)
                thisEmbed.setFooter(`Page ${sectionPage} of ${contentBlocks.length}`)
                sectionPage++;

                // Add embed to the stack
                embeds.push(thisEmbed);
            });
        };
        return embeds;
    };
};
