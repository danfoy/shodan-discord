/**
 * Used as a template to build other Commands.
 *
 * @class Command
 */
class Command {
    /**
     *Creates an instance of Command. Options are declared in an object.
     * @param {string} name Name of the command
     * @param {string[]} [aliases] Other ways to execute the command
     * @param {string} [description] Short synopsis (for docs)
     * @param {object[]} [options] 
     * @param {object[]} [examples]
     * @param {string} [standalone]
     * @param {function} [execute]
     * @memberof Command
     */

    constructor({name, aliases, description, options, examples, standalone, execute}) {
        this.name           = name          || false;
        this.aliases        = aliases       || false;
        this.description    = description   || false;
        this.options        = options       || [];
        this.examples       = examples      || [];
        this.default        = standalone    || false;
        this.accessLevel    = 4             // Must be overriden by method for safety
        this.execute        = execute       || console.error(`No executable for ${__filename}`);
    };

    /**
     * Add an argument to this Command (for documentation)
     * @param {string} arg                  Name of option
     * @param {string} effect               Description of option
     * @param {boolean} [required=false]    Whether the option is required
     * @memberof Command
     */
    addOption(arg, effect, required = false) {
        this.options.push({
            arg: arg,
            effect: effect,
            required: required
        });
    };

    /**
     * Add an example to this Command (for documentation)
     * @param {string} args     Example command + options (inc. Command name)
     * @param {string} effect   Description of Command response with these options
     * @memberof Command
     */
    addExample(args, effect) {
        this.examples.push({
            args: args,
            effect: effect
        });
    };

    /**
     * Set the access level cutoff for this Command
     * 
     * For safety each command is set to the maximum access level of 4 (owner).
     * For others to be able to use this Command, the access level must be
     * explicitly overriden via this method. This is a safeguard against beta
     * commands which accept arguments with insufficient input sanitising from
     * misued if they slip into live instances.
     *
     * @param {number|string} tier  - Access tier 0-4 or equivalent name:
     *                                  anon, user, admin, operator, or owner
     * @memberof Command
     */
    setAccessLevel(tier) {
        const accessLevels = ['anon', 'user', 'admin', 'operator', 'owner'];
        if ( !isNaN(parseInt(tier)) && tier <= 4) { 
            this.accessLevel = tier;
        } else {
            try {
                this.accessLevel = accessLevels.indexOf(tier);
            } catch (error) {
                console.error(`${tier} is an invalid access level for ${__filename}: ${error}`);
            };
        };
    };
};

module.exports = Command;