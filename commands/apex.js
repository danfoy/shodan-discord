module.exports = {
    name: 'apex',
    aliases: ['legends'],
    description: 'Generate a randomized Apex Legends squad',
    options:
        `\`[squad type]\` (optional)\n` +
        `\`[teammate(s)]\` (optional) teammate names or tags, space-separated\n`,
    usage:
        `Tag or name up to two other players and I will work out the squad size myself, ` +
        `using you as the first player by default. ` +
        `Alternatively use a squad type keyword as the first option, and I will autofill ` +
        `any empty slots for you. You can also use this mode to generate squads for ` +
        `other players, excluding yourself from the lineup.\n\u200b\n` +
        `Squad type keyword can be any of the following:\n` +
        '- `squads`, or `squad`, `legends`, `team`, `trios`, `trio`\n' +
        '- `duos` or `duo`\n' +
        '- `solo` or `legend`, `solos`',
    examples:
        '`!apex squad wraith_ttv gamer420`\n' +
        'Generate a 3-player squad for you, `wraith_ttv`, and `gamer420`.\n' +
        '`!apex solo Anakin`\n' +
        'Generates a solo squad for player `Anakin`',
    default:
        'Generate one random legend',
    execute: roll
}

const { legends }   = require('../data/legends.json');
const { sendMessage } = require('../utils.js');
const   Discord     = require('discord.js');

function roll(context, args = [], type, target) {

    const embedObj = new Discord.MessageEmbed();

    function generateRoster(squadSize, embed, playerOne = false) {

        embed.setColor('#fcba03');
        embed.setTitle(`__**Your randomised ${squadSize > 1 ? 'legends' : 'legend'}:**__\n\u200b`);

        // Assign player names if available
        let players = [];
        if (playerOne) {
            players[0] = playerOne;
            players[1] = args[1] || "Player 2";
            players[2] = args[2] || "Player 3";
        } else {
            players[0] = `<@${context.author.id}>`;
            players[1] = args[0] || "Player 2";
            players[2] = args[1] || "Player 3";
        }

        // Get (clone) array of available legends
        let availableLegends = [].concat(legends);

        // Prepare roster array
        let roster = [];

        // Randomise squadSize number of legegends to roster array
        for (let i = 0; i < squadSize; i++) {
            const randomIndex = Math.floor(Math.random() * availableLegends.length);
            roster.push(availableLegends.splice(randomIndex, 1));
        };

        for (let i = 0; i < squadSize; i++) {
            embed.addField(`**${roster[i]}**`, `${players[i]}\n\u200b`, true);
        };

        return embed;
    }

    // Return a random quip or false
    function generateQuip(embed) {

        let matches = [];

        // Loop through each roster entry
        for (let i = 0; i < embed.fields.length; i++) {

            // Default value for player to stop errors on remarks
            let player = embed.fields[i].value;
            // Trim newline from player variable
            player = player.replace('\n\u200b', '');

            const remarks = {
                'Wraith': `Stay sweaty ${player}_TTV`,
                'Crypto': `Haha get rekt ${player}`,
                'Wattson': `Make your father proud, ${player}`,
                'Pathfinder': `You won't find your maker, ${player}. I see no other gods up here but me.`,
                'Bloodhound': `May the Allfather bless ${player} in slatra`,
                'Revenant': `Bring me their skinsuits, ${player}`
            };

            // Match legends with remarks
            for (let [legend, remark] of Object.entries(remarks)) {
                legend = `**${legend}**`;
                if (legend == embed.fields[i].name) {
                    player = embed.fields[i].value.toString();
                    // Trim newline from player variable
                    player = player.replace('\n\u200b', '');
                    matches.push(remark);
                };
            };
        };

        return matches[0] || false;
    };

    function sendEmbed(squadSize, embedObj, playerOne = false) {
        generateRoster(squadSize, embedObj, playerOne);
        sendMessage(context, type, target, embedObj);
        let quip = generateQuip(embedObj);
        if (quip) sendMessage(context, type, target, quip);
    }

    /**
     * Argument Validation
     *
     * Mode logic depends on players not tagging themselves - the function
     * will treat them as just another player. Therefore it is pertintent to
     * strip them out of the arguments.
     */
    (function stripAuthor(args) {

        // 0 is a valid array index, so can't use 0 as a check.
        // Array.findIndex() returns -1 on failure. Use that instead.
        let taxIndex = -1;

        // Find index of first self-tag
        if (args) tagIndex = args.findIndex(selfTag => selfTag.includes(context.author.id));

        // Remove first self-tag from args array, else finished
        if (tagIndex != -1) args.splice(tagIndex, 1)
        else return;

        // Run recursively until all self-tags removed
        stripAuthor(args);
    })(args);


    /**
     * Keywork mode logic
     *
     * Command supports being invoked by a keyword. This allows invocation
     * without providing player names - placeholder values are used if
     * an insufficient number of players are tagged.
     */

    // Prepare keywords
    const trios = ['legends', 'squads', 'squad', 'team', 'trios', 'trio'];
    const duos  = ['duos', 'duo'];
    const solos = ['solos', 'solo', 'legend'];

    // Normalised keyword placeholder
    const format = args[0] ? args[0].toLowerCase() : false;

    // Trios keyword mode
    if (trios.includes(format)) {
        args.shift();
        if (args[2]) return sendEmbed(3, embedObj, args[0]);
        return sendEmbed(3, embedObj);
    };

    // Duos keyword mode
    if (duos.includes(format)) {
        args.shift();
        if (args[1]) return sendEmbed(2, embedObj, args[0]);
        return sendEmbed(2, embedObj);
    };

    // Solos keyword mode
    if (solos.includes(format)) {
        args.shift();
        if (args[0]) return sendEmbed(1, embedObj, args[0]);
        return sendEmbed(1, embedObj);
    };

    /**
     * Computed mode logic
     *
     * If there are no keyword arguments, infer the squad type from the
     * number of arguments in the command.
     */

    // Error - more than 3 squad members (including invoking user)
    if (args[3]) {
        return sendMessage(context, type, target, 'How am I supposed to generate a squad with more than 3 members? Moron. RTFM.');
    };

    // Implied Trios, explicit playerOne mode
    if (args[2]) {
        return sendEmbed(3, embedObj, args[0]);
    };

    // Implied Trios mode
    if (args[1]) {
        return sendEmbed(3, embedObj);
    };

    // Implied Duos mode
    if (args[0]) {
        return sendEmbed(2, embedObj);
    };

    // Default - Solos mode
    return sendEmbed(1, embedObj);

}
