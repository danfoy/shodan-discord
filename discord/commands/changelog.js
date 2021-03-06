const Command = require('../classes/Command');
const Changelog = require('../../classes/Changelog');
const command = new Command({
    name:           'changelog',
    aliases:        ['version', 'updates', 'update', 'changes'],
    description:    'Shows recent updates to Shodan',
    standalone:     'Show the changelog for the current version',
    execute: changelog
});
command.addOption( '-[number]',  '-n changelogs prior to the current version');
command.addExample('version -1', 'Show the changelog for the previous version');

command.setAccessLevel('anon');

module.exports = command;

const Discordjs = require('discord.js');

function changelog(message, args = []) {

    const changelog = new Changelog('../CHANGELOG.md');

    let offset = 0;

    // Parse options
    if (args[0]) {
        if (args[0].startsWith('-')) offset = args[0].replace('-', '');
        else return message.channel.send(message, type, target,
            `${args.join(/ +/)} is invalid usage, n00b.`);
    }

    return generateEmbeds(changelog, offset)
        .forEach( (section) => message.channel.send(section));
};

/**
     * Generate a changelog embed object to send to Discord
     *
     * @param  {object} changelog Changelog object from parseChangelog()
     * @param  {Number} offset Offset changelog version since most recent
     * @return {Array} Array of Discord.MessageEmbed objects
     */
 function generateEmbeds(changelog, offset = 0) {

    // Validate offset format
    if (offset && ! parseInt(offset)) {
        return ['Offset must be in digits, n00b. Try again.'];
    }

    const version = changelog.getByOffset(offset);

    // Check this version exists
    if (!version) {
        // Send command is expecting an array in this instance
        return ["I may be a goddess, but I'm not *that* old."];
    };

    let embeds = [];

    /**
     * Generate description text for the header
     */
    function generateDescription() {

        function findSection(title) {
            try { return version.changes
                    .find(section => section.title === title).content.length }
            catch { return false };
        }

        // Get number of changes for each section
        const features = findSection('Features');
        const bugs     = findSection('Bug Fixes');
        const plumbing = findSection('Plumbing');

        // Store each section string in an array
        let output = [];

        // Generate desciptive text for each section
        if (features)   output.push(`${features} new or enhanced ${
                            features > 1 ? 'features' : 'feature'}`)
        if (bugs)       output.push(`${bugs} ${
                            bugs > 1 ? 'bugfixes' : 'bugfix'}`);
        if (plumbing)   output.push(`${plumbing} under-the-hood ${
                            plumbing > 1 ? 'tweaks' : 'tweak'}`)

        // Add grammatical 'and' where appropriate
        if (output.length > 1)
            output[output.length -1 ] = `and  ${output[output.length - 1]}`;

        // Squash array into a string joined by Oxford commas
        output = output.length > 2 ? output.join(', ') : output.join(' ');

        // Return description with release-type introduction
        return output =     `This is a **${
                                features ? 'feature' : 'maintenance'
                                } release** comprised of ${output}.`;
    }

    const headerEmbed = new Discordjs.MessageEmbed();
    headerEmbed.setColor('GREEN');
    headerEmbed.setTitle(`Shodan v${version.title}`);
    headerEmbed.setDescription(generateDescription());
    headerEmbed.setFooter(`Released on ${
        version.date.toLocaleDateString('en-GB', {dateStyle: 'full'})}`);
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
                commits[thisCommit] = '•' + commits[thisCommit];
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
            const thisEmbed = new Discordjs.MessageEmbed();

            // Set up embed
            thisEmbed.setColor('GREEN');
            thisEmbed.setDescription(contentBlock);

            // Add a title if this section doesn't have one yet
            if (!sectionTitleSet) thisEmbed.setTitle(
                version.changes[section].title);
            sectionTitleSet = true;

            // Add page numbers if content is paginated
            if (contentBlocks.length > 1) thisEmbed .setFooter(
                `Page ${sectionPage} of ${contentBlocks.length}`)
                sectionPage++;

            // Add embed to the stack
            embeds.push(thisEmbed);
        });
    };
    return embeds;
};
