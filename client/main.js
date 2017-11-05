import Vue from 'vue'
import VueModel from 'vue-model';
import { default as $ } from 'jquery';
const Popper = require('popper');

global.jQuery = global.$ = $;
global.Popper = Popper;

const bootstrap = require('bootstrap');

global.Vue = Vue;

Vue.use(VueModel, {
  user: require('./models/user'),
});

// Change the default data response, not laravel style
VueModel.classes.defaults.http.getDataFromResponse = function(response) {
  return response.data;
};

import App from './App.vue';

global.App = new Vue({
  el: '#app',

  models: [
    'user'
  ],

  render: h => h(App)
});
