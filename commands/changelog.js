module.exports = {
    name: 'changelog',
    aliases: ['version', 'updates', 'update', 'changes'],
    description: 'Shows recent updates to Shodan',
    options: '`-[number]` (optional) *-n* changelogs prior to the current version',
    examples:
        '`!changelog -1` show the changelog for the previous version',
    default: 'Show the changelog for the current version',
    execute: changelog
};

const fs = require('fs');
const util = require('util');
const Discord = require('discord.js');


function changelog(message, args) {

    const changelog = parseChangelog(getFile('../CHANGELOG.md'));

    // Parse options
    if (args[0]) {

        // Offset mode
        if(args[0].startsWith('-')) {
            // Get the offset as a digit
            const offset = args[0].replace('-', '');
            // Send changelog embed
            return message.channel.send(generateEmbed(changelog, offset));
        }

        // Invalid
        else {
            return message.channel.send(`\`${args.join(' ')}\` is not a valid option. RTFM.`)
        };

    };

    // Default:
    return message.channel.send(generateEmbed(changelog));


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
     * @return {Discord.MessageEmbed}   MessageEmbed or error message
     */
    function generateEmbed(changelog, offset = 0) {
        const embed = new Discord.MessageEmbed();
        const version = changelog.versions[offset];

        // Validate offset format
        if (offset && ! parseInt(offset)) {
            return `Offset must be in digits, n00b. Try again.`;
        }

        // Check this version exists
        if (!version) {
            return `I may be a goddess, but I'm not *that* old. \n` +
                `Maximum offset is \`-${changelog.versions.length - 1}\`. Try again.`;
        }

        embed.setColor('GREEN');
        embed.setTitle(`v${version.title}`);
        embed.setDescription(
            `Released on ${version.date.toLocaleDateString('en-GB', {dateStyle: 'full'})}`
        );

        for (let section = 0; section < version.changes.length; section++) {
            embed.addField(
                version.changes[section].title,
                version.changes[section].content.join('\n') + '\n\u200b\n'
            );
        };

        return embed;
    };
};
