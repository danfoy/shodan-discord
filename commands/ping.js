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

function quote(message, args) {

    const user = `<@${message.author.id}>`;

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
    if (!args) {
        return message.channel.send(quotes[Math.floor(Math.random() * quotes.length)])
            .catch(error => console.error(error));
    };

    // List all quotes
    if (args[0] === "list") {
        allQuotes = [`__**All available quotes:**__`];
        for (let i in quotes) {
            allQuotes.push(`**${i}:** ${quotes[i]}`);
        }
        return message.channel.send(allQuotes, {split: true})
            .catch(error => console.error(error));
    };

    // Speak a specific quote
    if (typeof parseInt(args[0]) === 'number') {
        return message.channel.send(quotes[args[0]])
            .catch(error => console.error(error));
    };

    message.channel.send(`Invalid quote`);
};
