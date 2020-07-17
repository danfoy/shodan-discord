module.exports = {
    name: 'apex',
    aliases: ['legends'],
    description: 'Generate a randomized Apex Legends squad',
    usage: `\`[squad type]\` (req) \`[teammate 1]\` (opt) \`[teammate 2]\` (opt) \n` +
           `Squad type followed by the names of your teammates (tagging works well)\n\u200b\n` +
           `Squad type can be any of the following:\n` +
           '- `squads`, or `squad`, `legends`, `team`, `trios`, `trio`\n' +
           '- `duos` or `duo`\n' +
           '- `solo` or `legend`, `solos`\n\u200b\n' +
           `e.g. \`!apex squad wraith_ttv gamer420\`\n`,
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
    }

    // Send quips if there are any
    if (quip) message.channel.send(quip);

    // Clean up original command
    message.delete();

}
