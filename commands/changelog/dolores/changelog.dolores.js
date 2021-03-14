const Dolores = require('../../../dolores/Dolores');
const Changelog = require('..');
const command = new Dolores.Command({
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

/**
 * Sends a Discordjs.MessageEmbed with information from `CHANGELOG.md`
 *
 * @namespace changelog.dolores
 * @param {Discordjs.Message} message message object that called this
 * @param {Array} [args=[]] array of arguments provided when called
 * 
 */
function changelog(message, args = []) {

    const generateEmbeds = require('./generateEmbeds');
    const getChangelogVersion = require('./getChangelogVersion');

    const changelog = new Changelog();

    function parseArgs(args, target) {

        // Operate on target as single value
        if ( !Array.isArray(target) ) {
            if (args.includes(target)) {
                // Remove the target from the passed-in arguments
                // Cleans up args for further processing
                args.splice(args.indexOf(target), 1);
                return target;
            };
            return false;
        };

        // Operate on target by looping through array
        if ( Array.isArray(target) ) {
            let foundTarget;
            target.forEach( (thisTarget) => {
                if (args.includes(thisTarget)) {
                    // Remove the target from the passed-in arguments
                    // Cleans up args for further processing
                    args.splice(args.indexOf(thisTarget), 1);
                    return foundTarget = thisTarget;
                };
                return false;
            });
            return foundTarget;
        };

    };

    const changelogVersion = getChangelogVersion(changelog, args);

    // getChangelogVersion returns a string message on failure
    if (typeof changelogVersion != 'object') {
        return message.channel.send(changelogVersion);
    };

    const scope = parseArgs(args, ['summary', 'full']);

    // generateEmbeds returns an array of embeds, so use Dolores.send helper
    // method to send them out sequentially
    Dolores.send( message.channel, generateEmbeds(changelogVersion, scope) );
};
