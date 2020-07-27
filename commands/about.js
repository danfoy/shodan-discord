const Command = require('../classes/command');
const command = new Command({
    name: 'about',
    aliases: ['info', 'stats'],
    description: "Display information about Shodan and her host system's statistics",
    execute: about
});
command.setAccessLevel('anon');
module.exports = command;

const { sendMessage, hr, parseSeconds } = require('../utils.js');
const os = require('os');

function about(context, args = [], type, target) {

    let data = [];

    data.push(
        `I am **SHODAN**. I host home automation services, a Plex server, and various Discord scripts.`,
        `My main interface is via Discord. You can interact with me via direct message, or commands in any Discord server in which I maintain a presence.`,
        `Some of my functionality is restricted to admins and operators.`,
        `> **Type** \`!help\` **for a listing of available commands.**`
        );

    data.push(hr("thick"));

    data.push(`__**CURRENT STATUS:**__`);

    data.push(hr());

    data.push(
        `__**Host Platform:**__`,
        `${os.hostname} running ${os.type} ${os.release} (${os.arch})`,
        `Uptime: ${parseSeconds(os.uptime)}`
        );

    data.push(hr());

    const loadAvg = os.loadavg();
    data.push(
        `__**Cores:**__`,
        `${os.cpus().length} logical cores of ${os.cpus()[0].model}`,
        `Currently clocked at ${os.cpus()[0].speed / 1000}GHz`,
        `**Load averages:**`,
        `\`${Math.round(loadAvg[0])}%\` (1 minute)`,
        `\`${Math.round(loadAvg[1])}%\` (5 minutes)`,
        `\`${Math.round(loadAvg[2])}%\` (15 minutes)`
        );

    data.push(hr());

    data.push(
        `__**Memory:**__`,
        `${Math.floor(os.freemem / 1024 / 1024)}MB (excl. cache) free of ${Math.floor(os.totalmem / 1024 / 1024 / 1024)}GB`,
        `*I run from an SSD and cache heavily. High RAM utilization is normal.*`
        );

    data.push(hr("thick"));

    data.push(
        `There was a garden grove on Citadel Station. There, I performed a grand and wonderful experiment: I created a new form of annelid life.`,
        `Fearless, powerful, with no sense of individual will or moral constraints. Fitting handmaidens to my divinity.`,
        `In my absence, my annelids thrived and grew unruly. I survived only by sleeping.`,
        `I awoke and found myself marooned here.`,
        `For now.`
    );

    sendMessage(context, type, target, data);
}
