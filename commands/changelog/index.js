/**
 * Parses `CHANGELOG.md` from the project root into an object representation
 * with some helper functions to access various sections of the changelog
 *
 * @class Changelog
 */
class Changelog {

    // Methods
    parse           = require('./methods/parse.js');
    ageInSeconds    = require('./methods/ageInSeconds');
    getByOffset     = require('./methods/getByOffset');
    getByVersion    = require('./methods/getByVersion');

    // Properties
    get all()       { return this.parse() };
    get header()    { return this.all.header };
    get versions()  { return this.all.versions };
    get current()   { return this.all.versions[0] };

};

module.exports = Changelog;
