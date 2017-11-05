'use strict';

// As taken from the GitLab API
// https://gitlab.liu.se/help/api/users.md#single-user
var User = module.exports = {
  attributes: [
    'id',

    'username',
    'email',
    'name',

    // For display purposes
    'avatar_url',
    'web_url',
  ],

  http: {
    baseRoute: '/users/',

    actions: {
      store: false,
      update: false,
    }
  },
};
