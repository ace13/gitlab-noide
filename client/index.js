'use strict';

var console = require('console');
global.jQuery = require('jquery');
require('bootstrap');

function repadBody() {
    jQuery('body').css('padding-top', jQuery('.navbar:first').height() + 10);
};

jQuery(window)
    .on('resize', repadBody)
    .on('load', repadBody);
