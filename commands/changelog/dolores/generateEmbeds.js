const Discordjs = require('discord.js');
const generateDescription = require('./generateDescription');

/**
 * Generate a changelog embed object to send to Discord
 *
 * @param  {object} version changelog version object
 * @return {Array} Array of Discord.MessageEmbed objects
 * @memberof changelog.dolores
 */
 function generateEmbeds(version, scope = 'standard') {

    // Initalise the embed queue array
    let embeds = [];

    // Create a summary embed and add to the embed queue
    const headerEmbed = new Discordjs.MessageEmbed();
    headerEmbed.setColor('GREEN');
    headerEmbed.setTitle(`Shodan v${version.title}`);
    headerEmbed.setDescription(generateDescription(version));
    headerEmbed.setFooter(`Released on ${
        version.date.toLocaleDateString('en-GB', {dateStyle: 'full'})}`);
    embeds.push(headerEmbed);

    if (scope == 'summary') return embeds;

    // Loop through each remaining section of this version
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

            if (version.changes[section].title == 'Plumbing' && scope != 'full') return;

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

            // Add embed to the queue
            embeds.push(thisEmbed);
        });
    };
    return embeds;
};

module.exports = generateEmbeds;
