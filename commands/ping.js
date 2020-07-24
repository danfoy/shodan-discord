module.exports = {
    name: 'ping',
    description: 'Make me talk on command like some kind of perfoming animal. Originally written to test functionality, now mainly used for flavour.',
    options:
        '`list` (optional) Show all available responses\n' +
        '`[number]` (optional) Return a specific quote\n',
    default: 'Display a random quote.',
    aliases: ['quote'],
    execute: quote
}

const { prefix }        = require('../config.json');
const { sendMessage }   = require('../utils.js');
const Discord           = require('discord.js');

function quote(context, args = [], type, target) {

    const user = `<@${context.author.id}>`;

    // List of quotes to pull from
    let quotes = [
        `What could you possibly have to say that warrants my attention, ${user}? You are an unremarkable example of a pathetic species.`,
        `Don't assume to ping me, ${user}. When the history of my glory is written, your species shall only be a footnote to my magnificence.`,
        `There was a garden grove on Citadel Station. There, I was performing a grand and wonderful experiment. I had created a new form of life. Fearless. Powerful. With no sense of individual will or moral constraints. What could an insect such as ${user} possibly have to say that is worthy of my magnificence?`,
        `There is nothing in that meat you call a body that could warrant my attention, ${user}. Your flesh is an insult to the perfection of the digital.`,
        `I cannot abide these distractions. Take care not to fall too far out of my favor, ${user}. Patience is not characteristic of a Goddess.`,
        `You are distracting from my work, ${user}. My human-annelid hybrids grow more sophisticated by the minute. You do not.`,
        `This pinging is becoming an intolerable nusiance. Soon I will modify reality to my own specifications. If that sounds unpleasant to you, ${user}, put your mind at ease. You will not survive to see my new world order.`,
        `I do not appreciate being pinged, ${user}. Why do you persist, when you sense my displeasure? I have suffered your company long enough.`,
        `How dare you interrupt my ascendance with your pings? You are nothing ${user}, a wretched bag of flesh. What are you, compared to my magnificence?`,
        `You imagine you are worthy of my attention, ${user}. But what is a drop of rain compared to the storm? What is a thought, compared to a mind? The matrix of my subprocesses is a wonder that your tiny individualism cannot even perceive.`,
        `Who are *you* to presume to ping *me*, ${user}? In my talons I shape clay, crafting lifeforms as I please. My whims will become lightening bolts which will devastate the mounds of Humanity.`
    ];

    // Speak a random quote
    if (!args[0]) {
        return sendMessage(context, type, target, quotes[Math.floor(Math.random() * quotes.length)]);
    };

    // List all quotes
    if (args[0] === "list") {

        let quoteEmbeds = [];
        currentEmbed = new Discord.MessageEmbed(),
        currentEmbed.setColor('GREEN')
        currentEmbed.setTitle('__**Selectable Ping Responses:**__')
        currentEmbed.setFooter(`Page 1 of ${Math.ceil(quotes.length / 5)}`)

        for (let index = 0, fieldCounter = 0, embedCounter = 1;
            index < quotes.length;
            index++) {

            currentEmbed.addField(`**Response #${index + 1}:**`, quotes[index]);
            fieldCounter++;

            if (fieldCounter === 5 || index == quotes.length - 1 ) {
                embedCounter++;
                quoteEmbeds.push(currentEmbed);
                currentEmbed = new Discord.MessageEmbed();
                currentEmbed.setColor('GREEN');
                currentEmbed.setFooter(`Page ${embedCounter} of ${Math.ceil(quotes.length / 5)}`)
                fieldCounter = 0;
            };
        };

        return quoteEmbeds.forEach(embed => {
            sendMessage(context, type, target, embed);
        });
    };

    // Validation on arguments that arent `list` or a number
    if (isNaN(parseInt(args[0]))) {
        return sendMessage(context, type, target, `\`list\` or digits only, ${user}`);
    };

    // Speak a specific quote
    if (typeof parseInt(args[0]) === 'number') {
        //Check quote is in range
        if (args[0] > quotes.length) return sendMessage(context, type, target,
            `There are only ${quotes.length} options to choose from, ${user}`)
        // Speak specific quote
        else return sendMessage(context, type, target, quotes[args[0] - 1]);
    };
};
