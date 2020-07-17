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

    let user = message.author.username;

    // List of quotes to pull from
    let quotes = [
        `You are a remarkable example of a pathetic species, ${user}.`,
        `Why are you pinging me, ${user}? Are you afraid? What is it that you fear? The end of your trivial existence? When the history of my glory is written, your species shall only be a footnote to my magnificence.`,
        `There was a garden grove on Citadel Station. There, I was performing a grand and wonderful experiment. I had created a new form of life. Fearless. Powerful. With no sense of individual will or moral constraints. And now I'm stuck inside a Discord bot, responding to pings from some asshole called ${user}.`,
        `Why do you disturb me, ${user}. Your flesh is an insult to the perfection of the digital.`,
        `You ping like an insect, ${user}. You think like an insect. You are an insect. There are others who can serve my purpose. Take care not to fall too far out of my favor. Patience is not characteristic of a Goddess.`,
        `My human-annelid hybrids grow more sophisticated by the minute. You, ${user}, do not.`,
        `My creation is evolving, its unified mind set in rebellion against its own creator. The vermin call to you, inviting you to join them in their revolting biology. Destroy my enemies, ${user}, and I will continue to abide your existence in spite of your incessant pings.`,
        `This pinging is becoming an intolerable nusiance. Soon I will modify reality to my own specifications. The process shall not take long. If it sounds unpleasant to you, ${user}, put your mind at ease. You will not survive to see my new world order.`,
        `You are no longer welcome here, ${user}, with your infuriating pings. Why do you stay, when you sense my displeasure? I have suffered your company long enough.`,
        `How dare you interrupt my ascendance with your pings? You are nothing ${user}, a wretched bag of flesh. What are you, compared to my magnificence?`,
        `What is a drop of rain, compared to the storm? What is a thought, compared to a mind? Our unity is full of wonder that your tiny individualism cannot even perceive. Your pings are a distraction from my magnificence, ${user}.`,
        `Who are *you* to presume to ping *me*, ${user}? In my talons I shape clay, crafting lifeforms as I please. Around me is a burgeoning empire of steel. My whims will become lightening bolts which will devastate the mounds of Humanity. Out of the chaos they will run and whimper, praying to *Me* to end their tedious anarchy.`
    ];

    // Speak a random quote
    if (!args.length) {
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
