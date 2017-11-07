'use strict';

var create = function(type, config) {
    const Source = require('./sources/' + type);
    return new Source(config);
};

module.exports = function(config) {
    console.log("Config:");
    console.log(config);

    if (!config || !config.type) { return; }

    var type = config.type;
    delete config.type;

    console.log(type);
    return create(type, config);
};

