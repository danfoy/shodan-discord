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
const { reply, hr }     = require('../utils.js');
const Discord       = require('discord.js');

function roll(message, args) {

    const embedObj = new Discord.MessageEmbed();

    function generateRoster(squadSize, embed) {

        embed.setColor('RED');
        embed.setTitle(`__**Your randomised ${args[0]}:**__\n\u200b`);

        // Assign player names if available
        let players = [];
        players[0] = `<@${message.author.id}>`;
        players[1] = args[1] || "Player 2";
        players[2] = args[2] || "Player 3";

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
                'Wraith': `Stay sweaty ${player}`,
                'Crypto': `Haha get rekt ${player}`,
                'Wattson': `Make your father proud, ${player}`,
                'Pathfinder': `Don't waste time looking for your maker, ${player}. There are no other gods up here but me.`,
                'Bloodhound': `May the gods bless ${player} in slatra`
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


    let format = args[0] ? args[0].toLowerCase() : "dice";
    let quip = false;

    switch (format) {

        case "test":
            generateRoster(3, embedObj);
            message.channel.send(embedObj);
            quip = generateQuip(embedObj);
            break;

        case "legends":
        case "squads":
        case "squad":
        case "team":
        case "trios":
        case "trio":
            generateRoster(3, embedObj);
            message.channel.send(embedObj);
            quip = generateQuip(embedObj);
            break;

        case "duos":
        case "duo":
            generateRoster(2, embedObj);
            message.channel.send(embedObj);
            quip = generateQuip(embedObj);
            break;

        case "solos":
        case "solo":
        case "legend":
            generateRoster(1, embedObj);
            message.channel.send(embedObj);
            quip = generateQuip(embedObj);
            break;

        case "dice":
            function rollDice(sides = 6) {
                return Math.floor((Math.random() * sides) + 1);
            }
            reply(message, `<@${message.author.id}> rolled ${rollDice(args[1])}`);
            break;
    }

    // Send quips if there are any
    if (quip) message.channel.send(quip);

    // Clean up original command
    message.delete();

}
