'use strict';

var create = function(type, config) {
    return require('./sources/' + type)(config);
};

module.exports = function(config) {
    if (!config || !config.type) { return; }

    var type = config.remove('type');
    delete config.type;
    return create(type, config);
};

