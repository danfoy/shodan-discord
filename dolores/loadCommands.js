const Discord = require('discord.js');
const path = require('path');
const glob = require('glob');

/**
 * Accepts a string representing a glob which describes the location of
 * command files from the project root, and returns a discord.js Collection
 * of commands to attach to the Dolores.
 * 
 * It's currently using the discord.js convention of using the utility class
 * Collection, which is a Map with added Array-like methods. As nice as this
 * utility function is, it will be easier to test if I refactor this to a native
 * Map type. This will also allow me to split this method off to a utility
 * method in the future to allow use with other modules.
 * 
 * This works for now, though, so it's not a pressing priority.
 *
 * @param {String} pathGlob glob pattern for commmand files from project root
 * @returns {Collection} discord.js collection
 * @memberof Dolores
 */
function loadCommands(pathGlob) {

    const commands = new Discord.Collection();
    let absolutePath = path.dirname(require.main.filename) + pathGlob;

    glob(absolutePath, (error, files) => {
        if (error) return console.error(error);
        let loadedCommands = [];
        files.forEach(file => {
            const command = require(file);
            commands.set(command.name, command);
            loadedCommands.push(command.name)
        });
        console.info(`Dolores loaded ${loadedCommands.length} commands: ${
            loadedCommands.join(', ')}`);
    });

    return commands;
};

module.exports = loadCommands;
