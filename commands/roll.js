module.exports = {
    name: 'roll',
    aliases: ['random', 'flip', 'generate', 'rand'],
    description: 'RNG Machine. Roll a dice or generate an Apex Legends squad',
    usage: `**1:** [\`squad\` | \`duos\`| \`solo\`] (required for legend mode) [*\`teammates\`*] (optional) \n` +
           `Some synonyms also work (e.g. \`team\`, \`trios\`, \`legends\`, \`legend\`)\n` +
           `To assign teammates to people, type/tag them at the end. You will automatically be added as Player 1.\n` +
           `e.g. \`!roll squad wraith_ttv gamer420\`\n` +
           `**2**: [\`dice\`] (required for dice mode) [*\`number\`*] (optional) Defaults to 6 sides, or specify like \`!roll dice 12\`\n` +
           `**Default:** roll a 6 sided dice`,
    execute: roll
}

const { legends }       = require('../data/legends.json');
const { reply, hr }     = require('../utils.js')


function roll(message, args) {

    function generateRoster(squadSize) {

        let players = [];
        players[0] = args[1] ? message.author.username : "Player 1";
        players[1] = args[1] || "Player 2";
        players[2] = args[2] || "Player 3";

        let availableLegends = [].concat(legends);
        let roster = [];

        for (let i = 0; i < squadSize; i++) {
            const randomIndex = Math.floor(Math.random() * availableLegends.length);
            roster.push(availableLegends.splice(randomIndex, 1));
        }

        function generateQuip(legend, player) {

            const remarks = {
                'Wraith': `Stay sweaty ${player}`,
                'Crypto': `Haha get rekt ${player}`,
                'Wattson': `Make your father proud, ${player}`,
                'Pathfinder': `Don't waste time looking for your maker, ${player}. There are no other gods up here but me.`,
                'Bloodhound': `May the gods bless ${player} in slatra`
            };

            let output = '';

            for (const [selection, remark] of Object.entries(remarks)) {
                if (selection == legend) {
                    output = remark;
                };
            };

            return output;
        }

        let quips = [];

        for (let i = 0; i < roster.length; i++) {
            const quip = generateQuip(roster[i], players[i]);
            if (quip) {
                quips.push(quip);
            };
        };

        if (quips[0] && squadSize > 1) {
            roster.push(hr());
            roster.push(quips[0]);
        };

        if (squadSize > 1) {
            for (let i = 0; i < squadSize; i++) {
                roster[i] = `**${players[i]}:** ${roster[i]}`;
            }
        };

        return roster;
    }


    let format = args[0] ? args[0].toLowerCase() : "dice";
    let data = [];

    switch (format) {

        case "legends":
        case "squads":
        case "squad":
        case "team":
        case "trios":
        case "trio":
            reply(message, hr("thick"));
            reply(message, `__**Your randomised squad:**__`);
            reply(message, generateRoster(3));
            reply(message, hr("thick"));
            break;

        case "duos":
        case "duo":
            reply(message, hr("thick"));
            reply(message, `__**Your randomised duos:**__`);
            reply(message, generateRoster(2));
            reply(message, hr("thick"));
            break;

        case "solos":
        case "solo":
        case "legend":
            reply(message, hr("thick"));
            reply(message, [`__**Play as:**__ ${generateRoster(1)}`]);
            reply(message, hr("thick"));
            break;

        case "dice":
            function rollDice(sides = 6) {
                return Math.floor((Math.random() * sides) + 1);
            }
            reply(message, `You rolled ${rollDice(args[1])}`);
            break;
    }
}
